#!/bin/bash
# ==============================================================================
# Script: backup-db.sh
# Mục đích: Tự động sao lưu MongoDB database 'yolohub' ra file nén .archive.gz
# Chuẩn mực: Mục 4 & 6.4 trong PROJECT_STANDARD.md
# ==============================================================================

set -euo pipefail

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="yolohub_backup_${TIMESTAMP}.archive.gz"
CONTAINER_NAME="yolohub-db"
DB_NAME="yolohub"

echo "=========================================================="
echo "📦 BẮT ĐẦU QUÁ TRÌNH SAO LƯU DATABASE: ${DB_NAME}"
echo "⏰ Thời gian: $(date)"
echo "=========================================================="

# 1. Kiểm tra container MongoDB có đang chạy không
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ LỖI: Container '${CONTAINER_NAME}' không đang chạy!"
    echo "👉 Hãy chạy 'docker compose up -d' trước."
    exit 1
fi

# 2. Tạo thư mục lưu backup trên máy host
mkdir -p "${BACKUP_DIR}"

# 3. Chạy mongodump bên trong container và nén dữ liệu qua luồng stdout
echo "🔄 Đang trích xuất dữ liệu từ container '${CONTAINER_NAME}'..."
docker exec "${CONTAINER_NAME}" mongodump --db "${DB_NAME}" --archive --gzip > "${BACKUP_DIR}/${BACKUP_FILENAME}"

# 4. Kiểm tra file backup sinh ra
if [ -s "${BACKUP_DIR}/${BACKUP_FILENAME}" ]; then
    FILE_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILENAME}" | cut -f1)
    echo "✅ SAO LƯU THÀNH CÔNG!"
    echo "📁 File lưu tại: ${BACKUP_DIR}/${BACKUP_FILENAME}"
    echo "📊 Dung lượng file: ${FILE_SIZE}"
else
    echo "❌ LỖI: File backup tạo ra bị rỗng hoặc lỗi!"
    exit 1
fi

echo "=========================================================="

