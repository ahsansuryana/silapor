# US-3: Login Google OAuth

| Aspek | Detail |
|-------|--------|
| **ID** | US-3 |
| **Aktor** | Mahasiswa, Staff, Admin |
| **Prioritas** | Tinggi |
| **FR** | FR-2 |
| **UC** | UC-03 |

## Story
> Sebagai **pengguna**, saya ingin **login menggunakan akun Google** agar **tidak perlu menghafal password tambahan**.

## Acceptance Criteria

1. **Login Google berhasil**
   - Klik "Login dengan Google"
   - Redirect ke halaman Google
   - Pilih akun Google
   - Redirect balik ke aplikasi (sudah login)

2. **Akun Google baru**
   - Google email belum terdaftar
   - Sistem buat akun baru dengan data dari Google

3. **Akun Google sudah terdaftar**
   - Google email sudah terdaftar sebelumnya
   - Sistem langsung login
