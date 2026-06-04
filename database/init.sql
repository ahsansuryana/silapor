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
('aaeb4ceb-9bde-46cc-8cf3-c0331b82e621', 'Gedung', 'UNIVERSITAS', NULL, now(), now());
