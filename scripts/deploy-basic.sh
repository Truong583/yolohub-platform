
#!/usr/bin/env bash

# ============================================================
# YOLOHUB - PRODUCTION DEPLOYMENT SCRIPT
# Cloudflare -> Ubuntu Nginx -> Docker Containers
# ============================================================

set -Eeuo pipefail

# ------------------------------------------------------------
# 1. PROJECT INFORMATION
# ------------------------------------------------------------

echo "=========================================================="
echo "🚀 BẮT ĐẦU DEPLOY YOLOHUB PLATFORM"
echo "👤 User       : $(whoami)"
echo "🖥️ Server     : $(hostname)"
echo "⏰ Thời gian  : $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================================="

# ------------------------------------------------------------
# 2. FIND PROJECT DIRECTORY
# ------------------------------------------------------------

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${PROJECT_DIR}"

echo "📂 Project directory: ${PROJECT_DIR}"

# ------------------------------------------------------------
# 3. CONFIGURATION
# ------------------------------------------------------------

COMPOSE_FILE="infra/compose/docker-compose.prod.yml"

# Default deployment tag is latest.
# Can deploy a specific version:
# ./scripts/deploy-basic.sh sha-<commit-sha>

TAG="${1:-latest}"
export TAG

echo "🏷️ Docker Image TAG: ${TAG}"

# Validate Docker tag format
if [[ ! "${TAG}" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$ ]]; then
    echo "❌ Invalid Docker image tag: ${TAG}" >&2
    exit 1
fi

# ------------------------------------------------------------
# 4. CHECK REQUIREMENTS
# ------------------------------------------------------------

echo ""
echo "🔍 Kiểm tra môi trường triển khai..."

if ! command -v docker >/dev/null 2>&1; then
    echo "❌ Docker chưa được cài đặt." >&2
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "❌ Không thể kết nối Docker daemon." >&2
    exit 1
fi

if [[ ! -f "${COMPOSE_FILE}" ]]; then
    echo "❌ Không tìm thấy ${COMPOSE_FILE}" >&2
    exit 1
fi

# Required production environment files
for ENV_FILE in backend/.env frontend/.env; do
    if [[ ! -f "${ENV_FILE}" ]]; then
        echo "❌ Thiếu environment file: ${ENV_FILE}" >&2
        echo "Hãy tạo file từ env.example và điền giá trị production." >&2
        exit 1
    fi
done

echo "✅ Docker daemon hoạt động."
echo "✅ Compose file tồn tại."
echo "✅ Environment files tồn tại."

# ------------------------------------------------------------
# 5. VALIDATE DOCKER COMPOSE CONFIGURATION
# ------------------------------------------------------------

echo ""
echo "🧪 Kiểm tra Docker Compose configuration..."

docker compose -f "${COMPOSE_FILE}" config --quiet

SERVICES="$(docker compose -f "${COMPOSE_FILE}" config --services)"

for SERVICE in db backend frontend; do
    if ! grep -qx "${SERVICE}" <<< "${SERVICES}"; then
        echo "❌ Thiếu service bắt buộc: ${SERVICE}" >&2
        exit 1
    fi
done

if grep -qx "reverse-proxy" <<< "${SERVICES}"; then
    echo "❌ Compose vẫn chứa reverse-proxy."
    echo "YOLOHUB phải sử dụng Nginx trên Ubuntu host."
    exit 1
fi

echo "✅ Compose configuration hợp lệ."
echo "✅ Services: db, backend, frontend."

# ------------------------------------------------------------
# 6. PULL DOCKER IMAGES FROM GHCR
# ------------------------------------------------------------

echo ""
echo "📥 [BƯỚC 1/3] Pull Docker Images từ GHCR..."

docker compose -f "${COMPOSE_FILE}" pull db backend frontend

echo "✅ Đã pull toàn bộ Docker Images."

# ------------------------------------------------------------
# 7. START / UPDATE APPLICATION CONTAINERS
# ------------------------------------------------------------

echo ""
echo "🔄 [BƯỚC 2/3] Khởi động các container..."

# Remove the old YOLOHUB Nginx container if it is an orphan
# Preserve MongoDB named volume and existing data.
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans

echo "✅ Docker Compose đã cập nhật container."

# ------------------------------------------------------------
# 8. DISPLAY CONTAINER STATUS
# ------------------------------------------------------------

echo ""
echo "📊 [BƯỚC 3/3] Trạng thái container..."

docker compose -f "${COMPOSE_FILE}" ps

# ------------------------------------------------------------
# 9. DISPLAY RECENT LOGS
# ------------------------------------------------------------

echo ""
echo "📋 Backend, Frontend và Database logs..."

docker compose -f "${COMPOSE_FILE}" logs --tail=30 db backend frontend

# ------------------------------------------------------------
# 10. DEPLOYMENT SUMMARY
# ------------------------------------------------------------

echo ""
echo "=========================================================="
echo "✅ LỆNH DEPLOY ĐÃ HOÀN TẤT."
echo ""
echo "Frontend : http://127.0.0.1:4000"
echo "Backend  : http://127.0.0.1:8888"
echo "API      : https://api.truongtest.id.vn"
echo ""
echo "👉 Tiếp theo: chạy ./scripts/verify.sh"
echo "để kiểm tra ứng dụng sau triển khai."
echo "=========================================================="
