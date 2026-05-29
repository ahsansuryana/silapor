# FR-8: Update Status Laporan

| Aspek | Detail |
|-------|--------|
| **ID** | FR-8 |
| **Nama** | Update Status Laporan |
| **Aktor** | Staff, Admin |
| **Prioritas** | Tinggi |
| ** terkait** | UC-11 |
| **Dependensi** | FR-4 |

## Deskripsi
Staff dan Admin dapat mengubah status laporan untuk memproses penanganan kerusakan.

## Status yang Tersedia
| Status | Deskripsi |
|--------|-----------|
| `menunggu` | Baru dibuat, menunggu diproses |
| `diterima` | Diterima oleh staff |
| `diproses` | Sedang dalam penanganan |
| `selesai` | Selesai diperbaiki |
| `ditolak` | Ditolak (dengan alasan) |

## Transisi Status
```
menunggu → diterima → diproses → selesai
                                        → ditolak (dari status manapun)
```

## Input
- `status` (enum, required)
- `notes` (string, optional) — Catatan perubahan

## Proses
1. Validasi status transisi
2. Update status di tabel `reports`
3. Insert ke `report_status_history` (old_status, new_status, change_by, notes)
4. Kirim notifikasi ke reporter (FR-14)
5. Return sukses

## Endpoint
`PATCH /api/reports/:id/status`
