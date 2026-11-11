
#!/usr/bin/env bash
# ==============================================================================
# YOLOHUB - POST-DEPLOYMENT VERIFICATION
# Cloudflare -> Ubuntu Host Nginx -> Docker (Frontend:4000, Backend:8888)
# Chỉ kiểm tra tài nguyên YOLOHUB, không quét container/website khác.
# ==============================================================================

set -Eeuo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${PROJECT_DIR}"

COMPOSE_FILE="infra/compose/docker-compose.prod.yml"
ROOT_DOMAIN="truongtest.id.vn"
ADMIN_DOMAIN="admin.truongtest.id.vn"
API_DOMAIN="api.truongtest.id.vn"
ORIGIN_CERT="/etc/ssl/cloudflare/truongtest/origin.pem"

FAIL_COUNT=0
WARN_COUNT=0

pass() { echo "✅ [PASS] $1"; }
fail() { echo "❌ [FAIL] $1"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
warn() { echo "⚠️ [WARN] $1"; WARN_COUNT=$((WARN_COUNT + 1)); }

http_status() {
    local url="$1"
    shift
    curl -k -sS -o /dev/null -w '%{http_code}' \
        --connect-timeout 3 --max-time 10 "$@" "$url" 2>/dev/null || true
}

check_http_200() {
    local label="$1" url="$2" status="000"
    shift 2
    local attempt

    for attempt in {1..6}; do
        status="$(http_status "$url" "$@")"
        [[ "$status" == "200" ]] && {
            pass "$label (HTTP 200)"
            return 0
        }
        sleep 2
    done

    fail "$label (HTTP ${status}, mong đợi 200)"
    return 1
}

check_http_2xx3xx() {
    local label="$1" url="$2" status="000"
    shift 2
    local attempt

    for attempt in {1..6}; do
        status="$(http_status "$url" "$@")"
        [[ "$status" =~ ^[23][0-9][0-9]$ ]] && {
            pass "$label (HTTP ${status})"
            return 0
        }
        sleep 2
    done

    fail "$label (HTTP ${status}, mong đợi 2xx hoặc 3xx)"
    return 1
}

check_container() {
    local container="$1"
    local status

    status="$(docker inspect --format '{{.State.Status}}' \
        "$container" 2>/dev/null || true)"

    if [[ "$status" == "running" ]]; then
        pass "Container ${container} đang chạy"
    else
        fail "Container ${container} không chạy (trạng thái: ${status:-không tồn tại})"
    fi
}

echo "=========================================================="
echo "🔍 YOLOHUB - POST-DEPLOYMENT VERIFICATION"
echo "📂 Project: ${PROJECT_DIR}"
echo "🖥️ Server : $(hostname)"
echo "⏰ Time   : $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================================="

# 1. Docker và Compose configuration
echo ""
echo "[1/7] Kiểm tra Docker và cấu hình Compose..."

if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
    fail "Không kết nối được Docker daemon"
    exit 1
fi

pass "Docker daemon hoạt động"

if [[ ! -f "$COMPOSE_FILE" ]]; then
    fail "Không tìm thấy ${COMPOSE_FILE}"
    exit 1
fi

if docker compose -f "$COMPOSE_FILE" config --quiet; then
    pass "Docker Compose configuration hợp lệ"
else
    fail "Docker Compose configuration không hợp lệ"
    exit 1
fi

SERVICES="$(docker compose -f "$COMPOSE_FILE" config --services)"

for service in db backend frontend; do
    if grep -qx "$service" <<< "$SERVICES"; then
        pass "Compose có service ${service}"
    else
        fail "Compose thiếu service ${service}"
    fi
done

if grep -qx "reverse-proxy" <<< "$SERVICES"; then
    fail "Compose vẫn có reverse-proxy; kiến trúc hiện tại dùng Nginx host"
else
    pass "Không có reverse-proxy container trong Compose"
fi

# 2. Chỉ kiểm tra container thuộc YOLOHUB
echo ""
echo "[2/7] Kiểm tra trạng thái 3 container YOLOHUB..."

check_container "yolohub-db"
check_container "yolohub-api"
check_container "yolohub-ui"

echo ""
docker compose -f "$COMPOSE_FILE" ps

# 3. MongoDB không được publish port ra host
echo ""
echo "[3/7] Kiểm tra Database không mở port ra host..."

DB_PORTS="$(docker port yolohub-db 2>/dev/null || true)"

if [[ -z "$DB_PORTS" ]]; then
    pass "MongoDB không publish port nào ra host"
else
    fail "MongoDB đang publish port ra host: ${DB_PORTS}"
fi

# 4. Kiểm tra Backend trực tiếp qua loopback
echo ""
echo "[4/7] Kiểm tra Backend API trực tiếp..."

check_http_200 "Backend /api/v1/health tại cổng 8888" \
    "http://127.0.0.1:8888/api/v1/health"

READY_CONTENT=""
READY_OK=false

for attempt in {1..6}; do
    READY_CONTENT="$(curl -fsS --connect-timeout 3 --max-time 10 \
        http://127.0.0.1:8888/api/v1/ready 2>/dev/null || true)"

    if grep -Eqi '"database"[[:space:]]*:[[:space:]]*"connected"' \
        <<< "$READY_CONTENT"; then
        READY_OK=true
        break
    fi

    sleep 2
done

if [[ "$READY_OK" == true ]]; then
    pass "Backend /api/v1/ready xác nhận MongoDB connected"
else
    fail "Backend chưa Ready hoặc MongoDB chưa kết nối. Response: ${READY_CONTENT:-không có response}"
fi

# 5. Kiểm tra Frontend trực tiếp qua loopback
echo ""
echo "[5/7] Kiểm tra Frontend trực tiếp..."

check_http_2xx3xx "Frontend tại cổng 4000" \
    "http://127.0.0.1:4000/"

# 6. Kiểm tra Nginx host và HTTPS routing nội bộ
echo ""
echo "[6/7] Kiểm tra Nginx host, SSL certificate và domain routing..."

if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet nginx; then
    pass "Nginx trên Ubuntu host đang active"
else
    fail "Nginx trên Ubuntu host không active"
fi

if command -v nginx >/dev/null 2>&1 && nginx -t; then
    pass "Nginx configuration hợp lệ (nginx -t)"
else
    fail "Nginx configuration kiểm tra thất bại"
fi

if [[ -s "$ORIGIN_CERT" ]]; then
    pass "Tìm thấy Cloudflare Origin Certificate"

    if command -v openssl >/dev/null 2>&1; then
        for domain in "$ROOT_DOMAIN" "$ADMIN_DOMAIN" "$API_DOMAIN"; do
            if openssl x509 -in "$ORIGIN_CERT" -noout \
                -checkhost "$domain" >/dev/null 2>&1; then
                pass "SSL certificate hợp lệ cho ${domain}"
            else
                fail "SSL certificate không khớp domain ${domain}"
            fi
        done
    else
        warn "Không có openssl để kiểm tra SAN của certificate"
    fi
else
    fail "Không tìm thấy Origin Certificate tại ${ORIGIN_CERT}"
fi

# --resolve giúp kiểm tra Nginx ngay trên máy chủ,
# không phụ thuộc DNS công khai hay Cloudflare.

check_http_2xx3xx "Domain Frontend https://${ROOT_DOMAIN}" \
    "https://${ROOT_DOMAIN}/" \
    --resolve "${ROOT_DOMAIN}:443:127.0.0.1"

check_http_2xx3xx "Domain Admin https://${ADMIN_DOMAIN}" \
    "https://${ADMIN_DOMAIN}/" \
    --resolve "${ADMIN_DOMAIN}:443:127.0.0.1"

check_http_200 "Domain API https://${API_DOMAIN}/api/v1/health" \
    "https://${API_DOMAIN}/api/v1/health" \
    --resolve "${API_DOMAIN}:443:127.0.0.1"

# 7. Hiển thị log gần nhất của riêng YOLOHUB
echo ""
echo "[7/7] Kiểm tra log gần nhất của YOLOHUB..."

LOG_HINTS="$(docker compose -f "$COMPOSE_FILE" \
    logs --tail=80 db backend frontend 2>&1 \
    | grep -iE 'uncaughtException|EADDRINUSE|MongoServerSelectionError' || true)"

if [[ -n "$LOG_HINTS" ]]; then
    warn "Log có dấu hiệu cần xem lại:"
    echo "$LOG_HINTS"
else
    pass "Không thấy các lỗi runtime nghiêm trọng thường gặp trong log gần nhất"
fi

# TỔNG KẾT
echo ""
echo "=========================================================="

if [[ "$FAIL_COUNT" -eq 0 ]]; then
    echo "🏆 KẾT QUẢ: PASS - Các kiểm tra YOLOHUB đều đạt."

    if [[ "$WARN_COUNT" -gt 0 ]]; then
        echo "⚠️ Có ${WARN_COUNT} cảnh báo cần xem lại."
    fi

    echo "Frontend : https://${ROOT_DOMAIN}"
    echo "Admin    : https://${ADMIN_DOMAIN}"
    echo "API      : https://${API_DOMAIN}"
    echo "=========================================================="
    exit 0
else
    echo "🚨 KẾT QUẢ: FAIL - Có ${FAIL_COUNT} kiểm tra thất bại."
    echo "Hãy xử lý các mục FAIL trước khi xác nhận hệ thống hoạt động ổn định."
    echo "=========================================================="
    exit 1
fi
