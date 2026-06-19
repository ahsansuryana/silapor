# `backend/src/models/categories.model.ts` — Akses tabel `categories`

## Lokasi file asli
`backend/src/models/categories.model.ts`

## Tujuan / peran file ini
CRUD sederhana untuk tabel kategori laporan (mis. "Fasilitas Rusak", "Kebersihan", dll).

## Struktur data
```ts
type Category = {
  id: string;
  name: string;
  short_description: string | null;
  created_at: Date;
  updated_at: Date | null;
};
```

## Method
- `findAll()` — list semua, ordered by name (alfabetis di dropdown).
- `findById(id)` / `findByName(name)` — lookup.
- `create({ name, short_description })`.
- `update(id, { name, short_description })` — pakai `COALESCE(..., name)` supaya field yang tidak dikirim tidak overwrite dengan NULL.
- `delete(id)` — return row yang dihapus (untuk konfirmasi 404 vs 200).

## Dependensi
- `../lib/db`
- **Dipakai oleh**: `controllers/categories.controller.ts`.

## Hal yang perlu diperhatikan
- Tidak ada constraint di SQL untuk mencegah delete kategori yang masih dipakai laporan. Kalau dihapus, FK `reports.category_id` bisa pointing ke kategori yang sudah tidak ada (kecuali ada `ON DELETE CASCADE/SET NULL` di DDL — cek `database/init.sql`).
- Tidak ada paginasi — kategori diasumsikan jumlahnya kecil.
