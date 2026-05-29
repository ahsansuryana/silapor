# FR-4: Buat Laporan Kerusakan

| Aspek | Detail |
|-------|--------|
| **ID** | FR-4 |
| **Nama** | Buat Laporan Kerusakan |
| **Aktor** | Mahasiswa |
| **Prioritas** | Tinggi |
| ** terkait** | UC-06 |
| **Dependensi** | FR-1, FR-12 (lokasi), FR-13 (kategori) |

## Deskripsi
Mahasiswa dapat membuat laporan kerusakan fasilitas kampus dengan memilih lokasi, kategori, dan mengupload foto.

## Input (multipart/form-data)
- `location_id` (uuid, required)
- `category_id` (uuid, required)
- `title` (string, required)
- `description` (string, optional)
- `priority` (enum: rendah/sedang/tinggi, default: rendah)
- `file` (image, optional, max 10MB)

## Proses
1. Validasi input wajib
2. Insert laporan ke tabel `reports` (status: menunggu)
3. Jika ada file: upload ke MinIO, simpan key di `report_images`
4. Auto-assign staff berdasarkan lokasi (FR-11)
5. Insert ke `report_status_history`
6. Kirim notifikasi ke staff yang di-assign (FR-14)
7. Return data laporan

## Output
- **201**: `{ id, reporter_id, location_id, category_id, title, description, status: "menunggu", priority, created_at }`
- **400**: `"Location, category, dan title wajib diisi"`

## Endpoint
`POST /api/reports`
