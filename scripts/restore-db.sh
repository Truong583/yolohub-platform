#!/bin/bash
# ==============================================================================
# Script: restore-db.sh
# Mục đích: Phục hồi MongoDB database 'yolohub' từ file backup .archive.gz
# Chuẩn mực: Mục 4 & 6.4 trong PROJECT_STANDARD.md
# ==============================================================================

set -euo pipefail

BACKUP_DIR="./backups"
CONTAINER_NAME="yolohub-db"
DB_NAME="yolohub"

echo "=========================================================="
echo "🔄 BẮT ĐẦU QUÁ TRÌNH PHỤC HỒI DATABASE: ${DB_NAME}"
echo "⏰ Thời gian: $(date)"
echo "=========================================================="

# 1. Xác định file backup cần restore
# Nếu người dùng truyền đường dẫn file qua tham số $1 thì dùng, ngược lại lấy file mới nhất
if [ -n "${1:-}" ]; then
    RESTORE_FILE="$1"
else
    # Lấy file mới nhất trong thư mục backups
    RESTORE_FILE=$(ls -t "${BACKUP_DIR}"/yolohub_backup_*.archive.gz 2>/dev/null | head -n 1 || true)
fi

if [ -z "${RESTORE_FILE}" ] || [ ! -f "${RESTORE_FILE}" ]; then
    echo "❌ LỖI: Không tìm thấy file backup nào để phục hồi!"
    echo "👉 Hãy đảm bảo thư mục '${BACKUP_DIR}' có chứa file backup."
    exit 1
fi

echo "📁 File được chọn để phục hồi: ${RESTORE_FILE}"

# 2. Kiểm tra container MongoDB có đang chạy không
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ LỖI: Container '${CONTAINER_NAME}' không đang chạy!"
    echo "👉 Hãy chạy 'docker compose up -d' trước."
    exit 1
fi

# 3. Chạy mongorestore với cờ --drop để ghi đè sạch sẽ
echo "⚠️  CẢNH BÁO: Đang phục hồi dữ liệu và xóa dữ liệu cũ trùng lặp (--drop)..."
docker exec -i "${CONTAINER_NAME}" mongorestore --archive --gzip --drop < "${RESTORE_FILE}"

echo "✅ PHỤC HỒI THÀNH CÔNG!"
echo "🎉 Toàn bộ dữ liệu từ ${RESTORE_FILE} đã được nạp lại vào Database '${DB_NAME}'."
echo "=========================================================="

