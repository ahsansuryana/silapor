# SILAPOR v2 — Bug Report

> **Generated:** 19 Juni 2026
> **Status:** ✅ Bug notifikasi (4, 7, 8, 12, 13, 14, 16) sudah diperbaiki
> **Scope:** Seluruh codebase (backend, frontend, database, infra)

---

## 🔴 KRITIS

### Bug 1 — ProtectedRoute infinite redirect loop

| Atribut | Detail |
|---------|--------|
| **File** | `frontend/src/components/auth/ProtectedRoute.tsx:13` |
| **Masalah** | Saat user tidak punya token valid, diarahkan ke `/home` bukan `/login`. `/home` sendiri juga pakai `ProtectedRoute`, jadi terjadi infinite redirect loop. |
| **Dampak** | User yang belum login tidak bisa mengakses halaman manapun — langsung redirect loop dan blank screen. |
| **Fix** | Redirect ke `/login` saat token tidak valid. |

---

### Bug 2 — Delete report gagal karena FK constraint + MinIO orphan

| Atribut | Detail |
|---------|--------|
| **File** | `database/init.sql:79,124` & `backend/src/controllers/reports.controller.ts:202-208` |
| **Masalah** | Foreign key `report_images.report_id`, `notifications.report_id`, dan `report_status_history.report_id` tidak punya `ON DELETE CASCADE`. Saat report dihapus: (1) error FK violation, (2) gambar di MinIO tidak ikut terhapus. |
| **Dampak** | Admin tidak bisa hapus report yang memiliki relasi. MinIO membengkak dengan file orphan. |
| **Fix** | Tambah `ON DELETE CASCADE` di schema + hapus objek MinIO sebelum hapus row. |

---

### Bug 3 — `getMyReports` ignore pagination

| Atribut | Detail |
|---------|--------|
| **File** | `backend/src/controllers/reports.controller.ts:53-71` & `backend/src/models/reports.model.ts:57` |
| **Masalah** | `limit` dan `offset` di-parse dari query params tapi **tidak pernah dikirim** ke method `findByReporterWithDetails()`. Method model-nya sendiri juga tidak menerima parameter pagination. |
| **Dampak** | Semua laporan user dikembalikan tanpa batas. Makin banyak data, makin berat response-nya. |
| **Fix** | Tambah parameter `limit`/`offset` ke model dan controller. |

---

### Bug 4 — Notifikasi bisa diakses/dihapus user lain ✅

| Atribut | Detail |
|---------|--------|
| **File** | `backend/src/controllers/notifications.controller.ts:17-34` |
| **Masalah** | `markAsRead()` dan `remove()` hanya pakai param `id`, tanpa verifikasi bahwa notifikasi milik user yang sedang login (`userId` dari token). `markAllAsRead()` sudah benar (filter by `user.id`). |
| **Dampak** | User A bisa menandai baca/hapus notifikasi milik User B. |
| **Fix** | Tambah `findById()` dulu, lalu cek `notification.user_id !== user.id` sebelum aksi. |

---

### Bug 5 — `updateStatus` tanpa role guard

| Atribut | Detail |
|---------|--------|
| **File** | `backend/src/routes/reports.route.ts:49` |
| **Masalah** | `PATCH /:id/status` cuma pakai middleware `authenticate`, tanpa `requireRole`. |
| **Dampak** | Mahasiswa bisa mengubah status laporan staff/admin, termasuk menyelesaikan atau menolak laporan. |
| **Fix** | Tambah `requireRole("STAFF", "ADMIN")`. |

---

### Bug 6 — JWT token tidak mengandung `name`

| Atribut | Detail |
|---------|--------|
| **File** | `backend/src/controllers/auth.controller.ts:151` & `frontend/src/lib/jwt.ts:32` |
| **Masalah** | JWT payload hanya `{ id, role }`, tapi frontend (`getUserFromToken`) memanggil `decoded.name` yang selalu **undefined**. |
| **Dampak** | Frontend tidak bisa mendapatkan nama user dari token. |
| **Fix** | Tambah `name` ke JWT payload atau buat endpoint `/me`. |

---

### Bug 7 — `sendPush` gagal diam-diam ✅

| Atribut | Detail |
|---------|--------|
| **File** | `backend/src/lib/push-notification.ts:39-41` |
| **Masalah** | Semua error di-catch dan cuma di-console.log. Caller tidak tahu kalau push notification gagal. |
| **Dampak** | Laporan tetap terbuat, status tetap berubah, tapi user tidak dapat notifikasi tanpa ada indikasi error. |
| **Fix** | `sendPush` sekarang return `Promise<boolean>`, log dengan context user ID. |

---

### Bug 8 — Logout hapus SEMUA FCM token (multi-device) ✅

| Atribut | Detail |
|---------|--------|
| **File** | `backend/src/controllers/auth.controller.ts:256` |
| **Masalah** | `deleteByUserId(user.id)` menghapus semua FCM token milik user. |
| **Dampak** | Logout dari browser A membuat notifikasi push di browser B juga mati. |
| **Fix** | Terima `token` dari request body, hapus spesifik. Frontend kirim `fcm_token` dari localStorage. Fallback ke `deleteByUserId` jika token tidak dikirim. |

---

### Bug 9 — `require()` campur aduk dengan import

| Atribut | Detail |
|---------|--------|
| **File** | `backend/src/controllers/auth.controller.ts:80` & `backend/src/routes/staff.route.ts:26` |
| **Masalah** | Menggunakan `require("../lib/db").default` padahal `pool` sudah di-import di atas file via `import pool from "../lib/db"`. |
| **Dampak** | Path `require` relatif terhadap file, bukan tsconfig `paths`. Bisa broken di compiled output `dist/`. |
| **Fix** | Gunakan `pool` yang sudah di-import. |

---

## 🟡 MEDIUM

### Bug 10 — `updated_dt` inconsistent

| Atribut | Detail |
|---------|--------|
| **File** | `backend/src/models/report_status_history.model.ts:14`, `database/init.sql:108` |
| **Masalah** | Kolom `updated_dt` di tabel `report_status_history`, sementara semua tabel lain pakai `updated_at`. |
| **Dampak** | Inkonsistensi skema, potensi typo di query. |
| **Fix** | Rename ke `updated_at`. |

---

### Bug 11 — Tabel `staff_report_assigments` typo

| Atribut | Detail |
|---------|--------|
| **File** | Seluruh codebase (schema, model, controller) |
| **Masalah** | Tabel bernama `staff_report_assigments` — kehilangan huruf 'n' (seharusnya `assignments`). |
| **Dampak** | Typo yang sudah konsisten di seluruh codebase, jadi secara teknis tidak broken, tapi tidak profesional. Migrasi nama akan kompleks. |
| **Fix** | Buat migration rename table di masa depan. |

---

### Bug 12 — Firebase config hardcoded di Service Worker ✅

| Atribut | Detail |
|---------|--------|
| **File** | `frontend/public/sw.js:5-10`, ~~`frontend/public/firebase-messaging-sw.js:5-10`~~ |
| **Masalah** | API key dll hardcode langsung di file SW. Juga ada **duplikasi** file SW (`sw.js` dan `firebase-messaging-sw.js`) dengan kode Firebase identik. `sw.js` adalah yang terdaftar, `firebase-messaging-sw.js` tidak terpakai. |
| **Dampak** | Ganti project Firebase harus edit manual. Duplikasi bikin bingung. |
| **Fix** | `firebase-messaging-sw.js` sudah dihapus. Hardcoded config di `sw.js` masih perlu build-time template injection. |

---

### Bug 13 — `listenForForegroundMessages()` side effect di module scope ✅

| Atribut | Detail |
|---------|--------|
| **File** | `frontend/src/lib/fcm.ts:82` |
| **Masalah** | `listenForForegroundMessages()` dipanggil saat module di-import (bukan di lifecycle component). |
| **Dampak** | Bisa daftar listener ganda kalau hot-reload terjadi. |
| **Fix** | Panggilan dipindah ke `main.tsx` setelah `initSW().then(...)`. |

---

### Bug 14 — Tidak ada error handling untuk `messaging` null ✅

| Atribut | Detail |
|---------|--------|
| **File** | `frontend/src/lib/fcm.ts:80-88` |
| **Masalah** | `onMessage()` bisa throw kalau Firebase messaging gagal. Tidak ada try-catch. |
| **Dampak** | Aplikasi crash total kalau Firebase messaging gagal load. |
| **Fix** | `listenForForegroundMessages()` dibungkus try-catch. |

---

### Bug 15 — Gambar tidak terhapus dari MinIO saat report di-delete

| Atribut | Detail |
|---------|--------|
| **File** | `backend/src/controllers/reports.controller.ts:202-208` |
| **Masalah** | Saat report dihapus, gambar di MinIO tetap ada (orphan). Juga `report_images` row tidak dihapus. |
| **Dampak** | Storage MinIO membengkak. File-file orphan tidak berguna. |
| **Fix** | Hapus semua `report_images` row + object MinIO sebelum hapus report. |

---

## 🔵 LOW

### Bug 16 — FCM `device_type` hardcoded 'web' ✅

| Atribut | Detail |
|---------|--------|
| **File** | `frontend/src/lib/fcm.ts:47` |
| **Masalah** | `registerFcmToken()` selalu kirim `device_type: 'web'`. Parameter `device_name` tidak pernah dikirim. |
| **Dampak** | Kolom `device_name` selalu `NULL`. Info device hilang. |
| **Fix** | Kirim `navigator.userAgent.slice(0, 255)` sebagai `device_name`. |

---

### Bug 17 — Rate limiter in-memory (tidak untuk production)

| Atribut | Detail |
|---------|--------|
| **File** | `backend/src/routes/auth.route.ts:19` |
| **Masalah** | Login rate limiter pakai `Map<string, ...>` di memory. Reset saat server restart, tidak shared antar instance. |
| **Dampak** | Bypass rate limit dengan restart server. Tidak scale ke multi-instance. |
| **Fix** | Gunakan Redis atau store terpusat. |

---

### Bug 18 — `.env` dengan real credentials ter-commit

| Atribut | Detail |
|---------|--------|
| **File** | `/.env`, `/backend/.env.global`, `/frontend/.env.global` |
| **Masalah** | Berisi Firebase private key, Google OAuth secret, DB password asli. Semua sudah ter-commit ke git. |
| **Dampak** | **KEAMANAN**: Siapapun dengan akses repo punya kredensial production. Firebase private key, OAuth secret, dan DB password terekspos. |
| **Fix** | Rotate semua secret, hapus dari git history, tambah ke `.gitignore`. |

---

## 📱 BUG TERKAIT NOTIFIKASI

Ringkasan semua bug yang berhubungan dengan sistem notifikasi (push notification via FCM dan in-app notification):

| # | Bug | File | Status |
|---|-----|------|--------|
| **4** | Notifikasi bisa diakses/dihapus user lain | `notifications.controller.ts:17-34` | ✅ Fixed |
| **7** | `sendPush` gagal diam-diam | `push-notification.ts:39-41` | ✅ Fixed |
| **8** | Logout hapus SEMUA FCM token | `auth.controller.ts:256` | ✅ Fixed |
| **12** | Firebase config hardcoded di SW | `sw.js:5-10`, ~~`firebase-messaging-sw.js`~~ | ✅ Fixed (file duplikat dihapus) |
| **13** | `listenForForegroundMessages()` side effect | `fcm.ts:82` | ✅ Fixed |
| **14** | Tidak ada error handling `onMessage` | `fcm.ts:80-88` | ✅ Fixed |
| **16** | FCM `device_type` hardcoded | `fcm.ts:47` | ✅ Fixed |
| **---** | Duplikasi file service worker | ~~`firebase-messaging-sw.js`~~ | ✅ File dihapus |

**Flow notifikasi saat ini:**
1. Frontend daftar FCM token via `POST /auth/fcm-token` → simpan di DB
2. Staff/Admin update status/assign → `sendPush(userId, ...)` dipanggil
3. `sendPush()` ambil semua token user dari DB → `messaging.sendEach(messages)`
4. Background SW (`sw.js`) tangkap `onBackgroundMessage` → tampilkan notifikasi
5. Foreground (`fcm.ts`) tangkap `onMessage` → dispatch custom event `fcm-message`
