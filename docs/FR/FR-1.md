# FR-1: Registrasi Akun

| Aspek | Detail |
|-------|--------|
| **ID** | FR-1 |
| **Nama** | Registrasi Akun |
| **Aktor** | Mahasiswa |
| **Prioritas** | Tinggi |
| ** terkait** | UC-01 |
| **Dependensi** | - |

## Deskripsi
Mahasiswa dapat mendaftar akun baru menggunakan NIM (Nomor Induk Mahasiswa) dan password.

## Input
- `nim` (string, required) — Nomor Induk Mahasiswa
- `name` (string, required) — Nama lengkap
- `password` (string, required) — Password (akan di-hash bcrypt)

## Proses
1. Validasi input (semua field wajib)
2. Cek duplikasi NIM
3. Hash password dengan bcrypt
4. Simpan user dengan role `MAHASISWA`
5. Return response sukses

## Output
- **201**: `{ message: "Registrasi berhasil", user: { id, name } }`
- **400**: `"NIM, nama, dan password wajib diisi"`
- **409**: `"NIM sudah terdaftar"`

## Endpoint
`POST /api/auth/register`
