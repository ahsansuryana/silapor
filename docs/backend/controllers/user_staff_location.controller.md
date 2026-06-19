# `backend/src/controllers/user_staff_location.controller.ts` — Mapping staff ↔ lokasi

## Lokasi file asli
`backend/src/controllers/user_staff_location.controller.ts`

## Tujuan / peran file ini
CRUD untuk pivot `user_staff_location`. Plus endpoint "my locations" (staff yang sedang login) dan "siapa staff untuk lokasi ini".

## Penjelasan per handler
- **`getByStaffId(staffId)`** — admin lihat lokasi yang ditangani staff X.
- **`getMyLocations()`** — staff sendiri lihat lokasinya. Pakai `req.user.id`.
- **`assign({ staff_id, location_id })`** — validasi user ada & role STAFF (good!) → insert. 409 kalau mapping sudah ada.
- **`remove({ staffId, locationId })`** — un-assign.
- **`getStaffForLocation(locationId)`** — utility: siapa yang handle lokasi ini? (Pakai `getStaffForAutoAssign` = LIMIT 1.)

## Dependensi
- `UserStaffLocationModel`, `UsersModel`
- **Dipanggil oleh**: `routes/staff_locations.route.ts`.

## Hal yang perlu diperhatikan
- Endpoint `assign` & `remove` cuma `authenticate`, tidak `requireAdmin`. Staff bisa assign dirinya ke lokasi mana saja (atau hapus assignment orang lain). **Audit.**
- `getStaffForLocation` cuma return 1 staff. Untuk list semua staff di lokasi, harus pakai `findByLocationId` di model — tapi tidak ada endpoint-nya.
