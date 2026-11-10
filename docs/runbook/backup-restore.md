# 📋 BIÊN BẢN KIỂM CHỨNG: SAO LƯU & PHỤC HỒI DATABASE (MỤC 4)

> **Tuân thủ quy chuẩn:** Mục 4 & Mục 15 của `PROJECT_STANDARD.md`.  
> **Hệ thống:** MongoDB 7.0 (Container `yolohub-db`)  
> **Ngày thực hiện:** 09/11/2026

---

## 1. THIẾT LẬP HẠ TẦNG & TÍNH BẢO MẬT
- **Tên Container:** `yolohub-db` (Image: `mongo:7`).
- **Mạng:** `yolohub-network` (Mạng bridge nội bộ).
- **Trạng thái cổng:** **KHÔNG MỞ PORT 27017 RA HOST**. Chỉ duy nhất các container trong mạng nội bộ mới có quyền truy cập.
- **Lưu trữ bền vững (Data Persistence):** Sử dụng Named Volume `mongodb_data` gắn vào `/data/db`.

---

## 2. KỊCH BẢN KIỂM CHỨNG (3 BƯỚC THỰC NGHIỆM)

### 🔹 Kịch bản 1: Kiểm chứng nạp dữ liệu mẫu (Seed Mock Data)
- **Lệnh thực hiện:** `docker compose run --rm seed`
- **Kết quả:**
  - Nạp thành công Roles (Super Admin, Admin, Student, Guest).
  - Nạp 5 danh mục khóa học (Web Development, Data Science, UI/UX...).
  - Nạp 5 khóa học mẫu và tài khoản quản trị.
- **Xác minh qua API:**
  - Endpoint `GET http://localhost/api/v1/categories/all` trả về HTTP 200 kèm danh sách 5 danh mục.

### 🔹 Kịch bản 2: Kiểm chứng Sao lưu (Backup)
- **Script sử dụng:** `scripts/backup-db.ps1` (Local) / `scripts/backup-db.sh` (Production).
- **Lệnh cốt lõi:**
  ```bash
  docker exec yolohub-db mongodump --db yolohub --archive="/tmp/dump.gz" --gzip
  ```
- **Kết quả:**
  - File sao lưu được sinh ra tại: `backups/yolohub_backup_*.archive.gz`.
  - Dung lượng file: `> 0 bytes` (toàn bộ dữ liệu được nén dạng BSON gzip an toàn).

### 🔹 Kịch bản 3: Kiểm chứng Phục hồi sau thảm họa (Disaster Recovery)
- **Script sử dụng:** `scripts/restore-db.ps1` (Local) / `scripts/restore-db.sh` (Production).
- **Lệnh cốt lõi:**
  ```bash
  docker exec yolohub-db mongorestore --archive="/tmp/restore.gz" --gzip --drop
  ```
- **Kết quả xác minh:**
  - Cờ `--drop` tự động làm sạch các collection cũ trước khi nạp dữ liệu từ file backup.
  - Sau khi restore, gọi lại API `GET http://localhost/api/v1/categories/all` $\rightarrow$ Toàn bộ dữ liệu được khôi phục nguyên vẹn 100%.

---

## 3. KẾT LUẬN NGHIỆM THU
- [x] Không lộ cổng DB ra Internet (Port 27017 closed).
- [x] Dữ liệu được bảo toàn qua restart container nhờ Named Volume `mongodb_data`.
- [x] Có công cụ và quy trình sao lưu định kỳ bằng `mongodump`.
- [x] Có quy trình phục hồi khẩn cấp bằng `mongorestore --drop`.

