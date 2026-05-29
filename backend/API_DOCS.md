# SILAPOR API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

### POST /auth/register

Register new user account with NIM and password.

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "nim": "1237050090",
  "name": "John Doe",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": "uuid",
    "name": "John Doe"
  }
}
```

**Response (400):** `"NIM, nama, dan password wajib diisi"`  
**Response (409):** `"NIM sudah terdaftar"`

---

### POST /auth/login

Login with NIM and password.

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "nim": "1237050090",
  "password": "password123"
}
```

**Response (200):**
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

**Response (401):** `"NIM atau password salah"`  
**Response (400):** `"Akun ini terdaftar via Google"`

---

### GET /auth/google/redirect

Redirect to Google OAuth login page.

**Response:** `302 Redirect` to Google OAuth consent screen.

---

### GET /auth/google/callback

Google OAuth callback. Redirects to frontend with token.

**Response:** `302 Redirect` to `{CLIENT_URL}/auth/callback?token={accessToken}`

---

### POST /auth/refresh

Refresh access token using refresh token from cookie.

**Headers:** Cookie must contain `refresh_token`

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (401):** `"Refresh token tidak ada"`  
**Response (403):** `"Refresh token tidak valid"`

---

### POST /auth/logout

Clear refresh token cookie and logout.

**Response (200):**
```json
{
  "message": "Logout berhasil"
}
```

---

## Reports

All report endpoints require **Authorization header**: `Authorization: Bearer <accessToken>`

### GET /reports

Get all reports with details and images.

**Query Parameters:**
- `limit` (optional, default: 50)
- `offset` (optional, default: 0)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "AC Rusak",
    "description": "AC tidak dingin",
    "status": "menunggu|diterima|diproses|selesai|ditolak",
    "priority": "rendah|sedang|tinggi",
    "reporter_id": "uuid",
    "location_id": "uuid",
    "category_id": "uuid",
    "created_at": "2026-04-23T00:00:00.000Z",
    "updated_at": "2026-04-23T00:00:00.000Z",
    "reporter_name": "John Doe",
    "location_name": "Gedung A",
    "category_name": "AC",
    "images": [
      {
        "id": "uuid",
        "report_id": "uuid",
        "minio_object_key": "reports/uuid/image.jpg",
        "url": "http://minio:9000/...",
        "created_at": "2026-04-23T00:00:00.000Z"
      }
    ]
  }
]
```

---

### GET /reports/my

Get current user's reports.

**Query Parameters:**
- `limit` (optional, default: 50)
- `offset` (optional, default: 0)

**Response (200):** Same as GET /reports

---

### GET /reports/:id

Get single report by ID.

**Response (200):**
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
  "created_at": "2026-04-23T00:00:00.000Z",
  "updated_at": null,
  "reporter_name": "John Doe",
  "location_name": "Gedung A",
  "category_name": "AC",
  "images": [...]
}
```

**Response (404):** `"Laporan tidak ditemukan"`

---

### GET /reports/status/:status

Get reports by status.

**Status Values:** `menunggu`, `diterima`, `diproses`, `selesai`, `ditolak`

**Response (200):** Same as GET /reports (array)

---

### GET /reports/priority/:priority

Get reports by priority.

**Priority Values:** `rendah`, `sedang`, `tinggi`

**Response (200):** Same as GET /reports (array)

---

### POST /reports

Create new report.

**Headers:**
- `Content-Type: multipart/form-data`
- `Authorization: Bearer <accessToken>`

**Request Body (multipart/form-data):**
```
location_id: uuid (required)
category_id: uuid (required)
title: string (required)
description: string (optional)
priority: rendah|sedang|tinggi (optional, default: rendah)
file: image file (optional, max 10MB)
```

**Response (201):**
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
  "created_at": "2026-04-23T00:00:00.000Z",
  "updated_at": null
}
```

**Response (400):** `"Location, category, dan title wajib diisi"`

---

### PATCH /reports/:id

Update report (title, description, priority).

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "AC Rusak Sekali",
  "description": "Deskripsi baru",
  "priority": "tinggi"
}
```

All fields are optional. Only include fields to update.

**Response (200):**
```json
{
  "id": "uuid",
  "title": "AC Rusak Sekali",
  "description": "Deskripsi baru",
  "priority": "tinggi",
  ...
}
```

**Response (404):** `"Laporan tidak ditemukan"`

---

### PATCH /reports/:id/status

Update report status.

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "status": "diproses",
  "notes": "Sedang ditangani"
}
```

**Status Values:** `menunggu`, `diterima`, `diproses`, `selesai`, `ditolak`

**Response (200):**
```json
{
  "message": "Status berhasil diupdate"
}
```

**Response (404):** `"Laporan tidak ditemukan"`

---

### DELETE /reports/:id

Delete report.

**Response (200):**
```json
{
  "message": "Laporan berhasil dihapus"
}
```

**Response (404):** `"Laporan tidak ditemukan"`

---

## Report Comments

All comment endpoints require **Authorization header**.

### GET /reports/:id/comments

Get comments for a report.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "report_id": "uuid",
    "user_id": "uuid",
    "message": "Komentar teks",
    "created_at": "2026-04-23T00:00:00.000Z",
    "user_name": "John Doe",
    "user_role": "MAHASISWA|STAFF|ADMIN"
  }
]
```

---

### POST /reports/:id/comments

Add comment to a report.

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "message": "Komentar teks"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "report_id": "uuid",
  "user_id": "uuid",
  "message": "Komentar teks",
  "created_at": "2026-04-23T00:00:00.000Z",
  "user_name": "John Doe",
  "user_role": "MAHASISWA"
}
```

**Response (400):** `"Pesan wajib diisi"`

---

## Report History

All history endpoints require **Authorization header**.

### GET /reports/:id/history

Get status history for a report.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "report_id": "uuid",
    "change_by": "uuid",
    "old_status": "menunggu",
    "new_status": "diproses",
    "notes": "Sedang diperbaiki",
    "changed_at": "2026-04-23T00:00:00.000Z",
    "user_name": "Admin"
  }
]
```

**Response (404):** `"Laporan tidak ditemukan"`

---

## Categories

### GET /categories

Get all categories.

**No Auth Required**

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "AC",
    "short_description": "Air Conditioner",
    "created_at": "2026-04-23T00:00:00.000Z",
    "updated_at": null
  }
]
```

---

### GET /categories/:id

Get single category by ID.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "AC",
  "short_description": "Air Conditioner",
  "created_at": "2026-04-23T00:00:00.000Z",
  "updated_at": null
}
```

---

### POST /categories

Create new category.

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "name": "Listrik",
  "short_description": "Masalah listrik"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Listrik",
  "short_description": "Masalah listrik",
  "created_at": "2026-04-23T00:00:00.000Z",
  "updated_at": null
}
```

**Response (403):** Unauthorized (if no token or invalid)

---

### PATCH /categories/:id

Update category.

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "name": "Listrik",
  "short_description": "Masalah listrik dan lampu"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Listrik",
  "short_description": "Masalah listrik dan lampu",
  "created_at": "2026-04-23T00:00:00.000Z",
  "updated_at": "2026-04-23T00:00:00.000Z"
}
```

---

### DELETE /categories/:id

Delete category.

**Authorization Required**

**Response (200):**
```json
{
  "message": "Kategori berhasil dihapus"
}
```

---

## Locations

### GET /locations

Get all locations.

**No Auth Required**

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Gedung A",
    "type": "GEDUNG|FAKULTAS|JURUSAN|RUANGAN|AREA",
    "parent_id": "uuid|null",
    "created_at": "2026-04-23T00:00:00.000Z",
    "updated_at": "2026-04-23T00:00:00.000Z"
  }
]
```

---

### GET /locations/tree

Get locations as tree (with children nested).

**No Auth Required**

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Universitas",
    "type": "UNIVERSITAS",
    "children": [
      {
        "id": "uuid",
        "name": "Fakultas Teknik",
        "type": "FAKULTAS",
        "children": [...]
      }
    ]
  }
]
```

---

### GET /locations/:id

Get single location by ID.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Gedung A",
  "type": "GEDUNG",
  "parent_id": null,
  "created_at": "2026-04-23T00:00:00.000Z",
  "updated_at": "2026-04-23T00:00:00.000Z"
}
```

---

### POST /locations

Create new location.

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "name": "Gedung B",
  "type": "GEDUNG",
  "parent_id": "uuid|null"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Gedung B",
  "type": "GEDUNG",
  "parent_id": null,
  "created_at": "2026-04-23T00:00:00.000Z",
  "updated_at": "2026-04-23T00:00:00.000Z"
}
```

---

### PATCH /locations/:id

Update location.

**Authorization Required**

**Request Body:**
```json
{
  "name": "Gedung Baru",
  "parent_id": "uuid"
}
```

**Response (200):** Same as POST /locations

---

### DELETE /locations/:id

Delete location.

**Authorization Required**

**Response (200):**
```json
{
  "message": "Lokasi berhasil dihapus"
}
```

---

## Notifications

All notification endpoints require **Authorization header**.

### GET /notifications

Get all notifications for current user.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "report_id": "uuid",
    "title": "Status Diupdate",
    "body": "Laporan diproses",
    "is_read": false,
    "sent_at": "2026-04-23T00:00:00.000Z",
    "created_at": "2026-04-23T00:00:00.000Z"
  }
]
```

---

### GET /notifications/unread-count

Get count of unread notifications.

**Response (200):**
```json
{
  "count": 5
}
```

---

### PATCH /notifications/:id/read

Mark notification as read.

**Response (200):**
```json
{
  "message": "Notifikasi ditandai sudah dibaca"
}
```

---

### PATCH /notifications/read-all

Mark all notifications as read.

**Response (200):**
```json
{
  "message": "Semua notifikasi ditandai sudah dibaca"
}
```

---

### DELETE /notifications/:id

Delete notification.

**Response (200):**
```json
{
  "message": "Notifikasi berhasil dihapus"
}
```

---

## Staff Assignments

All assignment endpoints require **Authorization header**.

### GET /assignments/my-tasks

Get tasks assigned to current staff.

**Response (200):**
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
      "priority": "tinggi",
      ...
    }
  }
]
```

---

### GET /assignments/:reportId

Get assignment for a report.

**Response (200):**
```json
{
  "id": "uuid",
  "report_id": "uuid",
  "assigned_to": "uuid",
  "assigned_by": "uuid",
  "is_active": true,
  "is_auto_assign": false,
  "notes": "Kerjakan segera",
  "created_at": "2026-04-23T00:00:00.000Z"
}
```

---

### GET /assignments/:reportId/active

Get active assignment for a report.

**Response (200):** Same as GET /assignments/:reportId or `null`

**Response (404):** `"Assignment tidak ditemukan"`

---

### POST /assignments

Assign report to staff.

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "report_id": "uuid",
  "assigned_to": "uuid",
  "notes": "Kerjakan segera"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "report_id": "uuid",
  "assigned_to": "uuid",
  "assigned_by": "uuid",
  "is_active": true,
  "is_auto_assign": false,
  "notes": "Kerjakan segera",
  "created_at": "2026-04-23T00:00:00.000Z"
}
```

---

### POST /assignments/transfer

Transfer report to another staff.

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "report_id": "uuid",
  "new_staff_id": "uuid",
  "notes": "Transfer ke staff lain"
}
```

**Response (200):**
```json
{
  "message": "Assignment berhasil ditransfer"
}
```

---

### POST /assignments/auto-assign

Auto-assign report to available staff.

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "report_id": "uuid"
}
```

**Response (200):**
```json
{
  "message": "Assignment berhasil"
}
```

---

## Staff Locations

All staff location endpoints require **Authorization header**.

### GET /staff-locations/my

Get locations assigned to current staff.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "staff_id": "uuid",
    "location_id": "uuid",
    "created_at": "2026-04-23T00:00:00.000Z",
    "location": {
      "id": "uuid",
      "name": "Gedung A",
      "type": "GEDUNG"
    }
  }
]
```

---

### GET /staff-locations/staff/:staffId

Get locations for a specific staff.

**Response (200):** Same as GET /staff-locations/my

---

### GET /staff-locations/location/:locationId/staff

Get staff assigned to a location.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "staff_id": "uuid",
    "location_id": "uuid",
    "created_at": "2026-04-23T00:00:00.000Z",
    "staff": {
      "id": "uuid",
      "name": "John Doe"
    }
  }
]
```

---

### POST /staff-locations

Assign location to staff.

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "staff_id": "uuid",
  "location_id": "uuid"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "staff_id": "uuid",
  "location_id": "uuid",
  "created_at": "2026-04-23T00:00:00.000Z"
}
```

---

### DELETE /staff-locations/:staffId/:locationId

Remove staff from location.

**Response (200):**
```json
{
  "message": "Staff berhasil dihapus dari lokasi"
}
```

---

## Report Images

All image endpoints require **Authorization header**.

### GET /reports/:id/images

Get images for a report.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "report_id": "uuid",
    "minio_object_key": "reports/uuid/image.jpg",
    "created_at": "2026-04-23T00:00:00.000Z"
  }
]
```

---

### POST /reports/:id/images

Upload image for a report.

**Headers:** `Content-Type: multipart/form-data`

**Request Body:**
```
file: image file (required, max 10MB)
```

**Response (201):**
```json
{
  "id": "uuid",
  "report_id": "uuid",
  "minio_object_key": "reports/uuid/image.jpg",
  "created_at": "2026-04-23T00:00:00.000Z"
}
```

---

### DELETE /reports/:id/images/:imageId

Delete image from report.

**Response (200):**
```json
{
  "message": "Gambar berhasil dihapus"
}
```