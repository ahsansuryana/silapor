# FR-5: Upload Gambar Laporan

| Aspek | Detail |
|-------|--------|
| **ID** | FR-5 |
| **Nama** | Upload Gambar Laporan |
| **Aktor** | Mahasiswa |
| **Prioritas** | Tinggi |
| ** terkait** | UC-07 |
| **Dependensi** | FR-4, MinIO |

## Deskripsi
Mahasiswa dapat mengupload gambar kerusakan saat membuat laporan atau menambahkan gambar ke laporan yang sudah ada.

## Teknis
- **Storage**: MinIO (S3-compatible) — bucket: `silapor`
- **Path**: `reports/{reportId}/{uuid}-{filename}`
- **Access**: Presigned URL (expired) untuk viewing
- **Limit**: Maks 10MB per file, tipe image/*

## Endpoint
- `POST /api/reports/:id/images` (multipart/form-data)
- `GET /api/reports/:id/images`
- `DELETE /api/reports/:id/images/:imageId`
