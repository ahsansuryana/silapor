# `backend/src/controllers/report_history.controller.ts` — Riwayat status laporan

## Lokasi file asli
`backend/src/controllers/report_history.controller.ts`

## Tujuan / peran file ini
Read-only endpoint untuk timeline status laporan (yang sudah ditulis oleh `updateStatus` di reports controller).

## Penjelasan per handler
- **`getByReportId(id)`**: list semua history untuk satu laporan, terbaru dulu.
- **`getById(id, historyId)`**: detail single history. Cek `history.report_id === id` supaya tidak bisa baca history laporan lain via URL param swap.

## Dependensi
- `ReportStatusHistoryModel`
- **Dipanggil oleh**: `routes/report_history.route.ts`.

## Hal yang perlu diperhatikan
- Tidak cek authorization "user X boleh lihat history laporan Y?". Saat ini siapa saja yang login bisa lihat history laporan siapa saja kalau tahu ID-nya. Untuk audit lebih ketat, perlu cek role/owner.
