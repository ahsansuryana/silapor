# FR-7: Detail Laporan

| Aspek | Detail |
|-------|--------|
| **ID** | FR-7 |
| **Nama** | Detail Laporan |
| **Aktor** | Mahasiswa, Staff, Admin |
| **Prioritas** | Tinggi |
| ** terkait** | UC-10 |
| **Dependensi** | FR-4 |

## Deskripsi
Semua pengguna dapat melihat detail lengkap sebuah laporan termasuk informasi, gambar, riwayat status, komentar, dan assignment.

## Informasi yang Ditampilkan
- Data laporan (title, description, status, priority)
- Nama pelapor (reporter)
- Lokasi & kategori
- Gambar (presigned URLs dari MinIO)
- Riwayat status (FR-9)
- Komentar (FR-10)
- Assignment staff aktif

## Endpoint
`GET /api/reports/:id`

## Output
```json
{
  "id": "uuid",
  "title": "AC Rusak",
  "description": "AC tidak dingin",
  "status": "menunggu",
  "priority": "rendah",
  "reporter_name": "John Doe",
  "location_name": "Gedung A",
  "category_name": "AC",
  "images": [{ "id": "uuid", "url": "presigned-url" }]
}
```
