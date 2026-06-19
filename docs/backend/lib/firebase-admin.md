# `backend/src/lib/firebase-admin.ts` — Setup Firebase Admin SDK

## Lokasi file asli
`backend/src/lib/firebase-admin.ts`

## Tujuan / peran file ini
Inisialisasi Firebase Admin SDK supaya backend bisa kirim **push notification (FCM)** ke device user.

## Penjelasan per bagian

### `getServiceAccount()`
Dua sumber credential:
1. **File JSON** (path di env `FIREBASE_SERVICE_ACCOUNT_PATH`) — dipakai di production lewat Docker volume mount (`./secrets/service-account.json` → `/etc/secrets/service-account.json`).
2. **Env vars langsung** (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) — dipakai di dev. `\n` di private key di-escape jadi newline asli.

### Conditional init
```ts
const hasFirebaseCreds = !!(serviceAccount.privateKey && serviceAccount.clientEmail && serviceAccount.projectId);
if (hasFirebaseCreds && !admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
export const messaging = hasFirebaseCreds ? admin.messaging() : null;
```
**Defensive**: kalau credential tidak lengkap, `messaging` di-export sebagai `null`. Jadi fitur push notification cukup di-skip kalau env tidak lengkap, server tidak crash. Cek-nya di `lib/push-notification.ts` (`if (!messaging) return false`).

## Dependensi
- Library `firebase-admin`
- Env vars: `FIREBASE_SERVICE_ACCOUNT_PATH` atau (`FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`).
- **Dipakai oleh**: `lib/push-notification.ts`.

## Hal yang perlu diperhatikan
- `require(path)` (CommonJS) di TS strict bisa bikin warning. Diperlukan karena `import` dinamis tidak gampang untuk JSON di Node20.
- Service account file SANGAT sensitif — bocor = penyerang bisa kirim push notification atas nama project ini. File ini di-mount **read-only** di Docker (`:ro`).
- Tidak ada error message kalau init gagal — hanya silent `messaging = null`. Cek log saat startup kalau push tidak jalan.
