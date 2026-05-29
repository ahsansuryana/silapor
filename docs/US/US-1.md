# US-1: Registrasi Akun Mahasiswa

| Aspek | Detail |
|-------|--------|
| **ID** | US-1 |
| **Aktor** | Mahasiswa |
| **Prioritas** | Tinggi |
| **FR** | FR-1 |
| **UC** | UC-01 |

## Story
> Sebagai **Mahasiswa**, saya ingin **mendaftar akun dengan NIM** agar **bisa menggunakan sistem SILAPOR**.

## Acceptance Criteria

1. **Registrasi berhasil**
   - Input NIM, nama, password valid
   - Sistem menyimpan akun dengan role MAHASISWA
   - Muncul pesan "Registrasi berhasil"

2. **NIM sudah terdaftar**
   - Input NIM yang sudah ada
   - Sistem menolak dengan pesan "NIM sudah terdaftar"

3. **Field kosong**
   - Salah satu field tidak diisi
   - Sistem menolak dengan pesan validasi

4. **Password strength**
   - Password minimal 6 karakter
   - Sistem hash password sebelum disimpan (bcrypt)
