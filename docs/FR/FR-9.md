# FR-9: Riwayat Status Laporan

| Aspek | Detail |
|-------|--------|
| **ID** | FR-9 |
| **Nama** | Riwayat Status Laporan |
| **Aktor** | Mahasiswa, Staff, Admin |
| **Prioritas** | Sedang |
| ** terkait** | UC-14 |
| **Dependensi** | FR-8 |

## Deskripsi
Semua perubahan status laporan dicatat dan dapat dilihat oleh pengguna terkait.

## Riwayat Tersimpan
- `old_status` — Status sebelumnya
- `new_status` — Status baru
- `change_by` — User yang mengubah (name + role)
- `notes` — Catatan perubahan
- `changed_at` — Timestamp

## Endpoint
- `GET /api/reports/:id/history` — semua riwayat
- `GET /api/reports/:id/history/:historyId` — satu riwayat
