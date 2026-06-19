# `backend/src/routes/staff_locations.route.ts` — Route mapping staff↔lokasi

## Lokasi file asli
`backend/src/routes/staff_locations.route.ts`

## Tujuan / peran file ini
Mount handler `user_staff_location.controller` di `/api/staff-locations/*`. Endpoint ini dipakai admin untuk atur staff mana yang menangani lokasi mana, juga oleh staff untuk lihat lokasinya sendiri.

## Daftar route
| Method | Path | Middleware | Handler |
|---|---|---|---|
| GET | `/my` | `authenticate` | `getMyLocations` |
| GET | `/staff/:staffId` | `authenticate` | `getByStaffId` |
| GET | `/location/:locationId/staff` | `authenticate` | `getStaffForLocation` |
| POST | `/` | `authenticate` | `assign` |
| DELETE | `/:staffId/:locationId` | `authenticate` | `remove` |

## Dependensi
- `../controllers/user_staff_location.controller`
- **Di-mount oleh**: `index.ts` di `/api/staff-locations`.

## Hal yang perlu diperhatikan
- ⚠ **Tidak ada `requireAdmin`** di `POST /` dan `DELETE /:staffId/:locationId`. Berarti staff sendiri bisa assign/un-assign mapping siapa pun. Audit.
- Path `/my` ditaruh sebelum dynamic param `:staffId` — tidak ada konflik karena tidak ada wildcard `:something` di root, jadi aman.
