# `backend/src/helper/token.helper.ts` — Helper set/clear refresh token cookie

## Lokasi file asli
`backend/src/helper/token.helper.ts`

## Tujuan / peran file ini
Dua helper kecil supaya cara set & clear cookie `refresh_token` konsisten di semua tempat (login, OAuth callback, logout).

## Penjelasan per bagian

```ts
export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  });
};
```
Setting cookie:
- **`httpOnly: true`** — JavaScript di browser tidak bisa baca cookie ini. Lindungi dari XSS curi token.
- **`secure: ... === "production"`** — di dev (http://localhost), cookie tetap bisa di-set walau bukan HTTPS. Di prod wajib HTTPS.
- **`sameSite: "strict"`** — cookie hanya dikirim untuk request same-site. Lindungi dari CSRF.
- **`maxAge: 7 hari`** — selaras dengan masa hidup refresh token JWT.

> ⚠️ Catatan: dengan `sameSite: strict`, kalau user klik link dari email/whatsapp menuju situs, browser tidak kirim cookie pada navigasi pertama. Login flow normal lewat XHR dari domain frontend tetap jalan karena sudah same-site setelah halaman ke-load. Tapi **OAuth Google redirect** dari `accounts.google.com` balik ke backend kemungkinan bermasalah — kalau ke depan ada issue cookie hilang setelah callback, longgarkan ke `lax`.

```ts
export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refresh_token");
};
```
Logout / token tidak valid: panggil ini.

## Dependensi
- `express` (Response type)
- **Dipakai oleh**: `controllers/auth.controller.ts` (login, googleCallback, logout).

## Hal yang perlu diperhatikan
- Saat `clearCookie`, options (domain, path) tidak diisi — kalau cookie aslinya di-set dengan path khusus, cookie tidak benar-benar terhapus. Saat ini default `/`, jadi aman.
- Tidak ada attribute `domain` — cookie cuma berlaku di domain backend (`backend-silapor.nuxantara.site`). Frontend di `silapor.nuxantara.site` tidak share cookie. Itu sebabnya frontend perlu hit endpoint `/refresh` lewat XHR (browser yang kirim cookie ke domain backend).
