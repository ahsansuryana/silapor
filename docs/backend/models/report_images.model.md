# `backend/src/models/report_images.model.ts` — Akses tabel `report_images`

## Lokasi file asli
`backend/src/models/report_images.model.ts`

## Tujuan / peran file ini
CRUD untuk relasi laporan ↔ gambar di MinIO. Tabel ini cuma menyimpan **`minio_object_key`** (mis. `reports/abc.jpg`), bukan URL atau file biner.

## Struktur data
```ts
interface ReportImage {
  id: string;
  report_id: string;
  minio_object_key: string;
  created_at: Date;
  updated_at: Date | null;
}
```

## Method
- `findByReportId(reportId)` — list gambar untuk satu laporan, ordered by `created_at`.
- `findById(id)` — single lookup (untuk hapus / serve gambar).
- `create({ report_id, minio_object_key })` — insert setelah upload sukses ke MinIO.
- `delete(id)` — hapus row (file di MinIO dihapus terpisah di controller).
- `deleteByReportId(reportId)` — hapus semua gambar saat laporan dihapus.

## Dependensi
- `../lib/db`
- **Dipakai oleh**: `reports.controller.ts`, `report_images.controller.ts`.

## Hal yang perlu diperhatikan
- Tidak ada transaksi: kalau insert DB sukses tapi upload MinIO gagal (atau sebaliknya), bisa terjadi data inkonsisten. Saat ini controller pakai pola "MinIO dulu, lalu DB" supaya kalau MinIO gagal, DB tidak dapat row palsu — tapi sebaliknya (DB sukses, MinIO orphan) bisa terjadi.
- `delete` di model tidak hapus file MinIO. Itu tanggung jawab controller.
