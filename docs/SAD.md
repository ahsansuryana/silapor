# Software Architecture Document (SAD)
## SILAPOR v2

---

## 1. Arsitektur Sistem

SILAPOR v2 menggunakan arsitektur **Client-Server** dengan pola **Model-Controller-Route (MVC)** di backend dan **Component-based SPA** di frontend.

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React 19)               │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │   Pages   │  │Components│  │  Context / Hooks   │ │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘ │
│       │              │                 │            │
│  ┌────┴──────────────┴─────────────────┴──────────┐ │
│  │              Axios (API Client)                 │ │
│  └─────────────────────┬───────────────────────────┘ │
└────────────────────────┼─────────────────────────────┘
                         │ HTTP/JSON
┌────────────────────────┼─────────────────────────────┐
│            Backend (Express 5)                        │
│  ┌─────────────────────┴───────────────────────────┐ │
│  │              Routes / Middleware                  │ │
│  └─────────────────────┬───────────────────────────┘ │
│  ┌─────────────────────┴───────────────────────────┐ │
│  │               Controllers                         │ │
│  └─────────────────────┬───────────────────────────┘ │
│  ┌─────────────────────┴───────────────────────────┐ │
│  │                Models (SQL)                      │ │
│  └─────────────────────┬───────────────────────────┘ │
│                        │                             │
│  ┌─────────────────────┴───────────────────────────┐ │
│  │         PostgreSQL Pool (pg library)             │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌──────────────────┐    ┌────────────────────────┐  │
│  │  MinIO (Storage)  │    │   JWT / OAuth Helper   │  │
│  └──────────────────┘    └────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

---

## 2. Container Architecture (Docker Compose)

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                         │
│                                                           │
│  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌──────┐ │
│  │  Frontend  │  │  Backend   │  │    DB    │  │MinIO │ │
│  │ (Nginx) 80 │  │ (Express)  │  │(Postgres)│  │(S3)  │ │
│  │            │  │   :3000    │  │  :5432   │  │:9000 │ │
│  └─────┬──────┘  └─────┬──────┘  └────┬─────┘  └──┬───┘ │
│        │                │              │           │     │
│        └────────────────┘              └───────────┘     │
│                                                           │
│  Networks: silapor-network                                │
│  Volumes: postgres_data, minio_data                       │
└───────────────────────────────────────────────────────────┘
```

---

## 3. Backend Architecture

### 3.1 Struktur
```
backend/src/
├── index.ts                    # Entry point, middleware, route mounting
├── controllers/                # Business logic (9 controllers)
├── models/                     # Database queries (9 models)
├── routes/                     # Route definitions (11 route files)
├── middlewares/                 # Auth middleware
│   └── auth.middleware.ts       # authenticate + requireAdmin
└── lib/
    ├── db.ts                   # PostgreSQL connection pool
    ├── jwt.ts                  # JWT sign/verify utilities
    ├── minio.ts                # MinIO client
    └── minio-upload.ts         # Upload & presigned URL helpers
```

### 3.2 Pattern
- **Routes** → definisi endpoint + middleware
- **Controllers** → request handling, validasi, response
- **Models** → raw SQL queries via `pg.Pool`
- **Middleware** → autentikasi JWT, role checking

### 3.3 Authentication Flow
```
Login → Generate Access Token (15m) + Refresh Token (7d)
       → Access Token dikirim di response body
       → Refresh Token di httpOnly cookie

Setiap request protected:
       → Authorization: Bearer <accessToken>
       → Middleware verify token → attach user ke req

Token expired (401):
       → Frontend interceptor call POST /auth/refresh
       → Dapat accessToken baru

Logout:
       → Clear refresh token cookie
```

### 3.4 API Design
- Base URL: `/api`
- Format: JSON (kecuali upload file: multipart/form-data)
- Autentikasi: Bearer token + httpOnly cookie
- Role-based access via middleware `authenticate` & `requireAdmin`

---

## 4. Frontend Architecture

### 4.1 Struktur
```
frontend/src/
├── main.tsx                # Entry point
├── App.tsx                 # Root: Router + AppProvider
├── index.css               # Tailwind imports
├── routes/
│   └── AppRoutes.tsx       # Role-based routing
├── pages/                  # 14 halaman
│   ├── Splash.tsx, Login.tsx, AuthCallback.tsx
│   ├── HomePage.tsx, CreateReport.tsx
│   ├── MyReports.tsx, ReportDetail.tsx, Profile.tsx
│   ├── User/ (UserHome.tsx, Notifications.tsx)
│   ├── staff/ (4 halaman)
│   └── admin/ (3 halaman)
├── components/
│   ├── auth/ProtectedRoute.tsx
│   ├── layout/BottomNav.tsx, PageContainer.tsx
│   └── ui/ScreenHeader.tsx, StatusBadge.tsx, TabSelector.tsx
├── context/
│   └── AppContext.tsx      # Global state (user, auth)
├── hooks/
│   └── useAppContext.ts    # Context hook
└── lib/
    ├── api.ts              # Axios instance + interceptors
    └── jwt.ts              # Token helpers
```

### 4.2 Routing Strategy
- Role-based `ProtectedRoute` component
- Bottom navigation untuk mobile (3 tabs berbeda per role)
- Public routes: `/splash`, `/login`, `/auth/callback`
- Student routes: Home, Create Report, My Reports, Profile, Notifications
- Staff routes: Dashboard, Report Center, Facility Management, Profile
- Admin routes: Overview, Report Center, User Management, Staff Management

### 4.3 State Management
- **AppContext**: user data, access token, loading state
- **Axios interceptors**: auto-attach token, silent refresh on 401
- **Tanpa Redux/Zustand** — context + hooks cukup untuk skala ini

---

## 5. Database Architecture

### 5.1 PostgreSQL Schema
- 10 tables dengan foreign keys & constraints
- Custom ENUM types: `role_type`, `location_type`, `report_status`, `report_priority`
- UUID primary keys (`gen_random_uuid()`)
- Timestamps dengan timezone

### 5.2 Key Design Decisions
- **Self-referencing locations**: `parent_id` → recursive CTE queries
- **Connection pooling**: `pg.Pool` max 20 connections
- **No ORM**: Raw SQL untuk kontrol penuh atas query

---

## 6. Security Architecture

| Layer | Mekanisme |
|-------|-----------|
| Transport | HTTP (development), HTTPS (production) |
| Auth | JWT access + refresh token |
| Password | bcrypt hash |
| Cookie | httpOnly, secure cookie untuk refresh token |
| CORS | Whitelist origin |
| File | 10MB max, type validation |
| DB | Prepared statements |

---

## 7. Storage Architecture (MinIO)

- **Bucket**: silapor (atau kustom)
- **Path pattern**: `reports/{reportId}/{filename}`
- **Access**: Presigned URLs untuk viewing (expired)
- **Upload**: Langsung dari backend via multipart/form-data

---

## 8. Data Flow: Create Report (Contoh)

```
Mahasiswa → POST /reports (multipart)
  → auth.middleware.authenticate
  → reports.controller.create
    → Insert ke tabel reports
    → Jika ada file: upload ke MinIO, insert ke report_images
    → Auto-assign staff: findStaffInHierarchy()
    → Insert assignment
    → Insert status history (menunggu)
    → Kirim notifikasi ke staff
  → Response 201 + data laporan
```

---

## 9. Technology Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| Backend | Express 5, TypeScript, node-postgres |
| Database | PostgreSQL 16 Alpine |
| Storage | MinIO (S3-compatible) |
| Auth | JWT, Google OAuth 2.0 |
| Container | Docker, Docker Compose |
| Animasi | motion library |
| Icons | lucide-react |
