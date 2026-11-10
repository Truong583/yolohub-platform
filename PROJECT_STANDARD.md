# QUY CHUẨN DỰ ÁN WEB FULLSTACK + DEVSECOPS

> **Dành cho AI:** Đây là bộ yêu cầu chuẩn mà dự án phải đạt. Toàn bộ dự án do **một người** làm, nên hãy xử lý mọi phần (frontend, backend, database, hạ tầng, CI/CD, bảo mật, tài liệu) như một luồng công việc liền mạch của một người. Không phân vai, không chia người. Hãy bám sát từng mục, đối chiếu các ô `[ ]`, và khi chưa rõ thì hỏi lại hoặc nêu giả định.
>
> Các placeholder cần thay theo dự án cụ thể: `<APP>`, `<DOMAIN>`, `<REGISTRY>`.

---

## 0. Cách dùng và mức ưu tiên

| Mức | Ý nghĩa | Khi nào làm |
|---|---|---|
| **P0** | Bắt buộc, thiếu là chưa đạt | Làm trước, làm đủ |
| **P1** | Khuyến khích, tăng độ chuyên nghiệp | Sau khi P0 chạy ổn, không được làm hỏng P0 |
| **P2** | Mở rộng, nâng cao | Cuối cùng, phải giải thích được trade-off |

**Quy trình chuẩn:** phân tích yêu cầu → thiết kế → phát triển → kiểm thử → CI/CD → triển khai → nghiệm thu → bàn giao.

---

## 1. Nguyên tắc bắt buộc

- [ ] Không lưu mật khẩu, token, private key trong repository. Dùng biến môi trường, secrets và file `env.example` không chứa giá trị thật.
- [ ] Không mở database ra Internet (không publish cổng DB ra host/public).
- [ ] Không xóa database/volume hoặc chạy thử nghiệm phá hoại trên dữ liệu thật. Test chỉ dùng **dữ liệu giả lập**.
- [ ] "Đã chạy được" phải có kiểm chứng: lệnh, kết quả, log hoặc ảnh. Không chấp nhận chỉ khẳng định.
- [ ] Mọi công nghệ chọn phải **nêu lý do** và **công bố phiên bản** trong README.
- [ ] Mọi quyết định kỹ thuật phải giải thích được (logic, rủi ro, phương án thay thế).
- [ ] Mọi thay đổi đi qua Git (nhánh + Pull Request), không sửa thẳng trên server.

---

## 2. Công nghệ và hạ tầng

### 2.1. Stack tham chiếu (được phép thay, phải nêu lý do)

| Tầng | Đề xuất |
|---|---|
| Frontend | Next.js / React |
| Backend | Java Spring Boot hoặc Node.js |
| Database | PostgreSQL |
| Reverse proxy | Nginx |
| Container | Docker Engine + Docker Compose |
| CI/CD | GitHub Actions |
| Registry | GHCR hoặc Docker Hub |
| Edge/CDN | Cloudflare |
| Script | Bash |
| Sơ đồ | Mermaid hoặc draw.io |

### 2.2. Hạ tầng bắt buộc

- 01 Ubuntu VPS (gợi ý 4 vCPU, 8 GB RAM nếu chạy FE + BE Java + DB cùng nhau; cấu hình khác phải tự đánh giá tải).
- 01 tên miền hoặc subdomain, DNS và TLS do Cloudflare quản lý.
- 01 GitHub repository.
- Nếu chưa có domain thật: mô phỏng bằng header `Host` (`curl -H "Host: <DOMAIN>"`) hoặc `/etc/hosts`.

---

## 3. Yêu cầu ứng dụng (chuẩn chung)

### 3.1. Frontend

- [ ] Có trang đăng nhập, báo lỗi đúng khi sai thông tin, có đăng xuất.
- [ ] Dữ liệu hiển thị **lấy từ API**, không hard-code.
- [ ] Form có **validation trước khi gửi** và thông báo kết quả sau thao tác.
- [ ] Có đủ trạng thái **loading / empty / error**; API lỗi không được làm giao diện trắng hoặc đứng.
- [ ] Giao diện hiển thị/ẩn chức năng theo quyền (nhưng không dựa vào đây để bảo mật).
- [ ] Có hướng dẫn chạy local trong README.

### 3.2. Backend

- [ ] Xác thực bằng phiên hoặc token (chọn một, giải thích lý do); mật khẩu **hash**, không lưu dạng rõ.
- [ ] Phân quyền theo vai trò (tối thiểu 2 vai trò), **kiểm tra quyền ở backend** cho mọi thao tác ghi, không chỉ ẩn nút ở frontend.
- [ ] Người dùng chỉ truy cập được dữ liệu thuộc phạm vi quyền của mình.
- [ ] Validate toàn bộ input; trả **mã lỗi đúng** (400/401/403/404/422...).
- [ ] **Không lộ stacktrace hoặc secrets** trong response.
- [ ] Có `/health` (tiến trình sống) và `/ready` (kiểm tra kết nối DB) để phát hiện lỗi sau deploy.
- [ ] Có kiểm thử tự động (unit/integration) chạy được trong CI.
- [ ] Có tài liệu API (**OpenAPI hoặc Postman collection**) khớp code thực tế.
- [ ] Luồng trạng thái nghiệp vụ (nếu có) phải xác định rõ **chuyển đổi hợp lệ** và từ chối chuyển đổi sai.
- [ ] Mọi thay đổi dữ liệu quan trọng được **ghi lịch sử** (ai, lúc nào, từ giá trị nào sang giá trị nào).

### 3.3. Dữ liệu mẫu và kiểm thử

- [ ] Có seed dữ liệu giả lập đủ đa dạng (nhiều vai trò, nhiều trạng thái). Không dùng dữ liệu thật.
- [ ] Test: người dùng **không được xem/sửa dữ liệu ngoài phạm vi quyền**.
- [ ] Test input: thiếu trường bắt buộc, nội dung quá dài, ID không tồn tại, thao tác trái phép.
- [ ] Test đăng nhập: sai mật khẩu, token hết hạn, chưa đăng nhập.
- [ ] Test số liệu thống kê/dashboard thay đổi theo dữ liệu thật.
- [ ] Có danh sách test case và kết quả (pass/fail).

### 3.4. Tính năng P1 gợi ý

Tìm kiếm, phân trang, lọc; audit log; email thông báo giả lập; monitoring; môi trường staging.

---

## 4. Cơ sở dữ liệu

- [ ] Mỗi bảng phải phục vụ một luồng nghiệp vụ thật (không tạo bảng cho đủ số lượng).
- [ ] Có **ERD** đúng PK/FK, quan hệ 1-n, nullability, ràng buộc chính.
- [ ] Có **data dictionary** (bảng, cột, kiểu, ràng buộc, ý nghĩa).
- [ ] Ràng buộc đầy đủ: khóa chính, khóa ngoại, `UNIQUE` (ví dụ email), `NOT NULL`, `CHECK` khi cần.
- [ ] Có **index** cho các cột thường lọc/sắp xếp (trạng thái, ngày, khóa ngoại).
- [ ] Mật khẩu lưu **hash** (`password_hash`).
- [ ] Mọi thay đổi schema đi qua **migration có version** (Flyway/Liquibase/Prisma/Knex...). Không sửa bảng thủ công trên server.
- [ ] Dùng **named volume** để dữ liệu không mất khi restart/recreate container; có kịch bản kiểm chứng (tạo dữ liệu → recreate → dữ liệu còn).
- [ ] Có **backup và restore** (`pg_dump`/`pg_restore`) chạy thử trên dữ liệu giả lập, có biên bản kết quả.
- [ ] Tài khoản DB của ứng dụng **chỉ có quyền cần thiết** (không dùng superuser).
- [ ] DB **không public**, không commit credential.

---

## 5. Kiến trúc và Docker Compose

### 5.1. Luồng tham chiếu

```
User/Browser
   │ HTTPS
   ▼
Cloudflare (DNS proxy, TLS Full strict, WAF, cache)
   │ HTTPS (origin certificate)
   ▼
Ubuntu VPS (firewall)
   ▼
Nginx (reverse proxy)
   ├── /     → frontend  (mạng nội bộ)
   └── /api  → backend   (mạng nội bộ)
                  ▼
              PostgreSQL (volume riêng, KHÔNG public)
```

### 5.2. Yêu cầu bắt buộc

- [ ] **Phân biệt công khai và nội bộ:** chỉ publish cổng thực sự cần từ Internet (nginx: 80/443). Backend và DB **không** publish ra host.
- [ ] Nginx định tuyến `/` → frontend, `/api` → backend, dùng **tên service** trong network của Compose.
- [ ] Nếu dùng nhiều subdomain (`api.`, `admin.`, `staging.`): mỗi subdomain có `server_name` riêng, host không khớp trả về mặc định an toàn.
- [ ] Compose có tối thiểu: `frontend`, `backend`, `database`, `reverse-proxy`; network nội bộ; volume riêng cho DB.
- [ ] Có **healthcheck**, **restart policy**, **log rotation** (ví dụ `json-file` với `max-size`/`max-file`) cho từng service.
- [ ] Tách cấu hình **local / staging / production** bằng biến môi trường; không commit giá trị bí mật; có `env.example`.
- [ ] Không nhúng credentials trong YAML.
- [ ] Bảo mật VPS: firewall (`ufw`), SSH bằng key, hạn chế IP nếu được, không mở cổng DB (5432/3306).
- [ ] Môi trường tối thiểu: local + production; staging là điểm cộng.

### 5.3. Sơ đồ bắt buộc

1. **Sơ đồ request và mạng:** user, Cloudflare, domain, server, nginx, container, DB; chú thích port, service, network, phần public và nội bộ.
2. **Sơ đồ CI/CD:** source → PR → CI → registry → VPS → verify; thể hiện Dockerfile, image, container, nginx, Cloudflare edge và luồng người dùng.
3. **ERD.**
4. **Sơ đồ tổng hợp hệ thống** (dùng cho phần đánh giá ở mục 11).

---

## 6. Git, CI/CD, release

### 6.1. Git workflow

- [ ] Một repo, nhánh `main` **được bảo vệ**, không push trực tiếp.
- [ ] Làm việc trên nhánh `feature/...`, `fix/...`, `docs/...` rồi mở **Pull Request**.
- [ ] PR có mô tả, ảnh hoặc test evidence; CI xanh mới merge; tự review theo checklist trước khi merge.
- [ ] Commit message rõ ràng, mỗi commit một thay đổi có ý nghĩa.
- [ ] Lỗi tích hợp hoặc sự cố được ghi thành GitHub Issue (hiện tượng, ưu tiên, hướng xử lý, kết quả xác minh).

### 6.2. CI

- [ ] Khi có Pull Request: lint/format (nếu có), **chạy test**, **build** frontend và backend, báo pass/fail.
- [ ] Khi merge vào `main`: build image **gắn commit SHA hoặc version**, push lên registry. **Không phụ thuộc tag `latest` để rollback.**
- [ ] Secrets (registry, SSH) dùng cơ chế secrets với quyền tối thiểu; **không in secrets ra log**.

### 6.3. CD và rollback

- [ ] Deploy **image phiên bản đã kiểm thử** lên VPS, cập nhật Compose, chạy migration theo quy trình đã định.
- [ ] Sau deploy kiểm tra: trạng thái container, health/readiness, API thật, thao tác FE từ domain, log 5xx.
- [ ] Smoke test thất bại → có quy trình **khôi phục image/config phiên bản trước**; migration không tương thích có phương án riêng.
- [ ] Ghi **release log**: phiên bản, thời gian, kết quả kiểm tra, rollback (nếu có).

### 6.4. Script và checklist vận hành

**Checklist deploy thủ công (mỗi bước có lệnh cụ thể và kết quả mong đợi):**
1. Kiểm tra code mới: `git status`, `git pull`, `git log -1`
2. Build image: `docker compose build`
3. Chạy lại stack: `docker compose up -d`
4. Kiểm tra container: `docker compose ps`
5. Kiểm tra log: `docker compose logs --tail=50`
6. Kiểm tra response: `curl -I ...`
7. Kiểm tra nginx/domain: `nginx -t`, test từng host

**Script `deploy-basic.sh`:**
- [ ] Hiển thị user và hostname
- [ ] `cd` vào thư mục dự án (kiểm tra tồn tại, báo lỗi rõ ràng)
- [ ] Build lại hệ thống
- [ ] Chạy lại bằng Docker Compose
- [ ] Hiển thị trạng thái container
- [ ] In 30–50 dòng log gần nhất của app hoặc nginx
- [ ] Có `#!/bin/bash`, `set -euo pipefail`, comment từng bước, `chmod +x`

**Checklist verify sau deploy (`post-deploy-verify`) + script `verify.sh` (điểm cộng):**
- [ ] Container: không có `Exited`/`Restarting`
- [ ] Log: không có error/exception, không có 5xx
- [ ] Port (`ss -tulpn`): chỉ 80/443 public, không có cổng DB
- [ ] Response bằng `curl`: đúng status code và nội dung
- [ ] Nginx route đúng cho từng host/đường dẫn
- [ ] Ngoài browser (nếu có domain): HTTPS hợp lệ, trang tải đúng, thao tác thật chạy được

**Lệnh mẫu (thay placeholder và giải thích kết quả):**

```bash
docker compose config -q
docker compose ps
docker compose logs --tail=100 backend
curl -fsS http://127.0.0.1:<PORT>/health
curl -I https://<DOMAIN>
```

---

## 7. Cloudflare và an toàn truy cập

Phải triển khai thực tế, không chỉ trỏ DNS rồi coi như xong.

- [ ] DNS trỏ tới IP VPS; truy cập HTTPS được từ Internet.
- [ ] **SSL/TLS Full (strict)** với **chứng chỉ origin hợp lệ** (Cloudflare Origin Certificate hoặc Let's Encrypt). **Không dùng Flexible** để chữa lỗi cấu hình.
- [ ] Bật proxy cho hostname cần bảo vệ.
- [ ] Cấu hình WAF/Security Rule phù hợp gói đang dùng.
- [ ] Thử nghiệm hạn chế truy cập một endpoint nhạy cảm hoặc một IP thử nghiệm mà không khóa nhầm toàn hệ thống.
- [ ] **Cache đúng đối tượng:** không cache API chứa dữ liệu cá nhân, phản hồi đăng nhập, hoặc dữ liệu phụ thuộc cookie/token.
- [ ] **Chặn truy cập thẳng vào origin:** firewall chỉ nhận IP Cloudflare, hoặc Authenticated Origin Pulls; không lộ IP qua bản ghi DNS cũ, mail, subdomain không proxy.
- [ ] Ghi nhận mọi rule: nội dung, trạng thái trước/sau, phương án rollback rule.

**Phải giải thích được:** Cloudflare đứng ở đâu, làm gì (DNS, CDN/proxy, TLS, WAF, chống DDoS, cache), và vì sao không nên lộ origin IP (bị tấn công trực tiếp, bypass WAF/DDoS, scan port, brute force).

---

## 8. Rà soát cổng và dịch vụ bị lộ

- [ ] Liệt kê toàn bộ port đang mở: `ss -tulpn`, `sudo ufw status`.
- [ ] Liệt kê container đang chạy: `docker ps`.
- [ ] Kiểm tra nginx đang public gì: `nginx -T`.
- [ ] Phân loại từng port: **public hợp lý** / **public chưa hợp lý** / **nội bộ nên ẩn**.
- [ ] Nếu DB mở host port: ghi chú rõ và khắc phục (bỏ `ports:`, dùng network nội bộ).
- [ ] Kết luận ngắn: port nào hợp lý, port nào rủi ro, vì sao.

---

## 9. Xử lý sự cố

Chỉ thao tác trên môi trường lab, có bằng chứng **trước/sau**, không xóa dữ liệu thật. Dự án phải xử lý được tối thiểu 5 tình huống sau:

| # | Tình huống | Biểu hiện | Cần chứng minh |
|---|---|---|---|
| 1 | Reverse proxy 502 | FE vào được nhưng `/api` trả 502 sau đổi cấu hình | Giả thuyết, lệnh kiểm tra, nguyên nhân, cấu hình sửa, smoke test |
| 2 | Release lỗi | CI xanh, container chạy nhưng một API lỗi sau phiên bản mới | So sánh release, log/test, phạm vi ảnh hưởng, rollback |
| 3 | DB mất kết nối | API không đọc/ghi sau khi restart DB | Phân biệt readiness, network, credentials, migration; **không xóa volume để chữa cháy** |
| 4 | HTTPS/Cloudflare | Domain không ổn định, origin vẫn phản hồi local | Khoanh vùng DNS, TLS, firewall, origin, proxy; sửa đúng tầng |
| 5 | Pipeline thất bại | PR hoặc workflow deploy fail | Xác định đúng job/step, xử lý, chạy lại, xác nhận image/deploy có version |

**Mẫu báo cáo sự cố (dùng cho từng tình huống):**
1. Thời điểm, phiên bản triển khai, triệu chứng, mức ảnh hưởng.
2. Ít nhất 2 giả thuyết nguyên nhân và căn cứ kiểm tra.
3. Lệnh/query/log đã dùng và kết quả quan sát.
4. Root cause đã xác định, hoặc nêu rõ giới hạn kết luận.
5. Biện pháp xử lý, kiểm tra sau sửa, thay đổi đưa về repository.
6. Biện pháp tránh lặp lại.

---

## 10. Quy định sử dụng AI

- [ ] Có `AI_USAGE.md`: mục tiêu hỏi AI, đoạn code/ý tưởng được dùng, cách kiểm chứng và kết quả.
- [ ] Không đưa token, password, SSH key hoặc dữ liệu thật lên AI.
- [ ] Mọi code do AI đề xuất phải được review, build/test và giải thích được logic, rủi ro, phương án thay thế.
- [ ] Phải hiểu và tái hiện được kết quả. Chỉ có file cấu hình hay ảnh chụp mà không hiểu luồng vận hành là không đạt.

---

## 11. Đánh giá tổng hợp kiến trúc

Viết `tong-hop.md` gồm 5 phần:

1. **Hệ thống gồm gì:** server, service, port, nginx, domain/subdomain, Cloudflare (thật hoặc mô phỏng).
2. **Luồng truy cập:** user vào đâu, request qua đâu, nginx route vào đâu, app gọi gì phía sau.
3. **Quy trình deploy:** đang deploy thế nào, đã có script chưa, đã có bước verify chưa.
4. **Ít nhất 5 rủi ro kỹ thuật**, mỗi rủi ro có mô tả, tác động, cách giảm thiểu. Ví dụ: lộ origin, public DB, deploy tay dễ quên bước, thiếu rollback, thiếu log/monitoring, subdomain route sai, nginx config sai.
5. **3 việc ưu tiên cải thiện** kèm lý do. Ví dụ: chuẩn hóa script deploy, ẩn port thừa, tách subdomain rõ hơn, tăng verify, chuẩn hóa nginx config.

- [ ] Có sơ đồ tổng hợp.
- [ ] Rủi ro và cải thiện liên kết logic.
- [ ] Bám đúng hệ thống thực tế, không chung chung.

---

## 12. Cấu trúc repository chuẩn

```
<app>/
├── frontend/
├── backend/
├── database/migrations/
├── infra/
│   ├── nginx/
│   └── compose/            # docker-compose + env.example
├── scripts/                # deploy-basic.sh, verify.sh
├── .github/workflows/      # CI + CD
├── docs/
│   ├── architecture/       # sơ đồ, ERD, data dictionary
│   ├── api/                # OpenAPI / Postman
│   ├── incidents/
│   ├── runbook/            # deploy, verify, rollback
│   └── tong-hop.md
├── AI_USAGE.md
└── README.md
```

---

## 13. Hồ sơ bàn giao

1. Repository GitHub có lịch sử branch/commit/PR.
2. Tên miền hoạt động qua HTTPS; tài khoản demo theo vai trò (không ghi password vào tài liệu công khai).
3. README: mục tiêu, stack kèm phiên bản, kiến trúc, cách chạy local, cách build và deploy.
4. Sơ đồ request, sơ đồ CI/CD, ERD + data dictionary.
5. API contract, danh sách test case và kết quả.
6. Dockerfiles, `docker-compose.yml`, nginx config, workflows, `env.example`.
7. Bằng chứng: HTTPS/domain, trạng thái container, health/API, CI/CD, persistence DB, backup/restore.
8. Báo cáo sự cố, runbook release/rollback.
9. `AI_USAGE.md`.
10. Báo cáo ngắn: đã làm được gì, chưa làm được gì, vì sao.

---

## 14. Cách AI làm việc với dự án này

1. Hỏi lại tối đa vài câu cần thiết (đã có domain/VPS chưa, chọn Java hay Node, auth session hay JWT).
2. Thứ tự đề xuất: chốt thiết kế (API contract, schema, sơ đồ) → DB + migration → backend → frontend → Compose + nginx local → CI → VPS + Cloudflare + CD → verify/rollback → sự cố → tài liệu tổng hợp.
3. Mỗi hạng mục đưa: file hoàn chỉnh, lệnh chạy, lệnh kiểm tra.
4. Giải thích ngắn vì sao chọn cấu hình đó.
5. Viết bằng **tiếng Việt**, giữ nguyên thuật ngữ kỹ thuật tiếng Anh.
6. Ưu tiên cấu hình an toàn mặc định; không hardcode secret; không đề xuất thao tác phá hoại dữ liệu.
7. Cuối mỗi giai đoạn, đối chiếu lại các ô `[ ]` và báo mục nào đạt, mục nào còn thiếu.
8. AI không chạy được lệnh trên VPS của mình: hãy chỉ rõ lệnh nào cần chạy và kết quả mong đợi để mình tự chạy và kiểm tra.

---

## 15. Checklist nghiệm thu tổng

**Ứng dụng**
- [ ] Đăng nhập/đăng xuất, phân quyền đúng ở backend
- [ ] Chức năng nghiệp vụ chính chạy đủ từ trình duyệt và API
- [ ] Validation, mã lỗi đúng, không lộ stacktrace/secret
- [ ] `/health`, `/ready` hoạt động
- [ ] Test tự động + danh sách test case/kết quả

**Database**
- [ ] ERD + data dictionary + migration có version
- [ ] Seed dữ liệu giả lập
- [ ] Volume bền vững, đã kiểm chứng
- [ ] Backup/restore có biên bản
- [ ] DB không public, tài khoản quyền tối thiểu

**Hạ tầng**
- [ ] Compose đủ service, healthcheck, restart, log rotation
- [ ] Nginx route đúng
- [ ] Chỉ 80/443 public, đã rà soát port
- [ ] Cloudflare proxy + Full (strict) + WAF + cache đúng + chặn truy cập thẳng origin
- [ ] Truy cập HTTPS bằng domain

**CI/CD & vận hành**
- [ ] `main` được bảo vệ, làm việc qua PR
- [ ] CI test + build khi PR; build image gắn SHA khi merge
- [ ] CD deploy image có version, chạy migration, smoke test
- [ ] Rollback có quy trình + release log
- [ ] `deploy-basic.sh`, checklist deploy, verify, runbook

**Tài liệu**
- [ ] 2 sơ đồ bắt buộc + sơ đồ tổng hợp
- [ ] 5 báo cáo sự cố
- [ ] `tong-hop.md` đủ 5 phần
- [ ] `AI_USAGE.md`, README hoàn chỉnh

---

## PHỤ LỤC A: Ví dụ áp dụng, hệ thống Service Desk (quản lý ticket hỗ trợ kỹ thuật)

Nếu dự án là hệ thống Service Desk, ngoài quy chuẩn trên cần đạt thêm:

**Vai trò:** `STAFF` (tạo/xem ticket trong phạm vi), `TECHNICIAN` (xử lý ticket được giao, nên có), `ADMIN` (dashboard, phân công, xem lịch sử).

**Trạng thái ticket:** `OPEN → IN_PROGRESS → RESOLVED → CLOSED`, phải định nghĩa chuyển đổi hợp lệ.

**Màn hình:** đăng nhập; dashboard (tổng, đang mở, đang xử lý, hoàn thành); danh sách ticket (mã, tiêu đề, ưu tiên, trạng thái, người phụ trách, thời gian cập nhật, tìm kiếm/lọc); tạo ticket (tiêu đề, mô tả, ưu tiên); chi tiết ticket (bình luận, lịch sử trạng thái, đổi trạng thái theo quyền).

**API tối thiểu:**

| Method | Endpoint | Ý nghĩa |
|---|---|---|
| POST | `/api/auth/login` | Đăng nhập, không trả password |
| GET | `/api/me` | Người dùng hiện tại |
| GET | `/api/tickets` | Danh sách, có filter, đúng phạm vi |
| POST | `/api/tickets` | Tạo ticket, có validation |
| GET | `/api/tickets/{id}` | Chi tiết, kiểm tra quyền |
| PATCH | `/api/tickets/{id}/status` | Đổi trạng thái, ghi lịch sử |
| POST | `/api/tickets/{id}/comments` | Bình luận |
| GET | `/api/dashboard/summary` | Thống kê thực từ DB |
| GET | `/health`, `/ready` | Trạng thái dịch vụ |

**Bảng dữ liệu:**

| Bảng | Trường chính | Ràng buộc |
|---|---|---|
| `users` | id, email, password_hash, full_name, role, created_at | Email duy nhất, có vai trò |
| `tickets` | id, code, title, description, priority, status, created_by, assigned_to, created_at, updated_at | FK tới users, index trạng thái và ngày |
| `ticket_comments` | id, ticket_id, author_id, content, created_at | FK hợp lệ |
| `ticket_history` | id, ticket_id, actor_id, old_status, new_status, changed_at | Lưu lịch sử trạng thái |

**Dữ liệu mẫu:** tối thiểu 8 người dùng, 20 ticket (nhiều trạng thái), 10 bình luận.

**Subdomain (nếu mở rộng):** `<DOMAIN>` (app chính: `/` → FE, `/api` → BE), `staging.<DOMAIN>` (thử nghiệm), `api.<DOMAIN>` và `admin.<DOMAIN>` là tùy chọn; DB chỉ nội bộ.
