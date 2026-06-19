# `backend/src/controllers/categories.controller.ts` — CRUD kategori

## Lokasi file asli
`backend/src/controllers/categories.controller.ts`

## Tujuan / peran file ini
Tipis: tinggal panggil `CategoriesModel`. CRUD kategori laporan.

## Penjelasan per handler
- **`getAll`**: list semua. Public (route tanpa auth).
- **`getById`**: single. 404 kalau tidak ada. Public.
- **`create`**: validasi `name` wajib, cek duplikasi (409 kalau sudah ada), insert. Auth required tapi tidak dilindungi `requireAdmin` di route — **siapa saja yang login bisa bikin kategori**.
- **`update`**: COALESCE-style update. Tidak cek duplikasi nama (bisa berakhir dengan dua kategori bernama sama).
- **`remove`**: hapus.

## Dependensi
- `CategoriesModel`
- **Dipanggil oleh**: `routes/categories.route.ts`.

## Hal yang perlu diperhatikan
- Route create/update/delete cuma butuh `authenticate`, bukan `requireAdmin`. Mahasiswa biasa bisa hapus kategori. **Audit ulang**.
- Tidak ada cek "kategori dipakai laporan?" sebelum delete.
