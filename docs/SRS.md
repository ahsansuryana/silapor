# Software Requirements Specification (SRS)
## SILAPOR v2 — Sistem Pelaporan Kerusakan Fasilitas Kampus

**Versi:** 2.0
**Tanggal:** 2026-05-23
**Institusi:** UIN Sunan Gunung Djati Bandung

---

## 1. Pendahuluan

### 1.1 Tujuan
Dokumen ini mendeskripsikan kebutuhan fungsional dan non-fungsional untuk sistem **SILAPOR v2**, sebuah platform digital untuk pelaporan, penanganan, dan monitoring kerusakan fasilitas kampus di lingkungan UIN Sunan Gunung Djati Bandung.

### 1.2 Ruang Lingkup
Sistem mencakup:
- Manajemen laporan kerusakan oleh mahasiswa
- Penugasan petugas (staff) secara otomatis berdasarkan hierarki lokasi
- Monitoring dan pengelolaan oleh admin
- Notifikasi real-time
- Upload dan viewing gambar melalui object storage (MinIO)
- Manajemen pengguna dengan 3 role: Mahasiswa, Staff, Admin

### 1.3 Definisi & Akronim

| Istilah | Definisi |
|---------|----------|
| SILAPOR | Sistem Pelaporan Kerusakan Fasilitas Kampus |
| Mahasiswa | Pengguna yang melaporkan kerusakan |
| Staff | Petugas yang menangani laporan kerusakan |
| Admin | Pengelola sistem |
| NIM | Nomor Induk Mahasiswa |
| JWT | JSON Web Token untuk autentikasi |
| MinIO | Object storage S3-compatible untuk gambar |
| OAuth 2.0 | Protokol autentikasi Google |

### 1.4 Referensi
- API Docs: `backend/API_DOCS.md`
- Database Schema: `database/init sql.sql`
- NFR: `docs/NFR.md`
- UC: `docs/UC.md`
- ERD: `docs/ERD.md`
- SAD: `docs/SAD.md`

---

## 2. Gambaran Sistem

### 2.1 Perspektif Produk
SILAPOR v2 adalah sistem berbasis web dengan arsitektur Client-Server:
- **Frontend:** React 19 SPA (Single Page Application) dengan TypeScript, Vite 7
- **Backend:** REST API dengan Express 5 (TypeScript)
- **Database:** PostgreSQL 16
- **Storage:** MinIO untuk gambar laporan
- **Container:** Docker Compose (4 service)

### 2.2 Karakteristik Pengguna

| Role | Deskripsi | Keahlian |
|------|-----------|----------|
| Mahasiswa | Melapor kerusakan, upload foto, cek status | Dasar (mobile web) |
| Staff | Menerima tugas, update status, kelola laporan | Menengah |
| Admin | Kelola semua aspek sistem, lihat statistik | Mahir |

### 2.3 Lingkungan Operasi
- Browser modern (Chrome, Firefox, Safari, Edge)
- Mobile-first responsive design
- Linux container (Docker)
- PostgreSQL 16 Alpine
- Node.js 20 Alpine

### 2.4 Kendala Desain & Implementasi
- REST API dengan Express 5
- Autentikasi JWT (access + refresh token)
- Raw SQL queries (tanpa ORM)
- Styling dengan Tailwind CSS v4
- Roll-based routing di frontend

---

## 3. Kebutuhan Fungsional (FR)

Semua FR didokumentasikan secara detail di `docs/FR/`.

| ID | Nama | Aktor | Prioritas |
|----|------|-------|-----------|
| FR-1 | Registrasi Akun | Mahasiswa | Tinggi |
| FR-2 | Login dengan Google OAuth | Mahasiswa, Staff, Admin | Tinggi |
| FR-3 | Login dengan NIM/Password | Mahasiswa, Staff, Admin | Tinggi |
| FR-4 | Buat Laporan Kerusakan | Mahasiswa | Tinggi |
| FR-5 | Upload Gambar Laporan | Mahasiswa, Staff | Tinggi |
| FR-6 | Lihat Laporan Saya | Mahasiswa | Tinggi |
| FR-7 | Detail Laporan | Mahasiswa, Staff, Admin | Tinggi |
| FR-8 | Update Status Laporan | Staff, Admin | Tinggi |
| FR-9 | Riwayat Status Laporan | Mahasiswa, Staff, Admin | Sedang |
| FR-10 | Komentar Laporan | Mahasiswa, Staff, Admin | Sedang |
| FR-11 | Assignment Otomatis Staff | Sistem | Tinggi |
| FR-12 | Assignment Manual Staff | Admin | Sedang |
| FR-13 | Transfer Assignment | Admin, Staff | Sedang |
| FR-14 | Hierarki Lokasi | Sistem | Tinggi |
| FR-15 | Manajemen Kategori | Admin | Sedang |
| FR-16 | Notifikasi In-App | Mahasiswa, Staff, Admin | Sedang |
| FR-17 | Dashboard Admin | Admin | Tinggi |
| FR-18 | Manajemen Staff | Admin | Sedang |
| FR-19 | Manajemen User (Mahasiswa) | Admin | Sedang |
| FR-20 | Manajemen Lokasi | Admin | Sedang |
| FR-21 | Profil Pengguna | Mahasiswa, Staff, Admin | Rendah |
| FR-22 | Statistik Laporan | Admin | Sedang |
| FR-23 | Refresh Token | Semua | Tinggi |
| FR-24 | Staff Management (CRUD) | Admin | Sedang |
| FR-25 | Staff Dashboard | Staff | Tinggi |

---

## 4. Kebutuhan Non-Fungsional (NFR)

Detail: `docs/NFR.md`

| ID | Aspek | Target |
|----|-------|--------|
| NFR-1 | Performa | Response < 2s, query < 500ms |
| NFR-2 | Keamanan | JWT, bcrypt, httpOnly cookie, CORS |
| NFR-3 | Ketersediaan | 99.9% uptime (container restart) |
| NFR-4 | Usability | Mobile-first, mobile-friendly |
| NFR-5 | Skalabilitas | Stateless backend, horizontal scaling |
| NFR-6 | Maintainability | TypeScript, modular MVC pattern |

---

## 5. Data Model

Detail: `docs/ERD.md`

10 tabel utama:
- users, locations, categories, reports, report_images
- report_status_history, staff_report_assigments, notifications, report_comments, user_staff_location

---

## 6. Use Case Model

Detail: `docs/UC.md`

**Aktor:**
- **Mahasiswa:** Registrasi, Login, Buat Laporan, Upload Gambar, Lihat Laporan, Lihat Notifikasi
- **Staff:** Login, Lihat Task, Update Status, Transfer, Komentar, Manajemen Lokasi
- **Admin:** Login, Overview Dashboard, Manage Laporan, Manage Staff, Manage Lokasi, Manage User, Manage Kategori

---

## 7. Kebutuhan Antarmuka Eksternal

### 7.1 Antarmuka Pengguna
- React 19 SPA dengan Tailwind CSS v4
- Bottom navigation untuk mobile
- Protected routing berdasarkan role
- Splash screen, loading states

### 7.2 Antarmuka Perangkat Keras
- Standar server dengan Docker
- MinIO untuk object storage (gambar)

### 7.3 Antarmuka Perangkat Lunak
- REST API over HTTP/HTTPS
- JSON request/response
- multipart/form-data untuk upload gambar
- Google OAuth 2.0 API

### 7.4 Antarmuka Komunikasi
- HTTP/HTTPS
- Cookie untuk refresh token
- Bearer token untuk access token
