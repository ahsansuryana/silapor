-- ─────────────────────────────────────────
-- SILAPOR - Database Schema
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

-- Seed data: locations
INSERT INTO public.locations (id, name, type, parent_id, created_at, updated_at) VALUES
('1061b345-33c0-461a-b6c7-b995440b6d29', 'UIN Sultan Maulana Hasanuddin Banten', 'UNIVERSITAS', NULL, now(), now()),
('d9c17ff0-8f43-460e-903c-006e1154d54a', 'Sains dan Teknologi', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('a34cdced-df20-4887-aeae-589e5029944d', 'Adab dan Humaniora', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('43a03e07-e0d9-4cef-96c3-6700c130a7cb', 'Ushuluddin', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('d1395635-434d-4623-afcb-c357d7d9c0ad', 'Dakwah', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('63abc627-51a8-4e05-ad82-bf9e69b12545', 'Tarbiyah dan Keguruan', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('a8573e9f-8d2c-4bcd-9e6d-ed28fed9474a', 'Syariah', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('7494b96b-0b16-4409-9e75-2f401ce5b611', 'Psikologi', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('4f500cd0-8fc1-4464-8fe6-173c9ae8bbb7', 'Hukum', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('cf8e6f05-fa7f-4a64-9451-34637462ea80', 'Ekonomi dan Bisnis Islam', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now()),
('d78c22ab-cca8-44dc-bb41-854dfdb42617', 'Farmasi', 'FAKULTAS', '1061b345-33c0-461a-b6c7-b995440b6d29', now(), now());

-- Seed data: users
INSERT INTO public.users (id, name, "NIM", password, role, created_at) VALUES
('b83e1f32-2a1d-4696-b14d-bff26cf461e6', 'Admin', 'admin', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'ADMIN', now()),
('abae62ef-929e-4e43-8ecc-9f6755363cc2', 'Staff Saintek', 'staff-saintek', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('0fd4a5d8-2668-4b9f-8f8f-ca0fa636d9b9', 'Staff Adhum', 'staff-adhum', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('93f6ba1c-8af3-4ea2-90a3-e71b11719dcc', 'Staff Ushuluddin', 'staff-ushuluddin', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('1314ffe0-f3c2-4a1c-9e40-b581f1feeb2f', 'Staff Dakwah', 'staff-dakwah', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('9bbe8a0a-c931-446a-93a4-9ab71c803cfa', 'Staff Tarbiyah', 'staff-tarbiyah', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('336b53a7-26f8-4600-9a81-dd49a30984f4', 'Staff Syariah', 'staff-syariah', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('08b12ff3-67a7-45fc-a6d1-b88baf87b988', 'Staff Psikologi', 'staff-psikologi', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('807114c5-08e2-4148-ba8d-2b49254f6ff6', 'Staff Hukum', 'staff-hukum', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('c831313b-997b-4f52-bcea-9a7f9ba6bf72', 'Staff Ekonomi', 'staff-ekonomi', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now()),
('1c8c2193-984f-41d8-bc90-d715f79daad8', 'Staff Farmasi', 'staff-farmasi', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'STAFF', now());

-- Seed data: user_staff_location
INSERT INTO public.user_staff_location (staff_id, location_id, created_at) VALUES
('abae62ef-929e-4e43-8ecc-9f6755363cc2', 'd9c17ff0-8f43-460e-903c-006e1154d54a', now()),
('0fd4a5d8-2668-4b9f-8f8f-ca0fa636d9b9', 'a34cdced-df20-4887-aeae-589e5029944d', now()),
('93f6ba1c-8af3-4ea2-90a3-e71b11719dcc', '43a03e07-e0d9-4cef-96c3-6700c130a7cb', now()),
('1314ffe0-f3c2-4a1c-9e40-b581f1feeb2f', 'd1395635-434d-4623-afcb-c357d7d9c0ad', now()),
('9bbe8a0a-c931-446a-93a4-9ab71c803cfa', '63abc627-51a8-4e05-ad82-bf9e69b12545', now()),
('336b53a7-26f8-4600-9a81-dd49a30984f4', 'a8573e9f-8d2c-4bcd-9e6d-ed28fed9474a', now()),
('08b12ff3-67a7-45fc-a6d1-b88baf87b988', '7494b96b-0b16-4409-9e75-2f401ce5b611', now()),
('807114c5-08e2-4148-ba8d-2b49254f6ff6', '4f500cd0-8fc1-4464-8fe6-173c9ae8bbb7', now()),
('c831313b-997b-4f52-bcea-9a7f9ba6bf72', 'cf8e6f05-fa7f-4a64-9451-34637462ea80', now()),
('1c8c2193-984f-41d8-bc90-d715f79daad8', 'd78c22ab-cca8-44dc-bb41-854dfdb42617', now());
