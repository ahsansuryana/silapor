-- ─────────────────────────────────────────
-- SILAPOR - Database Schema + Seed Data
-- ─────────────────────────────────────────

-- ENUMs
CREATE TYPE public.location_type AS ENUM ('UNIVERSITAS','FAKULTAS','JURUSAN','RUANGAN','AREA');
CREATE TYPE public.role_type AS ENUM ('MAHASISWA','STAFF','ADMIN');
CREATE TYPE public.report_status AS ENUM ('menunggu','diterima','diproses','selesai','ditolak');
CREATE TYPE public.report_priority AS ENUM ('rendah','sedang','tinggi');

-- users
CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name character varying(255),
    avatar_url character varying(255),
    avatar_file_id character varying(255),
    "NIM" character varying(255) UNIQUE,
    password character varying(255),
    email character varying(255) UNIQUE,
    role public.role_type DEFAULT 'MAHASISWA',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz,
    is_google boolean DEFAULT false NOT NULL
);

-- locations (self-referencing hierarchy)
CREATE TABLE public.locations (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name character varying(255) NOT NULL,
    type public.location_type NOT NULL,
    parent_id uuid REFERENCES public.locations(id),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now()
);

-- user_staff_location
CREATE TABLE public.user_staff_location (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    staff_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (staff_id, location_id)
);

-- categories
CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name character varying(255) NOT NULL,
    short_description text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz
);

-- Seed data: categories
INSERT INTO public.categories (id, name, short_description, created_at) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'Infrastruktur', 'Kerusakan gedung, jalan, jembatan, dan fasilitas fisik lainnya', now()),
('a1b2c3d4-0002-4000-8000-000000000002', 'Kebersihan', 'Sampah, sanitasi, dan kebersihan lingkungan', now()),
('a1b2c3d4-0003-4000-8000-000000000003', 'Keamanan', 'Gangguan keamanan, pencahayaan, dan pengawasan', now()),
('a1b2c3d4-0004-4000-8000-000000000004', 'Fasilitas', 'Kerusakan peralatan, AC, listrik, air, dan jaringan', now()),
('a1b2c3d4-0005-4000-8000-000000000005', 'Lainnya', 'Laporan yang tidak termasuk kategori di atas', now());

-- reports
CREATE TABLE public.reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    reporter_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    title character varying(255) NOT NULL,
    description text,
    status public.report_status DEFAULT 'menunggu' NOT NULL,
    priority public.report_priority DEFAULT 'rendah' NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz
);

-- report_images
CREATE TABLE public.report_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    report_id uuid NOT NULL REFERENCES public.reports(id),
    minio_object_key character varying(255) NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz
);

-- staff_report_assigments
CREATE TABLE public.staff_report_assigments (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    report_id uuid NOT NULL REFERENCES public.reports(id),
    assigned_to uuid NOT NULL REFERENCES public.users(id),
    assigned_by uuid REFERENCES public.users(id),
    is_active boolean DEFAULT true NOT NULL,
    is_auto_assign boolean DEFAULT false NOT NULL,
    notes text DEFAULT '' NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz
);

-- report_status_history
CREATE TABLE public.report_status_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    report_id uuid NOT NULL REFERENCES public.reports(id),
    change_by uuid NOT NULL REFERENCES public.users(id),
    old_status public.report_status NOT NULL,
    new_status public.report_status NOT NULL,
    notes text,
    changed_at timestamptz DEFAULT now() NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_dt timestamptz
);

-- report_comments
CREATE TABLE public.report_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    report_id uuid NOT NULL REFERENCES public.reports(id),
    user_id uuid NOT NULL REFERENCES public.users(id),
    message text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- notifications
CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    report_id uuid NOT NULL REFERENCES public.reports(id),
    title character varying(255),
    body text,
    is_read boolean DEFAULT false,
    sent_at timestamptz DEFAULT now() NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz
);

-- fcm_tokens (for push notifications)
CREATE TABLE public.fcm_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token text NOT NULL UNIQUE,
    device_type varchar(50) DEFAULT 'web',
    device_name varchar(255),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────

-- Locations: universitas + fakultas
INSERT INTO public.locations (id, name, type, parent_id, created_at, updated_at) VALUES
('1061b345-33c0-461a-b6c7-b995440b6d29', 'UIN SGD Kampus 1', 'UNIVERSITAS', NULL, now(), now()),
('d9c17ff0-8f43-460e-903c-006e1154d54a', 'Fakultas Sains dan Teknologi', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('a34cdced-df20-4887-aeae-589e5029944d', 'Fakultas Adab dan Humaniora', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('43a03e07-e0d9-4cef-96c3-6700c130a7cb', 'Fakultas Ilmu Sosial dan Ilmu Politik', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('d1395635-434d-4623-afcb-c357d7d9c0ad', 'Fakultas Dakwah Dan Komunikasi', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('a8573e9f-8d2c-4bcd-9e6d-ed28fed9474a', 'Fakultas Ushuluddin', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('7494b96b-0b16-4409-9e75-2f401ce5b611', 'Fakultas Psikologi', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('4f500cd0-8fc1-4464-8fe6-173c9ae8bbb7', 'Fakultas Syariah dan Hukum', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now());

-- Locations: sub-areas di bawah Fakultas Sains dan Teknologi
INSERT INTO public.locations (id, name, type, parent_id, created_at, updated_at) VALUES
('7287f3a4-a06c-49c9-a899-dbe81cc4b8a8', 'Kelas Lantai 1', 'AREA', 'd9c17ff0-8f43-460e-903c-006e1154d54a', now(), now()),
('a052cd67-dc00-4446-a042-fa71834cd64d', 'Kelas Lantai 2', 'AREA', 'd9c17ff0-8f43-460e-903c-006e1154d54a', now(), now()),
('e0940e70-bcba-4470-a47e-99a8b1a0fa77', 'Kelas Lantai 3', 'AREA', 'd9c17ff0-8f43-460e-903c-006e1154d54a', now(), now()),
('aa9cfb7f-22dc-432d-b412-aa61bd4f93de', 'Kelas Lantai 4', 'AREA', 'd9c17ff0-8f43-460e-903c-006e1154d54a', now(), now()),
('6fa29bdb-fd1b-49c6-9812-6eb0d71dfaf8', 'Perpustakaan Jurusan', 'RUANGAN', 'd9c17ff0-8f43-460e-903c-006e1154d54a', now(), now()),
('037e69c6-6874-4835-8e4f-04c443339179', 'Toilet', 'RUANGAN', 'd9c17ff0-8f43-460e-903c-006e1154d54a', now(), now()),
('57ad1ae8-1338-4580-934a-dcea1aa77fac', 'Lift', 'RUANGAN', 'd9c17ff0-8f43-460e-903c-006e1154d54a', now(), now()),
('1ce14468-3c53-4ea4-aae2-ae9380099a42', 'Loby Utama', 'AREA', 'd9c17ff0-8f43-460e-903c-006e1154d54a', now(), now());

-- Locations: ruangan di bawah Kelas Lantai 4
INSERT INTO public.locations (id, name, type, parent_id, created_at, updated_at) VALUES
('e2dfdb3d-4e4f-433b-9454-52cd13335f56', 'R 401', 'RUANGAN', 'aa9cfb7f-22dc-432d-b412-aa61bd4f93de', now(), now()),
('7e05bacb-978a-450b-96f9-03d73f0c2605', 'R 411', 'RUANGAN', 'aa9cfb7f-22dc-432d-b412-aa61bd4f93de', now(), now()),
('1ea6a128-e5fd-4e2d-8284-22577e047db7', 'R 412', 'RUANGAN', 'aa9cfb7f-22dc-432d-b412-aa61bd4f93de', now(), now()),
('865b46e0-3f4d-4a2a-a5ed-167dd5d9d1b5', 'R 410', 'RUANGAN', 'aa9cfb7f-22dc-432d-b412-aa61bd4f93de', now(), now()),
('724354f1-b137-4ec0-b7b1-f68c4c01c196', 'R 409', 'RUANGAN', 'aa9cfb7f-22dc-432d-b412-aa61bd4f93de', now(), now()),
('96c0da8a-e2ee-4ac4-9c51-2f649b17f0cb', 'Lab AI 1', 'RUANGAN', 'aa9cfb7f-22dc-432d-b412-aa61bd4f93de', now(), now()),
('20701831-0a87-4a44-8087-2e0fcaa85ed7', 'Lab AI 2', 'RUANGAN', 'aa9cfb7f-22dc-432d-b412-aa61bd4f93de', now(), now()),
('f4c8201f-0257-4ba3-801b-125630bbd215', 'Lab DC 2', 'RUANGAN', 'aa9cfb7f-22dc-432d-b412-aa61bd4f93de', now(), now()),
('8c85537d-f2dc-4881-9da5-e45740c698fc', 'Lab DC 1', 'RUANGAN', 'aa9cfb7f-22dc-432d-b412-aa61bd4f93de', now(), now());

-- Users: admin + staff
INSERT INTO public.users (id, name, "NIM", password, role, created_at) VALUES
('b83e1f32-2a1d-4696-b14d-bff26cf461e6', 'Admin', 'admin', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'ADMIN', now()),
('abae62ef-929e-4e43-8ecc-9f6755363cc2', 'Staff Saintek', 'staff-saintek', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('0fd4a5d8-2668-4b9f-8f8f-ca0fa636d9b9', 'Staff Adhum', 'staff-adhum', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('93f6ba1c-8af3-4ea2-90a3-e71b11719dcc', 'Staff Ushuluddin', 'staff-ushuluddin', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('1314ffe0-f3c2-4a1c-9e40-b581f1feeb2f', 'Staff Dakwah', 'staff-dakwah', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('08b12ff3-67a7-45fc-a6d1-b88baf87b988', 'Staff Psikologi', 'staff-psikologi', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('807114c5-08e2-4148-ba8d-2b49254f6ff6', 'Staff Hukum', 'staff-hukum', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('9e92c013-fdc3-46b0-aebb-84f4b084997d', 'Staff Sospol', 'STAFF-SOSPOL', '$2b$10$3pi3HO/iTg4JT1cOJ5P8q.FxG4oCz7i3tOpePDsWFR/MhQM.TX1rC', 'STAFF', now()),
('610e6012-f3d4-4c5a-8fc6-b124c6893b68', 'staff informatika', 'staff-informatika', '$2b$10$WUowfY1SkG9/Vz71HTgWL.27C2OLVEEzmkaCUb65IXDb7Cjx/WlS.', 'STAFF', now()),
('6c219529-237f-4b14-b4de-1903e5e83936', 'Staff Perpustakaan Saintek', 'staff-perpus-saintek', '$2b$10$mtqGGHkO5RjKzlkoJljAYewf4wsFi7vYJ.1f90ev3dxnX7rD2gXTy', 'STAFF', now());

-- Staff → Location assignments
INSERT INTO public.user_staff_location (staff_id, location_id, created_at) VALUES
('abae62ef-929e-4e43-8ecc-9f6755363cc2', 'd9c17ff0-8f43-460e-903c-006e1154d54a', now()),
('0fd4a5d8-2668-4b9f-8f8f-ca0fa636d9b9', 'a34cdced-df20-4887-aeae-589e5029944d', now()),
('93f6ba1c-8af3-4ea2-90a3-e71b11719dcc', 'a8573e9f-8d2c-4bcd-9e6d-ed28fed9474a', now()),
('1314ffe0-f3c2-4a1c-9e40-b581f1feeb2f', 'd1395635-434d-4623-afcb-c357d7d9c0ad', now()),
('08b12ff3-67a7-45fc-a6d1-b88baf87b988', '7494b96b-0b16-4409-9e75-2f401ce5b611', now()),
('807114c5-08e2-4148-ba8d-2b49254f6ff6', '4f500cd0-8fc1-4464-8fe6-173c9ae8bbb7', now()),
('9e92c013-fdc3-46b0-aebb-84f4b084997d', '43a03e07-e0d9-4cef-96c3-6700c130a7cb', now()),
('610e6012-f3d4-4c5a-8fc6-b124c6893b68', 'aa9cfb7f-22dc-432d-b412-aa61bd4f93de', now()),
('6c219529-237f-4b14-b4de-1903e5e83936', '6fa29bdb-fd1b-49c6-9812-6eb0d71dfaf8', now());
