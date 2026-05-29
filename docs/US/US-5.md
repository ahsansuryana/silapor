# US-5: Upload Foto Kerusakan

| Aspek | Detail |
|-------|--------|
| **ID** | US-5 |
| **Aktor** | Mahasiswa |
| **Prioritas** | Tinggi |
| **FR** | FR-5 |
| **UC** | UC-07 |

## Story
> Sebagai **Mahasiswa**, saya ingin **mengupload foto kerusakan** agar **staff bisa melihat kondisi langsung tanpa harus datang ke lokasi**.

## Acceptance Criteria

1. **Upload sukses**
   - Pilih file gambar (< 10MB)
   - Foto tersimpan di MinIO
   - Foto tampil di detail laporan

2. **File terlalu besar**
   - Upload file > 10MB
   - Sistem tolak dengan pesan error

3. **Format tidak didukung**
   - Upload file non-gambar
   - Sistem tolak

4. **Multiple images**
   - Bisa upload lebih dari 1 foto per laporan
