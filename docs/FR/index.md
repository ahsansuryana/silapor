# Functional Requirements Index
## SILAPOR v2

> **Penggunaan:** Index ini berisi ringkasan semua Functional Requirements (FR). Coding agent cukup baca index ini dulu untuk konteks, lalu buka file FR-N.md spesifik saat perlu detail implementasi.

---

## Ringkasan

| ID | Nama | Aktor | Prioritas | File |
|----|------|-------|-----------|------|
| FR-1 | Registrasi Akun | Mahasiswa | Tinggi | [FR-1.md](./FR-1.md) |
| FR-2 | Login Google OAuth | Mahasiswa, Staff, Admin | Tinggi | [FR-2.md](./FR-2.md) |
| FR-3 | Login NIM/Password | Mahasiswa, Staff, Admin | Tinggi | [FR-3.md](./FR-3.md) |
| FR-4 | Buat Laporan Kerusakan | Mahasiswa | Tinggi | [FR-4.md](./FR-4.md) |
| FR-5 | Upload Gambar Laporan | Mahasiswa | Tinggi | [FR-5.md](./FR-5.md) |
| FR-6 | Lihat Laporan Saya | Mahasiswa | Tinggi | [FR-6.md](./FR-6.md) |
| FR-7 | Detail Laporan | Mahasiswa, Staff, Admin | Tinggi | [FR-7.md](./FR-7.md) |
| FR-8 | Update Status Laporan | Staff, Admin | Tinggi | [FR-8.md](./FR-8.md) |
| FR-9 | Riwayat Status Laporan | Mahasiswa, Staff, Admin | Sedang | [FR-9.md](./FR-9.md) |
| FR-10 | Komentar Laporan | Mahasiswa, Staff, Admin | Sedang | [FR-10.md](./FR-10.md) |
| FR-11 | Assignment & Transfer Staff | Sistem, Admin, Staff | Tinggi | [FR-11.md](./FR-11.md) |
| FR-12 | Hierarki & Manajemen Lokasi | Admin, Semua | Tinggi | [FR-12.md](./FR-12.md) |
| FR-13 | Manajemen Kategori | Admin | Sedang | [FR-13.md](./FR-13.md) |
| FR-14 | Notifikasi In-App | Mahasiswa, Staff, Admin | Sedang | [FR-14.md](./FR-14.md) |
| FR-15 | Dashboard & Statistik | Admin, Staff | Tinggi | [FR-15.md](./FR-15.md) |
| FR-16 | Manajemen Pengguna | Admin | Sedang | [FR-16.md](./FR-16.md) |

---

## Detail Per Modul

### Modul Autentikasi (FR-1 s.d. FR-3)
- Registrasi via NIM + password, login via NIM/password, login via Google OAuth
- JWT dual-token (access 15m + refresh 7d httpOnly cookie)
- Role: MAHASISWA, STAFF, ADMIN

### Modul Laporan (FR-4 s.d. FR-10)
- CRUD laporan kerusakan, upload gambar ke MinIO, komentar, riwayat status
- Status flow: menunggu → diterima → diproses → selesai / ditolak

### Modul Assignment & Workflow (FR-11)
- Auto-assign staff berdasarkan hierarki lokasi
- Manual assign dan transfer oleh admin

### Modul Master Data (FR-12, FR-13, FR-16)
- Hierarki lokasi (UNIVERSITAS → FAKULTAS → JURUSAN → RUANGAN/AREA)
- Kategori laporan, manajemen user

### Modul Notifikasi & Dashboard (FR-14, FR-15)
- Notifikasi in-app untuk semua perubahan status & assignment
- Dashboard admin (statistik charts) dan staff (task overview)
