# `backend/src/models/notifications.model.ts` — Akses tabel `notifications`

## Lokasi file asli
`backend/src/models/notifications.model.ts`

## Tujuan / peran file ini
Menyimpan notifikasi in-app (riwayat yang muncul di halaman `/notifications`). Note: ini terpisah dari **push notification** (FCM). Pola yang dipakai: tiap event penting kirim ke **dua channel** — DB (untuk timeline) + FCM (untuk real-time popup).

## Struktur data
```ts
interface Notification {
  id, user_id, report_id,
  title, body,
  is_read: boolean | null,
  sent_at, created_at, updated_at
}
```

## Method
- `findByUserId(userId, limit, offset)` — list notifikasi user (paginated, terbaru dulu).
- `findUnreadByUserId(userId)` — khusus yang belum dibaca.
- `getUnreadCount(userId)` — badge angka di sidebar/bottom nav (`COUNT(*)`).
- `findById(id)` — sebelum mark-as-read, controller verifikasi notif ini memang milik user yang request.
- `create({ user_id, report_id, title, body })` — dipanggil tiap kali laporan baru / status berubah / assignment ganti.
- `markAsRead(id)` — set `is_read = true`, update timestamp.
- `markAllAsRead(userId)` — bulk.
- `delete(id)` — hapus 1 notif.
- `deleteByReportId(reportId)` — saat laporan dihapus, notif-nya juga dibersihkan.

## Dependensi
- `../lib/db`
- **Dipakai oleh**: `notifications.controller.ts`, `reports.controller.ts`, `staff_assignments.controller.ts`.

## Hal yang perlu diperhatikan
- `is_read` boleh `null` (default NULL di DDL). Treat sebagai "belum dibaca" — bisa bikin bug "muncul terus di unread list". Untuk konsistensi sebaiknya default `false`.
- Tidak ada `category` (tipe notifikasi). Kalau mau filter notif "status update" vs "assignment", harus tambah kolom.
- `created_at` & `sent_at` keduanya ada. Saat ini sama persis, redundan.
