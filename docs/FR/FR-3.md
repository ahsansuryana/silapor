# FR-3: Login NIM/Password

| Aspek | Detail |
|-------|--------|
| **ID** | FR-3 |
| **Nama** | Login NIM/Password |
| **Aktor** | Mahasiswa, Staff, Admin |
| **Prioritas** | Tinggi |
| ** terkait** | UC-02 |
| **Dependensi** | FR-1 |

## Deskripsi
Pengguna login menggunakan NIM dan password.

## Input
- `nim` (string, required)
- `password` (string, required)

## Proses
1. Validasi input
2. Cari user berdasarkan NIM
3. Verifikasi password dengan bcrypt
4. Generate accessToken (15 menit) + refreshToken (7 hari)
5. Set refreshToken sebagai httpOnly cookie
6. Return accessToken + data user

## Output
- **200**: `{ accessToken, user: { id, name, role } }`
- **401**: `"NIM atau password salah"`
- **400**: `"Akun ini terdaftar via Google"`

## Endpoint
`POST /api/auth/login`

## Token Flow
```
Access Token  → 15 menit  → dikirim di body response
Refresh Token → 7 hari    → httpOnly cookie
```
