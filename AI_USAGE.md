# 🤖 NHẬT KÝ SỬ DỤNG AI (AI USAGE LOG)

> **Tuân thủ quy chuẩn:** Mục 10 của `PROJECT_STANDARD.md`.  
> **Dự án:** YoloHub Fullstack Web (Next.js + Express API + MongoDB) & DevSecOps Infrastructure.  
> **Nguyên tắc an toàn bắt buộc:** Tuyệt đối không đưa mật khẩu thật, JWT secret, private key, token API hoặc dữ liệu thật của người dùng lên AI. Mọi cấu hình và đoạn mã do AI tư vấn đều phải được kỹ sư tự tay kiểm tra, phân tích logic, phản biện và kiểm chứng thực tế.

---

## 1. NGUYÊN TẮC PHÂN VAI VÀ CƠ CHẾ LÀM VIỆC
- **AI đóng vai trò:** Cố vấn kỹ thuật và kiến trúc DevSecOps. Giải thích nguyên lý "Tại sao (Why)", phân tích rủi ro bảo mật (Trade-offs), đưa ra gợi ý tiêu chuẩn công nghiệp (Industry Best Practices) và hỗ trợ soạn thảo tài liệu.
- **Kỹ sư (Người dùng) đóng vai trò:** Chủ thể ra quyết định, trực tiếp gõ và kiểm soát từng dòng code/cấu hình, phản biện thứ tự triển khai, chạy lệnh kiểm thử trên môi trường thực tế và chịu trách nhiệm 100% về hệ thống.

---

## 2. BẢNG THEO DÕI TOÀN BỘ CÁC PHIÊN LÀM VIỆC & KẾT QUẢ KIỂM CHỨNG

| Phiên / Thời điểm | Mục tiêu trao đổi với AI | Đoạn mã / Ý tưởng / Quyết định được áp dụng | Cách kiểm chứng thực tế | Kết quả đánh giá |
|---|---|---|---|---|
| **08/11/2026 - Chiều** | **Đóng gói Dockerfile Frontend (Next.js)** chuẩn DevSecOps để đưa vào CV | - Bật `output: 'standalone'` trong `next.config.ts`.<br>- Kỹ thuật Multi-stage build: `deps` $\rightarrow$ `builder` $\rightarrow$ `runner`.<br>- Tối ưu Layer Caching cho `package*.json`.<br>- Nguyên lý Least Privilege: tạo user không đặc quyền `nextjs:nodejs` (UID 1001).<br>- Tín hiệu tắt máy an toàn (PID 1): dùng `CMD ["node", "server.js"]` thay vì `npm run start`. | Chạy `docker build -t yolohub-ui:v1 .` và kiểm tra dung lượng bằng `docker images yolohub-ui:v1`. | **Đạt:** Kích thước image giảm **85%** (từ ~1.2GB xuống ~180MB). Container chạy cổng 4000 ổn định. |
| **08/11/2026 - Chiều** | **Chống rò rỉ thông tin mật (Secret Hygiene)** | Tạo file `.dockerignore` chặn `.env`, `.env.*`, `.git`, `node_modules` lọt vào Docker build context. | Quan sát log build context và kiểm tra file bên trong container. | **Đạt:** Ngăn chặn 100% nguy cơ vô tình đẩy token/secret lên Docker Registry công khai. |
| **08/11/2026 - Chiều** | **Khởi tạo Docker Compose điều phối FE + BE** | - Định nghĩa các `services:` (`backend`, `frontend`).<br>- Tạo mạng ảo `yolohub-network` (`driver: bridge`).<br>- Thiết lập tự phục hồi `restart: unless-stopped`.<br>- Điều phối thứ tự khởi động `depends_on`. | Chạy lệnh `docker compose up -d` và kiểm tra bằng `docker compose ps`. | **Đạt:** Khởi chạy toàn bộ hệ thống bằng 1 lệnh duy nhất. |
| **08/11/2026 - Tối** | **Làm rõ bản chất MongoDB & Tích hợp Database cục bộ** | - Giải tỏa thắc mắc: MongoDB không nhất thiết phải là đám mây (MongoDB Atlas), mà có thể chạy cục bộ dạng container.<br>- Thêm service `db` dùng image `mongo:7`.<br>- Dùng **Named Volume** `mongodb_data:/data/db` để bảo toàn dữ liệu bền vững.<br>- **Không mở port 27017 ra host/Internet** (Bảo mật chống Ransomware). | Đổi `MONGODB_URI` trong `.env` thành `mongodb://db:27017/yolohub`. Kiểm tra log kết nối `docker logs yolohub-api`. | **Đạt:** Kết nối database thành công qua DNS nội bộ của Docker Network. |
| **08/11/2026 - Tối** | **Đối chiếu và Chuẩn hóa cấu trúc theo `PROJECT_STANDARD.md`** | - Chọn giữ lại MongoDB 7.0 (có lý do kỹ thuật về mô hình phân cấp khóa học E-learning).<br>- Chọn **GitHub Container Registry (`ghcr.io`)** làm Registry tối ưu (không bị rate limit, tích hợp native GitHub token).<br>- Tái cấu trúc thư mục lồng nhau thành chuẩn: `backend/`, `frontend/`, `infra/`, `scripts/`, `docs/`.<br>- Tạo file mẫu `env.example` không chứa secret thật.<br>- Cấu hình **Log Rotation** (`json-file`, `max-size: 10m`, `max-file: 3`) để tránh tràn ổ cứng. | Chạy lệnh kiểm tra cấu trúc thư mục, đối chiếu các ô `[ ]` của Mục 12 và Mục 5.2. | **Đạt:** Cấu trúc repository chuyên nghiệp, chuẩn mực doanh nghiệp. |
| **08/11/2026 - Tối** | **Xây dựng Liveness (`/health`) vs Readiness (`/ready`) Probe** | - Phân biệt bản chất: `/health` (tiến trình Node còn sống không) vs `/ready` (Backend đã kết nối thành công tới Database chưa).<br>- Sử dụng `mongoose.connection.readyState === 1` để xác thực.<br>- Trả về mã `200` khi sẵn sàng, mã `503` khi mất kết nối DB. | Sửa code trong `backend/src/routers/index.ts`, rebuild container bằng `docker compose up -d --build backend`, truy cập `http://localhost:8888/api/v1/ready`. | **Đạt:** Trả về JSON `{ success: true, message: "API is ready", database: "connected" }`. |
| **08/11/2026 - Tối** | **Thiết lập Nginx Reverse Proxy Local & Khóa toàn bộ cổng nội bộ** | - Tạo file cấu hình `infra/nginx/default.conf` đón cổng 80.<br>- Định tuyến `/` $\rightarrow$ `frontend:4000` và `/api/` $\rightarrow$ `backend:8888`.<br>- **Đóng hoàn toàn cổng 8888 và 4000** ra ngoài host (chỉ duy nhất cổng 80 của Nginx mở ra ngoài).<br>- Phân biệt rõ vai trò: file `docker-compose.yml` ở root (phục vụ chạy local) vs `infra/compose/` (phục vụ deploy production). | Chạy `docker compose up -d` và mở trình duyệt truy cập thẳng `http://localhost` và `http://localhost/api/v1/ready` không cần gõ số port. | **Đạt:** Mô hình Reverse Proxy cô lập mạng nội bộ chuẩn DevSecOps Mục 5.1 & 5.2. |

---

## 3. PHÂN TÍCH RỦI RO & PHƯƠNG ÁN THAY THẾ CHO CÁC ĐỀ XUẤT CỦA AI

### 1. Về Base Image: `node:20-alpine` vs `node:20-slim` vs `node:20` (Ubuntu)
- **Đề xuất của AI:** Dùng `node:20-alpine`.
- **Cơ sở kỹ thuật:** Alpine chỉ nặng ~5MB, giúp giảm bề mặt tấn công (Minimal Attack Surface) và giảm hơn 80% lỗ hổng CVEs phổ biến trên các gói tiện ích của hệ điều hành.
- **Rủi ro:** Alpine sử dụng bộ thư viện C tối giản `musl libc` thay vì `glibc`. Một số thư viện Node cần biên dịch mã nguồn C++ có thể bị lỗi.
- **Biện pháp xử lý:** Thêm gói tương thích `apk add --no-cache libc6-compat` ở stage deps.

### 2. Về lệnh khởi động: `CMD ["node", "server.js"]` vs `npm run start`
- **Đề xuất của AI:** Chạy trực tiếp `node server.js` ở stage runner của Next.js standalone.
- **Cơ sở kỹ thuật:** Quản lý tiến trình PID 1. Khi Docker gửi tín hiệu dừng máy `SIGTERM`, tiến trình `node` nhận trực tiếp và đóng kết nối an toàn trong 0.1s (Graceful Shutdown).
- **Rủi ro nếu dùng `npm`:** `npm` chặn tín hiệu, không chuyển tiếp cho `node`. Khi gõ `docker stop`, container bị đơ 10 giây rồi bị Docker ép tắt cưỡng chế bằng `SIGKILL`, nguy cơ làm gián đoạn transaction và hỏng dữ liệu.

### 3. Về Cơ sở dữ liệu: MongoDB 7.0 vs PostgreSQL
- **Đề xuất của AI & Quyết định của Kỹ sư:** Giữ nguyên MongoDB 7.0 thay vì đổi sang PostgreSQL của stack tham chiếu.
- **Cơ sở kỹ thuật:** Mô hình dữ liệu E-learning của YoloHub có cấu trúc lồng nhau phân cấp (Khóa học $\rightarrow$ Chương $\rightarrow$ Bài giảng $\rightarrow$ Trắc nghiệm $\rightarrow$ Thảo luận). NoSQL Document Store xử lý cấu trúc này tối ưu hơn.
- **Biện pháp đảm bảo chuẩn DevSecOps:** Vẫn đáp ứng 100% các tiêu chí bảo mật: cô lập mạng hoàn toàn, lưu trữ bền vững qua Named Volume `mongodb_data`, tài khoản phân quyền và script backup `mongodump` / restore `mongorestore`.

### 4. Về Kiến trúc Mạng: Nginx Reverse Proxy đóng cổng nội bộ
- **Đề xuất của AI:** Xóa bỏ `ports: ["8888:8888"]` và `["4000:4000"]`, chỉ mở duy nhất cổng `80` (và sau này là `443`) qua Nginx.
- **Cơ sở kỹ thuật:** Tránh việc kẻ tấn công quét IP và chọc thẳng vào backend để bypass tường lửa Nginx và WAF Cloudflare.
- **Biện pháp vận hành:** Mọi giao tiếp giữa Nginx, Backend, Frontend và Database đều diễn ra trong mạng bridge nội bộ `yolohub-network` qua tên service.

---

## 4. CAM KẾT HIỂU RÕ VÀ KHẢ NĂNG TÁI HIỆN ĐỘC LẬP
Mọi cấu hình Nginx, lệnh Dockerfile, Docker Compose, cơ chế Liveness/Readiness và cấu trúc thư mục trong dự án này đã được thực hành, kiểm chứng kết quả bằng các lệnh cụ thể (`docker compose ps`, `docker logs`, `curl`) trên môi trường local. Người thực hiện nắm vững bản chất kỹ thuật, tự tin giải thích và phản biện độc lập trong các buổi phỏng vấn tuyển dụng DevSecOps.
