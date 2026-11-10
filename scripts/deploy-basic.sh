#!/bin/bash
# ==============================================================================
# Script: deploy-basic.sh
# Mục đích: Triển khai ứng dụng tự động bằng Docker Compose (Mục 6.4 chuẩn DevSecOps)
# ==============================================================================

# Bắt buộc dừng script ngay lập tức nếu có bất kỳ lệnh nào bị lỗi hoặc biến chưa khai báo
set -euo pipefail

# ------------------------------------------------------------------------------
# 1. Hiển thị thông tin người thực thi và máy chủ
# ------------------------------------------------------------------------------
echo "=========================================================="
echo "🚀 BẮT ĐẦU QUY TRÌNH DEPLOY YOLOHUB PLATFORM"
echo "👤 Thực thi bởi user : $(whoami)"
echo "🖥️ Máy chủ (host)    : $(hostname)"
echo "⏰ Thời gian         : $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================================="

# ------------------------------------------------------------------------------
# 2. Định vị thư mục gốc của dự án
# ------------------------------------------------------------------------------
# Lấy thư mục cha của thư mục chứa script này (tức là thư mục gốc repo)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "📂 Kiểm tra thư mục dự án: ${PROJECT_DIR}"
if [ ! -d "${PROJECT_DIR}" ]; then
  echo "❌ [LỖI NGHIÊM TRỌNG] Thư mục dự án không tồn tại: ${PROJECT_DIR}" >&2
  exit 1
fi

cd "${PROJECT_DIR}"
echo "✅ Đã chuyển đến thư mục làm việc: $(pwd)"

# ------------------------------------------------------------------------------
# 3. Xác định phiên bản Image (Mã commit SHA hoặc latest)
# ------------------------------------------------------------------------------
# Cho phép truyền tag qua tham số: ./deploy-basic.sh sha-a1b2c3d
TAG="${1:-latest}"
export TAG
echo "🏷️ Phiên bản Docker Image triển khai (TAG): ${TAG}"

COMPOSE_FILE="infra/compose/docker-compose.prod.yml"
if [ ! -f "${COMPOSE_FILE}" ]; then
  echo "❌ [LỖI] Không tìm thấy file compose production: ${COMPOSE_FILE}" >&2
  exit 1
fi

# ------------------------------------------------------------------------------
# 4. Kéo Docker Image mới nhất từ GitHub Container Registry (GHCR)
# ------------------------------------------------------------------------------
echo ""
echo "📥 [BƯỚC 1/4] Kéo các Docker Images đã kiểm thử từ GHCR..."
docker compose -f "${COMPOSE_FILE}" pull backend frontend reverse-proxy || {
  echo "⚠️ Cảnh báo: Kéo image thất bại. Sẽ thử chạy bằng image sẵn có nếu có."
}

# ------------------------------------------------------------------------------
# 5. Khởi động lại hệ thống với Docker Compose
# ------------------------------------------------------------------------------
echo ""
echo "🔄 [BƯỚC 2/4] Cập nhật và khởi động các container..."
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans

# ------------------------------------------------------------------------------
# 6. Kiểm tra trạng thái hoạt động của Container
# ------------------------------------------------------------------------------
echo ""
echo "📊 [BƯỚC 3/4] Trạng thái các container sau khi khởi động:"
docker compose -f "${COMPOSE_FILE}" ps

# ------------------------------------------------------------------------------
# 7. In 40 dòng log gần nhất để kiểm tra lỗi lúc khởi động
# ------------------------------------------------------------------------------
echo ""
echo "📋 [BƯỚC 4/4] 40 dòng log gần nhất của Backend và Nginx:"
echo "------------------- [BACKEND LOGS] -------------------"
docker compose -f "${COMPOSE_FILE}" logs --tail=20 backend || true
echo "------------------- [NGINX LOGS] ---------------------"
docker compose -f "${COMPOSE_FILE}" logs --tail=20 reverse-proxy || true

echo ""
echo "=========================================================="
echo "🎉 DEPLOY HOÀN TẤT THÀNH CÔNG!"
echo "👉 Bước tiếp theo: Hãy chạy './scripts/verify.sh' để kiểm thử toàn diện."
echo "=========================================================="

