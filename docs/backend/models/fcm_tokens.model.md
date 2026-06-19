# `backend/src/models/fcm_tokens.model.ts` — Akses tabel `fcm_tokens`

## Lokasi file asli
`backend/src/models/fcm_tokens.model.ts`

## Tujuan / peran file ini
Simpan token FCM (Firebase Cloud Messaging) per device per user. Satu user bisa punya banyak token (HP, browser, dst). Tabel ini di-query oleh `sendPush` untuk tahu device mana saja yang dapat notif.

## Struktur data
```ts
interface FcmToken {
  id, user_id, token,
  device_type: string,    // 'web' | 'android' | 'ios' (default 'web')
  device_name: string | null,
  created_at, updated_at
}
```

## Method
- `findByUserId(userId)` — semua token user.
- `findByToken(token)` — kalau perlu lookup terbalik.
- `upsert({...})` — **idempotent insert**. Pakai `ON CONFLICT (token) DO UPDATE`. Token unik di seluruh sistem — kalau token yang sama re-register (mis. user lain login di device yang sama), `user_id` di-update ke user baru. Pertahanan terhadap "satu device dengan 2 akun".
- `deleteByToken(token)` — auto-cleanup oleh `sendPush` saat token mati.
- `deleteByUserAndToken(userId, token)` — logout satu device.
- `deleteByUserId(userId)` — logout semua device.

## Dependensi
- `../lib/db`
- **Dipakai oleh**: `auth.controller.ts` (registerFcmToken / logout), `lib/push-notification.ts`.

## Hal yang perlu diperhatikan
- `token` harus punya UNIQUE constraint di DB supaya `ON CONFLICT (token)` jalan. Cek `init.sql`.
- Tidak ada TTL / pembersihan token lama. Mengandalkan `sendPush` untuk cleanup token mati lewat error code FCM.
