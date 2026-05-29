# FR-6: Lihat Laporan Saya

| Aspek | Detail |
|-------|--------|
| **ID** | FR-6 |
| **Nama** | Lihat Laporan Saya |
| **Aktor** | Mahasiswa |
| **Prioritas** | Tinggi |
| ** terkait** | UC-08 |
| **Dependensi** | FR-4 |

## Deskripsi
Mahasiswa dapat melihat daftar laporan yang pernah dibuat, dengan filter status dan prioritas.

## Fitur
- Daftar laporan milik user yang login (reporter)
- Pagination (limit/offset)
- Filter by status (`menunggu`, `diterima`, `diproses`, `selesai`, `ditolak`)
- Filter by priority (`rendah`, `sedang`, `tinggi`)
- Menampilkan title, status, priority, location, category, created_at

## Endpoint
- `GET /api/reports/my?limit=50&offset=0`
- `GET /api/reports/my/status/:status`
- `GET /api/reports/my/priority/:priority`
