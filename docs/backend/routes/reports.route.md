# `backend/src/routes/reports.route.ts` — Route laporan + upload + UUID validator

## Lokasi file asli
`backend/src/routes/reports.route.ts`

## Tujuan / peran file ini
Mount `/api/reports/*`. Tambah multer untuk upload gambar dan validator UUID untuk `:id`.

## Multer setup
```ts
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Hanya gambar yang diizinkan"));
  },
});
```
File di-buffer di memori (bukan disk) supaya bisa langsung di-stream ke MinIO tanpa I/O lokal. Limit 10MB cukup untuk foto HP biasa. Filter mime dasar.

## UUID validator
```ts
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validateId = (req, res, next) => {
  if (req.params.id && !UUID_REGEX.test(req.params.id)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }
  next();
};
```
Mencegah string sembarangan masuk ke `WHERE id = $1` (yang bakal bikin Postgres throw error "invalid input syntax for type uuid"). Lebih nice untuk return 400 daripada 500.

## Daftar route
| Method | Path | Middleware | Handler |
|---|---|---|---|
| GET | `/` | `authenticate, requireAdmin` | `getAll` |
| GET | `/my` | `authenticate` | `getMyReports` |
| GET | `/stats` | `authenticate, requireAdmin` | `getStats` |
| GET | `/status/:status` | `authenticate` | `getByStatus` |
| GET | `/priority/:priority` | `authenticate` | `getByPriority` |
| GET | `/:id` | `authenticate, validateId` | `getById` |
| POST | `/` | `authenticate, upload.single("file")` | `create` |
| PATCH | `/:id` | `authenticate, validateId` | `update` |
| PATCH | `/:id/status` | `authenticate, validateId` | `updateStatus` |
| DELETE | `/:id` | `authenticate, validateId` | `remove` |

Catat: route `/my`, `/stats`, `/status/:status`, `/priority/:priority` harus ditaruh **sebelum** `/:id` supaya Express tidak match `:id = "my"` dsb. Urutan di file ini sudah benar.

## Dependensi
- `multer`, controller `reports`, middleware auth.
- **Di-mount oleh**: `index.ts` di `/api/reports`.

## Hal yang perlu diperhatikan
- Filter mime cuma cek header — bisa dimanipulasi. Untuk aman, validasi magic bytes setelah upload (mis. pakai `file-type`).
- `validateId` tidak diterapkan ke route `/:id/status` di atas? **Ya, diterapkan** (`validateId` ada di route definition). OK.
- `update`, `updateStatus`, `remove` tidak cek owner. Lihat `reports.controller.md` untuk catatan.
