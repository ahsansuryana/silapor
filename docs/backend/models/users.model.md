# `backend/src/models/users.model.ts` — Akses tabel `users`

## Lokasi file asli
`backend/src/models/users.model.ts`

## Tujuan / peran file ini
Wrapper query untuk tabel `users`. Memuat operasi CRUD plus query khusus seperti "get staff beserta lokasinya" dan operasi khusus per-role (`createMahasiswa`, `getAllMahasiswa`, dst).

## Struktur data
```ts
type UserRole = "MAHASISWA" | "STAFF" | "ADMIN";

interface User {
  id: string;
  name: string | null;
  email: string | null;        // hanya untuk akun Google
  avatar_url: string | null;   // dari Google profile
  avatar_file_id: string | null; // (belum dipakai - placeholder)
  "NIM": string | null;        // catatan: kolom literal "NIM" pakai quote
  password: string | null;     // null kalau Google login
  role: UserRole;
  is_google: boolean;
  created_at: Date;
  updated_at: Date | null;
}
```
**Kenapa kolom `"NIM"` dalam tanda petik?** Karena di Postgres, identifier dengan huruf besar harus di-quote. Schema-nya menyimpan kolom `NIM` (huruf besar) — beda dari `nim` (huruf kecil). Akibatnya semua query harus pakai `"NIM"` dengan double quote.

## Method utama

### Lookup
- `findByEmail(email)` — untuk login Google
- `findByNim(nim)` — untuk login lokal (mahasiswa/staff/admin)
- `findById(id)` — untuk middleware / general lookup

### Create
- `createLocal({ nim, name, password, role })` — register manual dengan password (sudah ter-hash di controller)
- `createGoogle({ email, name, avatar_url })` — buat akun otomatis dari OAuth, password = null
- `createMahasiswa({...})` — varian khusus dengan hashing di dalam method (Note: inkonsistensi dengan `createLocal` yang minta hashed password — admin route `users.route.ts` pakai ini)

### Staff
- `getAllStaff()` — list semua user dengan role STAFF
- `getStaffWithLocations()` — staff + array lokasi yang di-handle (pakai `json_agg` + `FILTER (WHERE ...)` untuk handle staff yang belum di-assign lokasi)

### Update / delete
- `update(id, { name, password })` — dynamic SQL: cuma field yang ada yang diupdate, biar tidak overwrite null. Password di-hash di sini.
- `delete(id)` — hapus mapping di `user_staff_location` dulu, baru hapus user. Sebaiknya ada `ON DELETE CASCADE` di DB, tapi cara ini eksplisit.

### Mahasiswa-specific
`getAllMahasiswa` / `getMahasiswaById` / `createMahasiswa` / `updateMahasiswa` / `deleteMahasiswa` — versi dengan filter `role = 'MAHASISWA'` supaya admin tidak sengaja edit staff lewat endpoint user.

## Dependensi
- `../lib/db` (pool)
- `bcrypt` (di method yang hash password)
- **Dipakai oleh**: `auth.controller`, `users.route`, `staff.route`, `user_staff_location.controller`, dll.

## Hal yang perlu diperhatikan
- **Dynamic SQL di `update`/`updateMahasiswa`** pakai parameter binding (`$1`, `$2`), aman dari SQL injection.
- `createLocal` minta password **sudah ter-hash**, sedangkan `createMahasiswa` hash sendiri. Beda contract, gampang lupa. Hati-hati saat menambah method baru.
- Tidak ada validasi format NIM (panjang, hanya digit, dll) di sini — itu tugas controller, tapi controller-nya cuma cek "wajib diisi".
- Method `delete` tidak hapus FCM token, notif, atau report milik user. Bisa jadi orphan record. Cek constraint DB.
