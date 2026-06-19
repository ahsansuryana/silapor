# `backend/src/controllers/auth.controller.ts` — Auth: register, login, OAuth, refresh, FCM

## Lokasi file asli
`backend/src/controllers/auth.controller.ts`

## Tujuan / peran file ini
Controller terbesar di project. Tangani semua flow autentikasi: register lokal (mahasiswa/staff/admin), login NIM+password, login via Google OAuth, refresh access token, update profile, logout, dan registrasi/penghapusan FCM token.

## Penjelasan per handler

### `updateRole(req, res)` — TEMPORARY, untuk setup awal
Update role user berdasarkan NIM. Tidak ada middleware auth → siapapun bisa ubah role siapapun.
> ⚠️ **Security issue:** komentar di file route bilang "TEMPORARY: For initial setup". Tapi route-nya `POST /api/auth/update-role` masih aktif. **Hapus / proteksi sebelum production**.

### `register(req, res)` — register mahasiswa
1. Validasi NIM/nama/password ada.
2. Cek NIM belum terdaftar (`UsersModel.findByNim`).
3. Hash password (`bcrypt.hash(pw, 10)`).
4. Insert user dengan role `MAHASISWA`.

### `registerStaff(req, res)` — admin daftarkan staff
Identik dengan `register` tapi role `STAFF` + optional array `locations` (langsung di-assign mapping staff→lokasi). Route-nya dilindungi `authenticate + requireAdmin`.

Bagian aneh:
```ts
const pool = require("../lib/db").default;
for (const locationId of locations) {
  await pool.query("INSERT INTO user_staff_location ...");
}
```
Ini bypass `UserStaffLocationModel.assign()`. Konsekuensinya: tidak ada `ON CONFLICT DO NOTHING`, kalau lokasi duplikat di payload, akan error. Sebaiknya panggil `UserStaffLocationModel.assign()`.

### `registerAdmin(req, res)` — TEMPORARY
Sama seperti register tapi role `ADMIN`. Route tidak ada middleware → siapa saja bisa bikin admin.
> ⚠️ **Security issue.** Harus dihapus setelah admin pertama dibuat.

### `login(req, res)` — NIM + password
1. Lookup user by NIM.
2. Kalau user tidak ada → 401 + counter rate limit naik.
3. Kalau `is_google = true` → user ini tidak punya password lokal → 400.
4. `bcrypt.compare` password.
5. Sukses → reset rate limit counter. Generate access + refresh token. Set refresh ke cookie.

Rate limiter (`loginAttempts` Map) digerakkan oleh middleware di route file (lihat `auth.route.md`). Counter increment di controller karena cuma controller yang tahu sukses/gagalnya.

> ⚠️ Catatan rate limit: counter di **memory** per instance. Kalau backend di-scale horizontal (multi container), tiap instance punya counter sendiri → attacker bisa coba 10 attempt × N instance. Untuk Redis-backed rate limit, perlu refactor.

### `googleRedirect(req, res)` — kick off OAuth
Build URL ke Google OAuth & redirect.
- `prompt: "select_account"` — selalu munculin account picker (bukan auto-login dengan akun terakhir).
- `access_type: "offline"` — minta refresh token (walau di kode kita tidak benar-benar pakai Google refresh token; kita pakai JWT sendiri).

### `googleCallback(req, res)` — handler dari Google
1. Tukar `code` dengan access token Google.
2. Ambil `userinfo` Google (email, name, picture).
3. Cari user by email di DB.
   - Belum ada → bikin akun baru (`createGoogle`).
   - Ada tapi `is_google = false` → konflik (email sama tapi ini akun lokal). Redirect ke `/login?error=email_exists`.
4. Generate JWT access + refresh. Set refresh ke cookie. Redirect ke frontend `/auth/callback?token={access}`.

Frontend ambil token dari URL → simpan di memory/localStorage → request `/me` atau lanjut ke home.

> ⚠️ Catatan: token di URL query → bisa nyangkut di log nginx / browser history. Lebih aman pakai `postMessage` atau cookie sementara, tapi mungkin tidak worth complexity untuk MVP.

### `refresh(req, res)`
Baca cookie `refresh_token`, verify, issue access token baru. Tidak generate refresh token baru (rotation) — kalau cookie masih valid (≤ 7 hari), terus dipakai. Lebih sederhana, tapi kalau cookie pernah bocor, dia sah sampai 7 hari kemudian.

### `updateProfile(req, res)`
Update `name` / `password` user yang sedang login. Hash password di model (`UsersModel.update`). Return user baru.

### `logout(req, res)`
- Kalau request kirim `token` (FCM token spesifik device) → hapus 1 token saja. Pakai use case: user logout di 1 browser tanpa kehilangan push di HP-nya.
- Kalau tidak kirim → hapus **semua** FCM token user (logout total dari semua device).
- Clear cookie refresh.

### `registerFcmToken(req, res)`
Dipanggil frontend setelah dapat token dari Firebase Web SDK. `upsert` ke DB.

### `deleteFcmToken(req, res)`
Dipanggil frontend saat user matikan notifikasi (atau saat unsubscribe service worker).

## Dependensi
- Models: `UsersModel`, `FcmTokensModel`.
- Lib: `bcrypt`, `axios`, `pool` (untuk updateRole), `jwt` helpers, cookie helpers.
- Env: `GOOGLE_*`, `CLIENT_URL`.
- **Dipanggil oleh**: `routes/auth.route.ts`.

## Alur ringkas
```
register lokal:    POST /register → bcrypt → INSERT users
login lokal:       POST /login    → bcrypt.compare → JWT access + refresh cookie
OAuth Google:      GET  /google/redirect → Google → /google/callback → JWT → redirect FE
refresh:           POST /refresh  → verify cookie → JWT access baru
logout:            POST /logout   → clear cookie + delete FCM token
```

## Hal yang perlu diperhatikan
- **`registerAdmin` & `updateRole` tanpa auth** = lubang besar. Hapus / kunci sebelum production.
- `register` dan `registerAdmin` hampir copy-paste. Bisa di-refactor pakai param role.
- Tidak ada email verification / reset password flow. Kalau user lupa password, tidak ada self-service.
