# FR-2: Login Google OAuth

| Aspek | Detail |
|-------|--------|
| **ID** | FR-2 |
| **Nama** | Login Google OAuth |
| **Aktor** | Mahasiswa, Staff, Admin |
| **Prioritas** | Tinggi |
| ** terkait** | UC-03 |
| **Dependensi** | - |

## Deskripsi
Pengguna dapat login menggunakan akun Google melalui OAuth 2.0.

## Alur
1. Pengguna klik "Login dengan Google" di frontend
2. Redirect ke `GET /api/auth/google/redirect`
3. Backend redirect ke Google OAuth consent screen
4. User login di Google, Google callback ke backend
5. Backend verifikasi token Google, cari/create user berdasarkan email
6. Backend generate JWT, redirect ke frontend dengan token
7. Frontend menyimpan token dan redirect ke halaman utama

## Endpoint
- `GET /api/auth/google/redirect` — redirect ke Google
- `GET /api/auth/google/callback` — callback dari Google

## Output
- **302**: Redirect ke `{CLIENT_URL}/auth/callback?token={accessToken}`
