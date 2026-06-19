# `backend/src/models/report_status_history.model.ts` — Audit log status laporan

## Lokasi file asli
`backend/src/models/report_status_history.model.ts`

## Tujuan / peran file ini
Tiap kali status laporan berubah, dicatat di sini siapa (`change_by`), kapan, dari status apa ke apa, plus catatan. Berguna untuk timeline progress di UI dan jejak audit.

## Struktur data
```ts
interface ReportStatusHistory {
  id, report_id, change_by,
  old_status: ReportStatus | null,   // null = saat create laporan
  new_status: ReportStatus,
  notes: string | null,
  changed_at, created_at, updated_dt  // ⚠ typo: `updated_dt` (harusnya updated_at)
}
```

## Method
- `findByReportId(reportId)` — ambil semua history satu laporan (terbaru dulu).
- `findById(id)` — single (untuk endpoint detail history).
- `create({...})` — dipanggil dari `updateStatus` controller.
- `delete(id)` — jarang dipakai, tapi tersedia.

## Dependensi
- `../lib/db`
- **Dipakai oleh**: `report_history.controller.ts`, `reports.controller.ts`.

## Hal yang perlu diperhatikan
- Nama kolom `updated_dt` (bukan `updated_at`) — kelihatannya typo di schema. Konsisten saja dengan DDL, tapi jelek untuk konvensi.
- Tidak ada method update — sengaja, karena ini audit log: append-only.
