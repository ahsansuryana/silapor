# Non-Functional Requirements (NFR)
## SILAPOR v2

---

## NFR-1: Performa

| Parameter | Target |
|-----------|--------|
| Response Time API | < 2 detik untuk 95% request |
| Database Query | < 500ms untuk query umum |
| Image Upload | < 5 detik untuk file 10MB |
| Page Load (Frontend) | < 3 detik first contentful paint |
| Concurrent Users | Mendukung 500+ pengguna simultan |

---

## NFR-2: Keamanan

| Aspek | Implementasi |
|-------|-------------|
| Autentikasi | JWT Access Token (15 menit) + Refresh Token (7 hari, httpOnly cookie) |
| Password | bcrypt hash (cost factor 10+) |
| Otorisasi | Role-based middleware (authenticate, requireAdmin) |
| CORS | Whitelist origin terbatas |
| Input Validation | Server-side validation semua input |
| File Upload | Maks 10MB, validasi tipe file |
| SQL Injection | Prepared statements via `pg` library |

---

## NFR-3: Ketersediaan (Availability)

| Parameter | Target |
|-----------|--------|
| Uptime | 99.9% (kecuali maintenance) |
| Recovery | Auto-restart via Docker |
| Database | PostgreSQL dengan persistent volume |
| Storage | MinIO persistent volume |

---

## NFR-4: Usability

| Aspek | Target |
|-------|--------|
| Responsive | Mobile-first, semua layar > 320px |
| Bahasa | Bahasa Indonesia (UI & notifikasi) |
| Aksesibilitas | Navigasi jelas, error message informatif |
| Loading State | Indikator loading untuk semua operasi async |

---

## NFR-5: Skalabilitas

| Aspek | Target |
|-------|--------|
| Backend | Stateless, dapat di-horizontal scale |
| Database | Connection pooling via `pg.Pool` |
| Frontend | Static assets via Nginx, cacheable |
| Storage | S3-compatible MinIO, scalable |

---

## NFR-6: Maintainability

| Aspek | Target |
|-------|--------|
| Bahasa | TypeScript (strict mode) |
| Arsitektur | MVC pattern (Model-Controller-Route) |
| Dokumentasi | API docs, SRS, NFR, ERD, SAD |
| Database | Migrations via SQL dump |
| Code Style | ESLint + Prettier (implicit) |

---

## NFR-7: Portability

| Aspek | Target |
|-------|--------|
| Deployment | Docker Compose (4 services) |
| Environment | .env / .env.global configuration |
| CI/CD | Multi-stage Docker builds |

---

## NFR-8: Reliability

| Aspek | Target |
|-------|--------|
| Error Handling | Global error middleware |
| Logging | Request/response logging middleware |
| Data Integrity | Foreign keys, constraints di PostgreSQL |
| Audit Trail | report_status_history untuk semua perubahan status |
