# `backend/src/lib/push-notification.ts` — Kirim push notification ke device

## Lokasi file asli
`backend/src/lib/push-notification.ts`

## Tujuan / peran file ini
Satu fungsi `sendPush(userId, title, body, url)` untuk kirim FCM push ke **semua device** milik user, plus auto-cleanup token yang sudah tidak valid.

## Penjelasan per bagian

```ts
if (!messaging) return false;
```
Skip kalau Firebase tidak ke-init (lihat `firebase-admin.md`).

```ts
const tokens = await FcmTokensModel.findByUserId(userId);
if (!tokens.length) return false;
```
Satu user bisa punya banyak device (web, mobile, dst), masing-masing punya FCM token sendiri. Diambil semua.

```ts
const messages = tokens.map((t) => ({
  token: t.token,
  notification: { title, body },
  data: { url },
  webpush: { fcmOptions: { link: url } as any },
}));
const responses = await messaging.sendEach(messages);
```
`sendEach` kirim batch dalam 1 panggilan. `webpush.fcmOptions.link` adalah URL yang dibuka kalau notifikasi diklik (di browser). `data.url` adalah backup untuk service worker custom.

### Auto-cleanup token mati
```ts
for (let i = 0; i < responses.responses.length; i++) {
  const resp = responses.responses[i];
  if (!resp.success) {
    const errCode = resp.error?.code;
    if (
      errCode === 'messaging/invalid-registration-token' ||
      errCode === 'messaging/registration-token-not-registered'
    ) {
      await FcmTokensModel.deleteByToken(tokens[i].token);
    }
  }
}
```
Kalau FCM bilang "token-mu basi" (user uninstall app / clear cookie), token-nya dihapus dari DB supaya tidak terus-terusan retry. Error lain (network, dll) dibiarkan.

## Dependensi
- `./firebase-admin` (`messaging`)
- `../models/fcm_tokens.model`
- **Dipakai oleh**: `controllers/reports.controller.ts`, `controllers/staff_assignments.controller.ts`.

## Alur push
```
status laporan berubah / assignment baru
  → NotificationsModel.create(...)            // simpan ke DB (untuk halaman /notifications)
  → sendPush(userId, title, body, url)        // push real-time ke device
       → FcmTokensModel.findByUserId
       → messaging.sendEach
       → cleanup token mati
```

## Hal yang perlu diperhatikan
- `sendPush` tidak throw error walaupun gagal. Return value `false` jarang dicek oleh caller.
- Tidak ada rate limiting — kalau status laporan berubah berkali-kali cepat, user dapat banyak notif.
- Title & body hardcoded di controller. Belum ada i18n.
