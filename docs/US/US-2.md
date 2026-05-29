# US-2: Login NIM/Password

| Aspek | Detail |
|-------|--------|
| **ID** | US-2 |
| **Aktor** | Mahasiswa, Staff, Admin |
| **Prioritas** | Tinggi |
| **FR** | FR-3 |
| **UC** | UC-02 |

## Story
> Sebagai **pengguna**, saya ingin **login dengan NIM dan password** agar **bisa mengakses fitur sesuai role saya**.

## Acceptance Criteria

1. **Login berhasil**
   - Input NIM & password benar
   - Mendapatkan accessToken + data user
   - Redirect ke halaman sesuai role

2. **Login gagal (salah password)**
   - Input password salah
   - Pesan error "NIM atau password salah"

3. **Login gagal (NIM tidak terdaftar)**
   - Input NIM tidak dikenal
   - Pesan error "NIM atau password salah"

4. **Akun Google**
   - User yang daftar via Google login pakai NIM/password
   - Pesan "Akun ini terdaftar via Google"

5. **Session**
   - Access token expired dalam 15 menit
   - Refresh token otomatis via httpOnly cookie
