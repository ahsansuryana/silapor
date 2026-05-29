# US-4: Buat Laporan Kerusakan

| Aspek | Detail |
|-------|--------|
| **ID** | US-4 |
| **Aktor** | Mahasiswa |
| **Prioritas** | Tinggi |
| **FR** | FR-4, FR-12, FR-13 |
| **UC** | UC-06 |

## Story
> Sebagai **Mahasiswa**, saya ingin **melaporkan kerusakan fasilitas dengan memilih lokasi dan kategori** agar **staff yang tepat bisa segera menangani**.

## Acceptance Criteria

1. **Buat laporan sukses**
   - Pilih lokasi dari hierarki (tree)
   - Pilih kategori kerusakan
   - Isi judul & deskripsi
   - Submit → laporan tersimpan (status: menunggu)
   - Staff otomatis di-assign

2. **Upload foto**
   - Bisa upload foto saat buat laporan
   - Foto muncul di detail laporan

3. **Validasi field wajib**
   - Lokasi, kategori, judul wajib diisi
   - Jika kosong → error validasi

4. **Prioritas**
   - Default: rendah
   - Bisa pilih: rendah, sedang, tinggi

5. **Notifikasi**
   - Staff yang di-assign mendapat notifikasi
