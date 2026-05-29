# SILAPOR Frontend Documentation

This document describes each page in the frontend and the API endpoints they consume.

---

## Page: Login (`/login`)

**Route:** `/login`  
**File:** `src/pages/Login.tsx`

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with NIM and password |
| GET | `/api/auth/google/redirect` | Google OAuth login (redirect) |

### Request/Response

**Login POST** - Request:
```json
{
  "nim": "1237050090",
  "password": "password123"
}
```

**Login POST** - Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "role": "MAHASISWA|STAFF|ADMIN"
  }
}
```

### Local Storage
- `access_token` - JWT token for API requests
- `user` - User object with id, name, role

---

## Page: Home / Dashboard (`/home`)

**Route:** `/home`  
**File:** `src/pages/User/UserHome.tsx`

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/my` | Get current user's reports |

### Response

```json
[
  {
    "id": "uuid",
    "title": "AC Rusak",
    "status": "menunggu|diproses|selesai|diterima|ditolak",
    "category_id": "uuid",
    "location_id": "uuid",
    "created_at": "2026-04-23T00:00:00.000Z"
  }
]
```

### Features
- Display user stats (Total, In Progress, Resolved)
- Quick actions: Create New Report, Track Facilities
- Recent reports list (last 3)
- Bottom navigation

---

## Page: Create Report (`/report/new`)

**Route:** `/report/new`  
**File:** `src/pages/CreateReport.tsx`

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/locations/tree` | Get locations as tree |
| POST | `/api/reports` | Create new report (multipart/form-data) |

### Request

**GET /categories** - Response:
```json
[
  {
    "id": "uuid",
    "name": "AC",
    "short_description": "Air Conditioner"
  }
]
```

**GET /locations/tree** - Response:
```json
[
  {
    "id": "uuid",
    "name": "Gedung A",
    "type": "GEDUNG",
    "children": [
      {
        "id": "uuid",
        "name": "Lantai 1",
        "type": "LANTAI",
        "children": [...]
      }
    ]
  }
]
```

**POST /reports** - Request (multipart/form-data):
```
title: string (required)
description: string (required)
category_id: uuid (required)
location_id: uuid (required)
file: image (optional, max 10MB)
```

**POST /reports** - Response (201):
```json
{
  "id": "uuid",
  "reporter_id": "uuid",
  "location_id": "uuid",
  "category_id": "uuid",
  "title": "AC Rusak",
  "description": "AC tidak dingin",
  "status": "menunggu",
  "priority": "rendah",
  "created_at": "2026-04-23T00:00:00.000Z"
}
```

---

## Page: My Reports (`/reports`)

**Route:** `/reports`  
**File:** `src/pages/MyReports.tsx`

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/my` | Get current user's all reports |

### Response

```json
[
  {
    "id": "uuid",
    "title": "AC Rusak",
    "status": "menunggu|diproses|selesai|diterima|ditolak",
    "category_name": "AC",
    "location_name": "Gedung A",
    "created_at": "2026-04-23T00:00:00.000Z"
  }
]
```

### Features
- Tab filter: All, Pending, In Progress, Resolved
- Search by title or report ID
- Sort by date

---

## Page: Report Detail (`/report/:id`)

**Route:** `/report/:id`  
**File:** `src/pages/ReportDetail.tsx`

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/:id` | Get report details with images |
| GET | `/api/reports/:id/history` | Get status history |
| GET | `/api/reports/:id/comments` | Get comments |
| POST | `/api/reports/:id/comments` | Add comment |
| PATCH | `/api/reports/:id/status` | Update status (Staff/Admin only) |

### GET /reports/:id Response

```json
{
  "id": "uuid",
  "title": "AC Rusak",
  "description": "AC tidak dingin",
  "status": "menunggu",
  "priority": "rendah",
  "reporter_id": "uuid",
  "location_id": "uuid",
  "category_id": "uuid",
  "location_name": "Gedung A",
  "category_name": "AC",
  "created_at": "2026-04-23T00:00:00.000Z",
  "images": [
    {
      "id": "uuid",
      "url": "http://minio:9000/..."
    }
  ]
}
```

### GET /reports/:id/history Response

```json
[
  {
    "id": "uuid",
    "report_id": "uuid",
    "change_by": "uuid",
    "old_status": "menunggu",
    "new_status": "diproses",
    "notes": "Sedang ditangani",
    "created_at": "2026-04-23T00:00:00.000Z",
    "user_name": "Admin"
  }
]
```

### GET /reports/:id/comments Response

```json
[
  {
    "id": "uuid",
    "report_id": "uuid",
    "user_id": "uuid",
    "message": "Komentar teks",
    "created_at": "2026-04-23T00:00:00.000Z",
    "user_name": "John Doe",
    "user_role": "MAHASISWA"
  }
]
```

### POST /reports/:id/comments Request

```json
{
  "message": "Komentar teks"
}
```

### POST /reports/:id/comments Response

Same as GET response (201)

### PATCH /reports/:id/status Request (Staff/Admin only)

```json
{
  "status": "diproses",
  "notes": "Sedang ditangani"
}
```

**Status values:** `diterima`, `diproses`, `selesai`, `ditolak`

### PATCH /reports/:id/status Response

```json
{
  "message": "Status berhasil diupdate"
}
```

---

## Page: Notifications (`/notifications`)

**Route:** `/notifications`  
**File:** `src/pages/User/Notifications.tsx` (imported from `User/Notifications.tsx`)

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get all notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| PATCH | `/api/notifications/:id/read` | Mark as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |
| DELETE | `/api/notifications/:id` | Delete notification |

### GET /notifications Response

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "report_id": "uuid",
    "title": "Status Diupdate",
    "body": "Laporan diproses",
    "is_read": false,
    "sent_at": "2026-04-23T00:00:00.000Z"
  }
]
```

---

## Page: Profile (`/profile`)

**Route:** `/profile`  
**File:** `src/pages/Profile.tsx`

### Features
- View user profile
- Logout functionality (calls `/api/auth/logout`)

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/logout` | Clear session |

---

## Page: Staff Dashboard (`/staff`)

**Route:** `/staff`  
**File:** `src/pages/staff/StaffDashboard.tsx`

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | Get all reports |
| GET | `/api/assignments/my-tasks` | Get tasks assigned to staff |

### GET /reports Response

```json
[
  {
    "id": "uuid",
    "title": "AC Rusak",
    "status": "menunggu|diproses|selesai",
    "priority": "rendah|sedang|tinggi",
    "reporter_id": "uuid",
    "location_id": "uuid",
    "category_id": "uuid",
    "location_name": "Gedung A",
    "category_name": "AC",
    "created_at": "2026-04-23T00:00:00.000Z",
    "images": [...]
  }
]
```

### GET /assignments/my-tasks Response

```json
[
  {
    "id": "uuid",
    "report_id": "uuid",
    "assigned_to": "uuid",
    "assigned_by": "uuid",
    "is_active": true,
    "is_auto_assign": false,
    "notes": "Kerjakan segera",
    "created_at": "2026-04-23T00:00:00.000Z",
    "report": {
      "id": "uuid",
      "title": "AC Rusak",
      "status": "diproses",
      "priority": "tinggi"
    }
  }
]
```

### Features
- Stats: Active Reports, Pending Tasks, Resolved Today
- Quick actions: Report Center, Management, Facility Info, Broadcast
- Report trends chart
- Recent activity feed

---

## Page: Staff Report Center (`/staff/reports`)

**Route:** `/staff/reports`  
**File:** `src/pages/staff/StaffReportCenter.tsx`

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | Get all reports |
| GET | `/api/reports/status/:status` | Filter by status |
| POST | `/api/assignments/auto-assign` | Auto-assign report |

### GET /reports Response

Same as Staff Dashboard

### POST /assignments/auto-assign Request

```json
{
  "report_id": "uuid"
}
```

### POST /assignments/auto-assign Response

```json
{
  "message": "Assignment berhasil"
}
```

### Features
- Tab filter: All, New, In Progress, Resolved
- Search by ID, title, or reporter
- Assign/Accept/Process/Complete report actions

---

## Page: Staff Management (`/staff/management`)

**Route:** `/staff/management`  
**File:** `src/pages/staff/StaffManagement.tsx`

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/staff-locations` | Get all staff locations |
| POST | `/api/staff-locations` | Assign location to staff |
| DELETE | `/api/staff-locations/:staffId/:locationId` | Remove staff from location |

---

## Page: Facility Management (`/staff/facility`)

**Route:** `/staff/facility`  
**File:** `src/pages/staff/FacilityManagement.tsx`

### API Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | Get all locations |
| GET | `/api/locations/tree` | Get locations tree |
| POST | `/api/locations` | Create location |
| PATCH | `/api/locations/:id` | Update location |
| DELETE | `/api/locations/:id` | Delete location |
| GET | `/api/categories` | Get categories |
| POST | `/api/categories` | Create category |
| PATCH | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

---

## Page: Broadcast (`/staff/broadcast`)

**Route:** `/staff/broadcast`  
**File:** `src/pages/staff/Broadcast.tsx`

### Features
- Send broadcast notifications to users

---

## Page: Admin Overview (`/admin`)

**Route:** `/admin`  
**File:** `src/pages/admin/AdminOverview.tsx`

### Features
- System status overview
- Stats: Total Users, System Health, Storage, Active Sessions
- System logs display
- Quick config toggles

---

## Page: Auth Callback (`/auth/callback`)

**Route:** `/auth/callback`  
**File:** `src/pages/AuthCallback.tsx`

### Query Parameter
- `token` - Access token from Google OAuth callback

### Process
1. Extract token from URL query param
2. Store in localStorage
3. Store user info from token
4. Redirect to home

---

## Page: Splash (`/`)

**Route:** `/`  
**File:** `src/pages/Splash.tsx`  
**Duration:** 2 seconds

### Process
1. Check for existing token
2. If token exists, redirect to home
3. If no token, redirect to login

---

## Page: Home Page (Landing)

**Route:** `/` (before login)  
**File:** `src/pages/HomePage.tsx`

### Features
- Landing page before login
- App branding and description

---

## Components

### BottomNav (`/components/layout/BottomNav.tsx`)

Navigation tabs:
- Home (`/home`)
- History (`/reports`)
- Create Report (`/report/new`)
- Notifications (`/notifications`)
- Profile (`/profile`)

### ScreenHeader

Reusable header component with back button, title, and actions.

### StatusBadge

Displays report status with color coding:
- Pending: gray
- In Progress: yellow
- Resolved: green
- Accepted: blue
- Rejected: red

### TabSelector

Horizontal tab selector for filtering.

### API Utility (`src/lib/api.ts`)

Base API configuration using axios:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Environment Variables

```env
VITE_API_BACKEND_URL=http://localhost:3000/api
```

---

## Router Configuration (`src/routes/AppRoutes.tsx`)

| Path | Page | Auth Required |
|------|------|--------------|
| `/` | Splash | No |
| `/login` | Login | No |
| `/auth/callback` | AuthCallback | No |
| `/home` | UserHome | Yes (MAHASISWA) |
| `/reports` | MyReports | Yes |
| `/report/new` | CreateReport | Yes |
| `/report/:id` | ReportDetail | Yes |
| `/notifications` | Notifications | Yes |
| `/profile` | Profile | Yes |
| `/staff` | StaffDashboard | Yes (STAFF/ADMIN) |
| `/staff/reports` | StaffReportCenter | Yes (STAFF/ADMIN) |
| `/staff/management` | StaffManagement | Yes (STAFF/ADMIN) |
| `/staff/facility` | FacilityManagement | Yes (ADMIN) |
| `/staff/broadcast` | Broadcast | Yes (STAFF/ADMIN) |
| `/admin` | AdminOverview | Yes (ADMIN) |