-- ─────────────────────────────────────────
-- SILAPOR - Database Init (PostgreSQL)
-- ─────────────────────────────────────────

-- Users (pelapor & admin)
CREATE TABLE users (
  id           SERIAL PRIMARY KEY,
  nama         VARCHAR(100) NOT NULL,
  email        VARCHAR(100) UNIQUE NOT NULL,
  password     VARCHAR(255) NOT NULL,
  role         VARCHAR(30) NOT NULL DEFAULT 'pelapor'
                 CHECK (role IN ('pelapor','admin_prodi','admin_fakultas','admin_universitas','super_admin')),
  unit         VARCHAR(100),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Lokasi (dipetakan ke admin penanggung jawab)
CREATE TABLE lokasi (
  id           SERIAL PRIMARY KEY,
  nama         VARCHAR(100) NOT NULL,
  gedung       VARCHAR(100),
  fakultas     VARCHAR(100),
  level        VARCHAR(20) NOT NULL CHECK (level IN ('prodi','fakultas','universitas')),
  assigned_to  INT REFERENCES users(id)
);

-- Laporan kerusakan
CREATE TABLE laporan (
  id           SERIAL PRIMARY KEY,
  nomor_tiket  VARCHAR(20) UNIQUE NOT NULL,
  pelapor_id   INT NOT NULL REFERENCES users(id),
  lokasi_id    INT NOT NULL REFERENCES lokasi(id),
  jenis        VARCHAR(100) NOT NULL,
  deskripsi    TEXT,
  prioritas    VARCHAR(10) DEFAULT 'sedang' CHECK (prioritas IN ('ringan','sedang','berat')),
  foto_url     VARCHAR(500),
  status       VARCHAR(20) DEFAULT 'menunggu'
                 CHECK (status IN ('menunggu','diproses','selesai','ditolak')),
  assigned_to  INT REFERENCES users(id),
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER laporan_updated_at
  BEFORE UPDATE ON laporan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Riwayat perjalanan tiket (jejak audit)
CREATE TABLE riwayat_tiket (
  id           SERIAL PRIMARY KEY,
  laporan_id   INT NOT NULL REFERENCES laporan(id),
  dari_admin   INT REFERENCES users(id),
  ke_admin     INT REFERENCES users(id),
  status_lama  VARCHAR(50),
  status_baru  VARCHAR(50),
  catatan      TEXT,
  waktu        TIMESTAMP DEFAULT NOW()
);

-- FCM Tokens (untuk push notification)
CREATE TABLE fcm_tokens (
  id           SERIAL PRIMARY KEY,
  user_id      INT UNIQUE NOT NULL REFERENCES users(id),
  token        TEXT NOT NULL,
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────
INSERT INTO users (nama, email, password, role) VALUES
('Super Admin', 'admin@silapor.ac.id', 'GANTI_DENGAN_BCRYPT_HASH', 'super_admin');