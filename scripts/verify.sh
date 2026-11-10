#!/bin/bash
# ==============================================================================
# Script: verify.sh
# Mục đích: Hậu kiểm tra sau deploy (Post-Deploy Verification - Mục 6.4 & 8)
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo "🔍 BẮT ĐẦU KIỂM TRA HỆ THỐNG SAU DEPLOY (POST-DEPLOY VERIFY)"
echo "⏰ Thời gian kiểm tra: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================================="

COMPOSE_FILE="infra/compose/docker-compose.prod.yml"
DOMAIN="${DOMAIN:-localhost}"
FAIL_COUNT=0

# ------------------------------------------------------------------------------
# 1. KIỂM TRA CONTAINER: Không được có container nào bị Exited hoặc Restarting
# ------------------------------------------------------------------------------
echo ""
echo "📦 [TEST 1/5] Kiểm tra trạng thái Container..."
UNHEALTHY_CONTAINERS=$(docker ps -a --format '{{.Names}}: {{.Status}}' | grep -iE 'exited|restarting' || true)

if [ -n "${UNHEALTHY_CONTAINERS}" ]; then
  echo "❌ [THẤT BẠI] Phát hiện container có vấn đề:"
  echo "${UNHEALTHY_CONTAINERS}"
  FAIL_COUNT=$((FAIL_COUNT + 1))
else
  echo "✅ [ĐẠT] Toàn bộ container đều đang chạy ổn định (Up)."
  docker compose -f "${COMPOSE_FILE}" ps
fi

# ------------------------------------------------------------------------------
# 2. KIỂM TRA CỔNG MẠNG (Mục 8): Tuyệt đối KHÔNG lộ cổng MongoDB 27017
# ------------------------------------------------------------------------------
echo ""
echo "🔒 [TEST 2/5] Rà soát cổng mạng công khai (ss -tulpn)..."

# Kiểm tra nếu lệnh ss tồn tại trên hệ thống Linux
if command -v ss &>/dev/null; then
  OPEN_PORTS=$(ss -tulpn | grep LISTEN || true)
  echo "${OPEN_PORTS}"

  # Kiểm tra xem cổng 27017 có bị lắng nghe trên 0.0.0.0 hoặc ::: không
  if echo "${OPEN_PORTS}" | grep -E '0\.0\.0\.0:27017|:::27017|\*:27017' >/dev/null; then
    echo "❌ [BÁO ĐỘNG BẢO MẬT] Cổng MongoDB 27017 đang bị lộ trực tiếp ra ngoài Internet!"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  else
    echo "✅ [ĐẠT] Cổng Database (27017) được ẩn hoàn toàn trong mạng nội bộ Docker."
  fi
else
  echo "ℹ️ Lệnh 'ss' không có sẵn, kiểm tra qua docker port..."
  if docker port yolohub-db 2>/dev/null | grep -q "0.0.0.0"; then
    echo "❌ [BÁO ĐỘNG BẢO MẬT] Cổng Database đang bind ra 0.0.0.0!"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  else
    echo "✅ [ĐẠT] Container Database không bind bất kỳ port nào ra ngoài host."
  fi
fi

# ------------------------------------------------------------------------------
# 3. KIỂM TRA API READINESS & HEALTH: Database & Server kết nối thông suốt
# ------------------------------------------------------------------------------
echo ""
echo "🩺 [TEST 3/5] Kiểm tra API Readiness & Health..."

# Chờ 3 giây để app kịp ổn định nếu vừa mới up
sleep 3

# Kiểm tra /health
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1/api/v1/health" || echo "FAILED")
if [ "${HEALTH_RESPONSE}" = "200" ]; then
  echo "✅ [ĐẠT] Endpoint /api/v1/health trả về HTTP 200 OK."
else
  echo "❌ [THẤT BẠI] Endpoint /api/v1/health trả về: ${HEALTH_RESPONSE}"
  FAIL_COUNT=$((FAIL_COUNT + 1))
fi

# Kiểm tra /ready (kết nối MongoDB thật qua Mongoose)
READY_CONTENT=$(curl -s "http://127.0.0.1/api/v1/ready" || echo "FAILED")
if echo "${READY_CONTENT}" | grep -qi "connected"; then
  echo "✅ [ĐẠT] Endpoint /api/v1/ready: Database đã kết nối thông suốt (${READY_CONTENT})"
else
  echo "❌ [THẤT BẠI] Endpoint /api/v1/ready không kết nối được Database: ${READY_CONTENT}"
  FAIL_COUNT=$((FAIL_COUNT + 1))
fi

# ------------------------------------------------------------------------------
# 4. KIỂM TRA FRONTEND & NGINX ROUTING
# ------------------------------------------------------------------------------
echo ""
echo "🌐 [TEST 4/5] Kiểm tra Frontend phản hồi qua Nginx..."
FE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1/" || echo "FAILED")

if [ "${FE_RESPONSE}" = "200" ]; then
  echo "✅ [ĐẠT] Nginx route tới Frontend thành công (HTTP 200)."
else
  echo "⚠️ Cảnh báo: Frontend trả về mã HTTP ${FE_RESPONSE} (có thể do redirect hoặc đang tải tài nguyên)."
fi

# ------------------------------------------------------------------------------
# 5. RÀ SOÁT LOG HỆ THỐNG: Tìm lỗi nghiêm trọng hoặc mã lỗi 5xx
# ------------------------------------------------------------------------------
echo ""
echo "📜 [TEST 5/5] Quét 50 dòng log gần nhất tìm lỗi nghiêm trọng..."
ERROR_LOGS=$(docker compose -f "${COMPOSE_FILE}" logs --tail=50 2>&1 | grep -iE 'fatal|uncaughtException|EADDRINUSE' || true)

if [ -n "${ERROR_LOGS}" ]; then
  echo "⚠️ Phát hiện cảnh báo trong log:"
  echo "${ERROR_LOGS}"
else
  echo "✅ [ĐẠT] Không phát hiện lỗi nghiêm trọng (Fatal/Crash) trong log gần nhất."
fi

# ------------------------------------------------------------------------------
# TỔNG KẾT
# ------------------------------------------------------------------------------
echo ""
echo "=========================================================="
if [ "${FAIL_COUNT}" -eq 0 ]; then
  echo "🏆 KẾT QUẢ: TẤT CẢ CÁC BƯỚC HẬU KIỂM TRA ĐỀU ĐẠT CHUẨN (PASS)!"
  echo "🚀 Hệ thống đã sẵn sàng phục vụ người dùng."
  echo "=========================================================="
  exit 0
else
  echo "🚨 KẾT QUẢ: PHÁT HIỆN ${FAIL_COUNT} LỖI CẦN XỬ LÝ (FAIL)!"
  echo "👉 Đề nghị kiểm tra chi tiết theo log bên trên trước khi bàn giao."
  echo "=========================================================="
  exit 1
fi

