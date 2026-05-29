# US-9: Update Status Laporan

| Aspek | Detail |
|-------|--------|
| **ID** | US-9 |
| **Aktor** | Staff, Admin |
| **Prioritas** | Tinggi |
| **FR** | FR-8, FR-9 |
| **UC** | UC-11 |

## Story
> Sebagai **Staff**, saya ingin **mengupdate status laporan dengan catatan** agar **mahasiswa tahu perkembangan penanganan**.

## Acceptance Criteria

1. **Update status sukses**
   - Pilih status baru (diterima/diproses/selesai/ditolak)
   - Tambah catatan (opsional)
   - Status berubah, history tercatat
   - Notifikasi terkirim ke reporter

2. **Transisi valid**
   - menunggu → diterima ✅
   - diterima → diproses ✅
   - diproses → selesai ✅
   - status apapun → ditolak ✅
   - selesai → diproses ❌ (tidak valid)

3. **History**
   - Setiap perubahan tercatat di riwayat
   - Bisa dilihat di detail laporan
