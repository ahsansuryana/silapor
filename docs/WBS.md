# Work Breakdown Structure (WBS)
## SILAPOR v2

---

## Fase 1: Foundation & Infrastructure

```
1.1  Project Setup
 ├── 1.1.1  Inisialisasi repository + Git
 ├── 1.1.2  Setup Docker Compose (db, minio, backend, frontend)
 ├── 1.1.3  Setup PostgreSQL schema & migrations
 ├── 1.1.4  Setup MinIO bucket & policies
 ├── 1.1.5  Konfigurasi environment (.env, .env.global)
 └── 1.1.6  Setup TypeScript (tsconfig, strict mode)

1.2  Backend Core
 ├── 1.2.1  Express server + middleware (cors, cookie-parser, logging)
 ├── 1.2.2  Database connection pool (pg)
 ├── 1.2.3  JWT utilities (sign, verify, refresh)
 ├── 1.2.4  MinIO client + upload helper
 └── 1.2.5  Auth middleware (authenticate, requireAdmin)

1.3  Frontend Core
 ├── 1.3.1  Vite + React 19 setup
 ├── 1.3.2  Tailwind CSS v4 configuration
 ├── 1.3.3  Axios instance + interceptors (token, refresh)
 ├── 1.3.4  AppContext (user, auth state)
 ├── 1.3.5  ProtectedRoute (role-based)
 ├── 1.3.6  BottomNav component
 └── 1.3.7  AppRoutes setup
```

---

## Fase 2: Authentication & User Management

```
2.1  Backend Auth
 ├── 2.1.1  POST /auth/register
 ├── 2.1.2  POST /auth/login
 ├── 2.1.3  Google OAuth (redirect + callback)
 ├── 2.1.4  POST /auth/refresh
 ├── 2.1.5  POST /auth/logout
 └── 2.1.6  Register staff/admin endpoints

2.2  Frontend Auth
 ├── 2.2.1  Login page (NIM + Password)
 ├── 2.2.2  Google OAuth redirect
 ├── 2.2.3  AuthCallback page
 └── 2.2.4  Splash screen

2.3  User Management (Admin)
 ├── 2.3.1  GET/POST/PUT/DELETE /users
 ├── 2.3.2  UserManagement page (admin)
 └── 2.3.3  Profile page
```

---

## Fase 3: Reports Core

```
3.1  Reports CRUD
 ├── 3.1.1  POST /reports (multipart)
 ├── 3.1.2  GET /reports, GET /reports/my
 ├── 3.1.3  GET /reports/:id (detail)
 ├── 3.1.4  PATCH /reports/:id (update)
 ├── 3.1.5  DELETE /reports/:id
 └── 3.1.6  Filter by status & priority

3.2  Report Images
 ├── 3.2.1  Upload image (MinIO)
 ├── 3.2.2  Presigned URL generation
 ├── 3.2.3  Delete image
 └── 3.2.4  GET images per report

3.3  Report History
 ├── 3.3.1  Status change → insert history
 └── 3.3.2  GET report history

3.4  Report Comments
 ├── 3.4.1  POST /reports/:id/comments
 └── 3.4.2  GET /reports/:id/comments

3.5  Frontend Reports (Mahasiswa)
 ├── 3.5.1  HomePage (daftar laporan)
 ├── 3.5.2  CreateReport page (form + upload)
 ├── 3.5.3  MyReports page (history)
 └── 3.5.4  ReportDetail page

3.6  Frontend Reports (Staff/Admin)
 ├── 3.6.1  StaffReportCenter
 ├── 3.6.2  AdminReportCenter
 └── 3.6.3  ReportDetail (with actions)
```

---

## Fase 4: Locations & Categories

```
4.1  Locations
 ├── 4.1.1  GET /locations, GET /locations/tree
 ├── 4.1.2  CRUD locations (POST/PATCH/DELETE)
 ├── 4.1.3  Self-referencing parent-child (recursive CTE)
 └── 4.1.4  Location tree in frontend

4.2  Categories
 ├── 4.2.1  GET /categories
 ├── 4.2.2  CRUD categories (POST/PATCH/DELETE)
 └── 4.2.3  Category selection in CreateReport

4.3  Staff Locations
 ├── 4.3.1  GET /staff-locations/my
 ├── 4.3.2  GET staff by location
 ├── 4.3.3  Assign/remove staff from location (CRUD)
 └── 4.3.4  FacilityManagement page (frontend)
```

---

## Fase 5: Assignments & Workflow

```
5.1  Staff Assignment
 ├── 5.1.1  Auto-assign (findStaffInHierarchy)
 ├── 5.1.2  Manual assignment (POST /assignments)
 ├── 5.1.3  Transfer assignment (POST /assignments/transfer)
 ├── 5.1.4  GET /assignments/my-tasks
 └── 5.1.5  GET assignment by report

5.2  Report Status Workflow
 ├── 5.2.1  Status transit: menunggu → diterima → diproses → selesai/ditolak
 ├── 5.2.2  Status change endpoint + validation
 ├── 5.2.3  Auto-notification on status change
 └── 5.2.4  StatusBadge component (frontend)
```

---

## Fase 6: Notifications

```
6.1  Backend Notifications
 ├── 6.1.1  GET /notifications
 ├── 6.1.2  GET /notifications/unread-count
 ├── 6.1.3  PATCH /notifications/:id/read
 ├── 6.1.4  PATCH /notifications/read-all
 └── 6.1.5  DELETE /notifications/:id

6.2  Frontend Notifications
 ├── 6.2.1  Notifications page (User/Notifikasi.tsx)
 ├── 6.2.2  Unread count badge
 └── 6.2.3  Notification bell/indicator
```

---

## Fase 7: Dashboard & Statistics

```
7.1  Backend Stats
 └── 7.1.1  GET /reports/stats (weekly, trends, counts)

7.2  Frontend Dashboard
 ├── 7.2.1  AdminOverview (charts, stats cards)
 ├── 7.2.2  StaffDashboard (task overview)
 └── 7.2.3  UserHome (student homepage)
```

---

## Fase 8: Infrastructure & Deployment

```
8.1  Docker
 ├── 8.1.1  Dockerfile backend (multi-stage)
 ├── 8.1.2  Dockerfile frontend (multi-stage + Nginx)
 ├── 8.1.3  docker-compose.yml (4 services)
 └── 8.1.4  Network + volume configuration

8.2  Production Readiness
 ├── 8.2.1  Nginx config (SPA routing, proxy)
 ├── 8.2.2  Environment separation (.env / .env.global)
 └── 8.2.3  Seed data (10 fakultas, categories, locations)
```

---

## Ringkasan Timeline (Estimasi)

| Fase | Durasi | Dependensi |
|------|--------|------------|
| Fase 1: Foundation | 3 hari | - |
| Fase 2: Auth & Users | 3 hari | Fase 1 |
| Fase 3: Reports Core | 5 hari | Fase 2 |
| Fase 4: Locations & Categories | 3 hari | Fase 1 |
| Fase 5: Assignments & Workflow | 3 hari | Fase 3, Fase 4 |
| Fase 6: Notifications | 2 hari | Fase 5 |
| Fase 7: Dashboard & Stats | 2 hari | Fase 5 |
| Fase 8: Infrastructure | 2 hari | Fase 1 |
| **Total** | **~23 hari** | |
