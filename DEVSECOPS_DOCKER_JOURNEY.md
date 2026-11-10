# 🛡️ DEVSECOPS JOURNEY: DOCKERIZE & DOCKER COMPOSE CHO NEXT.JS & NODE.JS API

> **Tài liệu ghi chú quá trình thực hành, tư duy DevSecOps và hướng dẫn phỏng vấn / đưa vào CV.**  
> *Dự án: Hệ thống YoloHub (Frontend Next.js + Backend Express API)*  
> *Ngày ghi nhận: 08/11/2026*

---

## 📑 MỤC LỤC
1. [Khung tư duy DevSecOps cốt lõi](#1-khung-tư-duy-devsecops-cốt-lõi)
2. [Bước 1: Chuẩn bị mã nguồn Next.js (`output: 'standalone'`)](#2-bước-1-chuẩn-bị-mã-nguồn-nextjs-output-standalone)
3. [Bước 2: Chốt chặn bảo mật đầu tiên (`.dockerignore`)](#3-bước-2-chốt-chặn-bảo-mật-đầu-tiên-dockerignore)
4. [Bước 3: Xây dựng Dockerfile Frontend chuẩn Multi-Stage](#4-bước-3-xây-dựng-dockerfile-frontend-chuẩn-multi-stage)
5. [Bước 4: Điều phối toàn bộ hệ thống bằng Docker Compose](#5-bước-4-điều-phối-toàn-bộ-hệ-thống-bằng-docker-compose)
6. [Các bài học thực chiến & Bẫy kinh điển (Troubleshooting)](#6-các-bài-học-thực-chiến--bẫy-kinh-điển-troubleshooting)
7. [Chỉ số đo lường (Metrics) đưa vào CV & Trả lời phỏng vấn](#7-chỉ-số-đo-lường-metrics-đưa-vào-cv--trả-lời-phỏng-vấn)
8. [Kế hoạch các bước tiếp theo](#8-kế-hoạch-các-bước-tiếp-theo)

---

## 1. KHUNG TƯ DUY DEVSECOPS CỐT LÕI

Khi đóng gói bất kỳ ứng dụng nào bằng Docker, không nhảy vào viết ngay mà luôn trả lời **4 câu hỏi theo thứ tự**:
1. **Runtime:** Ứng dụng chạy trên môi trường gì? $\rightarrow$ Chọn Base Image tối giản (`node:20-alpine`) thay vì bản đầy đủ để thu hẹp bề mặt tấn công (Minimal Attack Surface).
2. **Caching:** Quá trình cài đặt phụ thuộc vào đâu? $\rightarrow$ Tách riêng `package.json` cài trước để tận dụng Docker Layer Caching.
3. **Rác & Bảo mật:** Quá trình build sinh ra rác gì? $\rightarrow$ Dùng Multi-stage để vứt bỏ devDependencies, công cụ build (TypeScript, PostCSS, ESLint) trước khi lên Production.
4. **Đặc quyền:** Ai chạy tiến trình trong container? $\rightarrow$ Tuyệt đối cấm chạy bằng `root`. Tạo user không đặc quyền (Least Privilege - `USER nextjs`).

---

## 2. BƯỚC 1: Chuẩn bị mã nguồn Next.js (`output: 'standalone'`)

- **File cấu hình:** `yolohub-ui/yolohub-ui/next.config.ts`
- **Thao tác:** Bật `output: "standalone"` bên trong `nextConfig`.
- **Bản chất kỹ thuật:**
  - Mặc định Next.js cần cả thư mục `node_modules` (~1GB - 1.5GB) để chạy `next start`.
  - Tính năng `standalone` phân tích cây phụ thuộc (Tree-shaking), gom toàn bộ mã chạy vào thư mục độc lập `.next/standalone` chỉ nặng khoảng ~50-80MB, kèm file `server.js` chạy trực tiếp bằng Node.

```typescript
const nextConfig: NextConfig = {
    output: "standalone", // Kích hoạt đóng gói siêu nhẹ
    reactStrictMode: false,
    ...
};
```

---

## 3. BƯỚC 2: Chốt chặn bảo mật đầu tiên (`.dockerignore`)

- **File:** `yolohub-ui/yolohub-ui/.dockerignore`
- **Tư duy DevSecOps:** Khi gõ `docker build .`, toàn bộ thư mục được nén gửi sang Docker Daemon. Nếu thiếu `.dockerignore`:
  - Lộ file `.env` chứa token bí mật (`GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`...).
  - Đẩy thư mục `node_modules` máy Windows sang làm crash các binary C++ của Linux.
  - Phình dung lượng truyền tải do dính thư mục `.git` và `.next` cũ.

```dockerignore
node_modules
.next
.git
.env
.env.*
Dockerfile
.dockerignore
*.log
```

---

## 4. BƯỚC 3: Xây dựng Dockerfile Frontend chuẩn Multi-Stage

- **File:** `yolohub-ui/yolohub-ui/Dockerfile`
- **Cấu trúc 3 Stages:**

```dockerfile
# -------------------------------------------------------------
# STAGE 1: DEPS (Cài đặt dependencies và tận dụng Layer Cache)
# -------------------------------------------------------------
FROM node:20-alpine AS deps 
WORKDIR /app           
# Dùng package*.json để bắt cả package.json lẫn package-lock.json (nếu có)
COPY package*.json ./                     
RUN npm install 

# -------------------------------------------------------------
# STAGE 2: BUILDER (Biên dịch mã nguồn độc lập)
# -------------------------------------------------------------
FROM node:20-alpine AS builder 
WORKDIR /app 
# Mượn node_modules từ stage deps sang đúng thư mục ./node_modules
COPY --from=deps /app/node_modules ./node_modules             
COPY . .                    
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build       

# -------------------------------------------------------------
# STAGE 3: RUNNER (Production Runtime siêu nhẹ & Bảo mật)
# -------------------------------------------------------------
FROM node:20-alpine AS runner 
WORKDIR /app                     

ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

# [DevSecOps] Tạo User hạn chế quyền (Non-root user)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Chỉ nhặt 3 tài nguyên thực sự cần thiết từ stage builder
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Chuyển quyền thực thi sang user nextjs
USER nextjs

EXPOSE 4000

# Chạy trực tiếp Node process (PID 1) để nhận tín hiệu Graceful Shutdown
CMD ["node", "server.js"]
```

---

## 5. BƯỚC 4: Điều phối toàn bộ hệ thống bằng Docker Compose

- **File:** `docker-compose.yml` (nằm tại thư mục gốc `source code/`)
- **Tư duy DevSecOps:** Thay thế việc gõ hàng loạt lệnh `docker run` thủ công bằng 1 file cấu hình thống nhất, tạo mạng nội bộ an toàn (Bridge Network) và tự phục hồi (Self-healing).

```yaml
services:
  backend:
    build: ./yolohub-api/yolohub-api
    container_name: yolohub-api
    restart: unless-stopped
    ports:
      - "8888:8888"
    env_file:
      - ./yolohub-api/yolohub-api/.env
    networks:
      - yolohub-network

  frontend:
    build: ./yolohub-ui/yolohub-ui
    container_name: yolohub-ui
    restart: unless-stopped
    ports:
      - "4000:4000"
    env_file:
      - ./yolohub-ui/yolohub-ui/.env
    depends_on:
      - backend
    networks:
      - yolohub-network

networks:
  yolohub-network:
    driver: bridge
```

### Các lệnh vận hành:
- Khởi động toàn bộ: `docker compose up -d`
- Xem log toàn hệ thống: `docker compose logs -f`
- Tắt toàn bộ: `docker compose down`

---

## 6. CÁC BÀI HỌC THỰC CHIẾN & BẪY KINH ĐIỂN (TROUBLESHOOTING)

1. **Bẫy lệnh `COPY` thư mục:**  
   - `COPY --from=deps /app/node_modules ./` $\rightarrow$ Đổ toàn bộ ruột ra ngoài `/app`, làm mất thư mục bọc ngoài.
   - **Cách đúng:** `COPY --from=deps /app/node_modules ./node_modules`.

2. **Tại sao không dùng `npm run start` lúc chạy Production?**  
   - `npm` chiếm PID 1 và nuốt chửng tín hiệu `SIGTERM` từ Docker, khiến container bị treo 10s khi `docker stop` rồi bị ép dừng thô bạo (`SIGKILL`).
   - Chạy trực tiếp `node server.js` giúp Node nhận tín hiệu ngay, đóng kết nối an toàn trong 0.1s (*Graceful Shutdown*).

3. **Lỗi `Conflict. The container name is already in use`:**  
   - Do container cũ cùng tên vẫn đang tồn tại từ lệnh `docker run`.
   - **Xử lý:** `docker rm -f yolohub-api yolohub-ui` trước khi dùng Compose.

4. **Bản chất của `yolohub-network` & `driver: bridge`:**  
   - Là một "cục switch/router mạng LAN ảo" khép kín.
   - Bật tính năng **Service Discovery (DNS nội bộ)**: Frontend có thể gọi Backend bằng URL `http://backend:8888` mà không cần quan tâm IP thay đổi.
   - Người dùng ở ngoài máy thật truy cập vào nhờ cơ chế Port Mapping `"4000:4000"`.

---

## 7. CHỈ SỐ ĐO LƯỜNG (METRICS) ĐƯA VÀO CV & TRẢ LỜI PHỎNG VẤN

### 📝 Bullet Point cho CV:
> **Tiếng Việt:**  
> *"Đóng gói và tối ưu hóa hệ thống Multi-container (Next.js Frontend & Express API) bằng Docker & Docker Compose. Ứng dụng kỹ thuật Multi-stage build kết hợp Next.js Standalone Output, giảm kích thước Image **85% (từ 1.2GB xuống ~180MB)**. Triển khai các chuẩn bảo mật DevSecOps: Non-root execution (`USER nextjs`), Secret isolation qua `.dockerignore`, Service Discovery qua custom Bridge Network và cơ chế tự phục hồi (`restart: unless-stopped`)."*

> **English:**  
> *"Containerized and orchestrated a multi-tier web application (Next.js & Express API) using Docker and Docker Compose. Optimized container images via Multi-stage builds and Next.js Standalone Output, slashing image size by **85% (from 1.2GB to ~180MB)**. Enforced DevSecOps best practices including Non-root user execution (`USER nextjs`), secret hygiene via `.dockerignore`, secure inter-service communication over custom bridge networks, and self-healing container policies."*

---

## 8. KẾ HOẠCH CÁC BƯỚC TIẾP THEO

- [ ] Tích hợp MongoDB container vào `docker-compose.yml` (với Persistent Volume).
- [ ] Cấu hình Google Cloud Console OAuth 2.0 Client ID để kích hoạt Đăng nhập thật.
- [ ] Quét lỗ hổng bảo mật Image bằng **Trivy / Docker Scout** (Security Audit).
- [ ] Xây dựng GitHub Actions CI/CD Pipeline (Build, Scan, Push).

