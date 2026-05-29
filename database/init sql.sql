--
-- PostgreSQL database dump
--

\restrict 0eyITo7Nf8pxzHHP4Z13W26K7rlq0LV3ExEAwO1fqaCyZHdSr0WHqIgsab7bpYm

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.11

-- Started on 2026-04-14 12:46:36 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 854 (class 1247 OID 16442)
-- Name: location_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.location_type AS ENUM (
    'UNIVERSITAS',
    'FAKULTAS',
    'JURUSAN',
    'RUANGAN',
    'AREA'
);


ALTER TYPE public.location_type OWNER TO admin;

--
-- TOC entry 869 (class 1247 OID 16492)
-- Name: report_priority; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.report_priority AS ENUM (
    'rendah',
    'sedang',
    'tinggi'
);


ALTER TYPE public.report_priority OWNER TO admin;

--
-- TOC entry 866 (class 1247 OID 16480)
-- Name: report_status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.report_status AS ENUM (
    'menunggu',
    'diterima',
    'diproses',
    'selesai',
    'ditolak'
);


ALTER TYPE public.report_status OWNER TO admin;

--
-- TOC entry 857 (class 1247 OID 16414)
-- Name: role_type; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.role_type AS ENUM (
    'MAHASISWA',
    'STAFF',
    'ADMIN'
);


ALTER TYPE public.role_type OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16470)
-- Name: categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    short_description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE public.categories OWNER TO admin;

--
-- TOC entry 216 (class 1259 OID 16435)
-- Name: locations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.locations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    type public.location_type NOT NULL,
    parent_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.locations OWNER TO admin;

--
-- TOC entry 223 (class 1259 OID 16595)
-- Name: notifications; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    report_id uuid NOT NULL,
    title character varying(255),
    body text,
    is_read boolean,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE public.notifications OWNER TO admin;

--
-- TOC entry 220 (class 1259 OID 16533)
-- Name: report_images; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.report_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_id uuid NOT NULL,
    minio_object_key character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE public.report_images OWNER TO admin;

--
-- TOC entry 222 (class 1259 OID 16574)
-- Name: report_status_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.report_status_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_id uuid NOT NULL,
    change_by uuid NOT NULL,
    old_status public.report_status NOT NULL,
    new_status public.report_status NOT NULL,
    notes text,
    changed_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_dt timestamp with time zone
);


ALTER TABLE public.report_status_history OWNER TO admin;

--
-- TOC entry 224 (class 1259 OID 16600)
-- Name: report_comments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.report_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_id uuid NOT NULL,
    user_id uuid NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.report_comments OWNER TO admin;

--
-- TOC entry 219 (class 1259 OID 16507)
-- Name: reports; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reporter_id uuid NOT NULL,
    location_id uuid NOT NULL,
    category_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status public.report_status DEFAULT 'menunggu'::public.report_status NOT NULL,
    priority public.report_priority DEFAULT 'rendah'::public.report_priority NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE public.reports OWNER TO admin;

--
-- TOC entry 221 (class 1259 OID 16545)
-- Name: staff_report_assigments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.staff_report_assigments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_id uuid NOT NULL,
    assigned_to uuid NOT NULL,
    assigned_by uuid,
    is_active boolean NOT NULL,
    is_auto_assign boolean DEFAULT false NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE public.staff_report_assigments OWNER TO admin;

--
-- TOC entry 217 (class 1259 OID 16460)
-- Name: user_staff_location; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_staff_location (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    staff_id uuid NOT NULL,
    location_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_staff_location OWNER TO admin;

--
-- TOC entry 215 (class 1259 OID 16421)
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    avatar_url character varying(255),
    avatar_file_id character varying(255),
    "NIM" character varying(255),
    password character varying(255),
    email character varying(255),
    role public.role_type DEFAULT 'MAHASISWA'::public.role_type,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    is_google boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO admin;

--
-- TOC entry 3516 (class 0 OID 16470)
-- Dependencies: 218
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.categories (id, name, short_description, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3514 (class 0 OID 16435)
-- Dependencies: 216
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.locations (id, name, type, parent_id, created_at, updated_at) FROM stdin;
aaeb4ceb-9bde-46cc-8cf3-c0331b82e621	Gedung	UNIVERSITAS	\N	2026-04-08 00:34:18.551929+00	2026-04-08 00:34:18.551929+00
\.


--
-- TOC entry 3521 (class 0 OID 16595)
-- Dependencies: 223
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.notifications (id, user_id, report_id, title, body, is_read, sent_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3518 (class 0 OID 16533)
-- Dependencies: 220
-- Data for Name: report_images; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.report_images (id, report_id, minio_object_key, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3520 (class 0 OID 16574)
-- Dependencies: 222
-- Data for Name: report_status_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.report_status_history (id, report_id, change_by, old_status, new_status, notes, changed_at, created_at, updated_dt) FROM stdin;
\.


--
-- TOC entry 3517 (class 0 OID 16507)
-- Dependencies: 219
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.reports (id, reporter_id, location_id, category_id, title, description, status, priority, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3519 (class 0 OID 16545)
-- Dependencies: 221
-- Data for Name: staff_report_assigments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.staff_report_assigments (id, report_id, assigned_to, assigned_by, is_active, is_auto_assign, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3515 (class 0 OID 16460)
-- Dependencies: 217
-- Data for Name: user_staff_location; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_staff_location (id, staff_id, location_id, created_at) FROM stdin;
\.


--
-- TOC entry 3513 (class 0 OID 16421)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, name, avatar_url, avatar_file_id, "NIM", password, email, role, created_at, updated_at, is_google) FROM stdin;
6577d3ce-717e-4b05-ba13-d2530c4f212d	Muhamad Ahsan	\N	\N	1234567890	\N	\N	MAHASISWA	2026-04-06 02:48:52.406961+00	\N	f
4a9c95e9-90f1-4f17-8bd0-4c2d31d91cf2	ahsan sur	https://lh3.googleusercontent.com/a/ACg8ocLAMmcPz115wDx_-jyY3JWWY5Hf_tTLPdJXqMK5Yv8aj8Gi=s96-c	\N	\N	\N	ahsansur33@gmail.com	MAHASISWA	2026-04-06 03:15:35.007598+00	\N	t
304e55db-2ee5-4cec-8977-cc072212f5f2	M AHSAN S	\N	\N	1257050090	$2b$10$.Kix.YB0Pk.PuwnDCQ1y6uNCrJG4dU.I7p2Z5Xlu5FuZsupHtdvbq	\N	MAHASISWA	2026-04-06 14:45:56.183559+00	\N	f
\.


--
-- TOC entry 3347 (class 2606 OID 16478)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3341 (class 2606 OID 16440)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 3357 (class 2606 OID 16604)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3351 (class 2606 OID 16539)
-- Name: report_images report_images_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_images
    ADD CONSTRAINT report_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3349 (class 2606 OID 16517)
-- Name: reports report_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT report_pkey PRIMARY KEY (id);


--
-- TOC entry 3355 (class 2606 OID 16583)
-- Name: report_status_history report_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_status_history
    ADD CONSTRAINT report_status_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3343 (class 2606 OID 16469)
-- Name: user_staff_location staff_location; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_staff_location
    ADD CONSTRAINT staff_location UNIQUE (staff_id, location_id);


--
-- TOC entry 3353 (class 2606 OID 16555)
-- Name: staff_report_assigments staff_report_assigments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.staff_report_assigments
    ADD CONSTRAINT staff_report_assigments_pkey PRIMARY KEY (id);


--
-- TOC entry 3335 (class 2606 OID 16432)
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- TOC entry 3337 (class 2606 OID 16434)
-- Name: users unique_nim; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_nim UNIQUE ("NIM");


--
-- TOC entry 3345 (class 2606 OID 16466)
-- Name: user_staff_location user_staff_location_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_staff_location
    ADD CONSTRAINT user_staff_location_pkey PRIMARY KEY (id);


--
-- TOC entry 3339 (class 2606 OID 16430)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3363 (class 2606 OID 16561)
-- Name: staff_report_assigments report_assign_by_user_staff; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.staff_report_assigments
    ADD CONSTRAINT report_assign_by_user_staff FOREIGN KEY (assigned_by) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3364 (class 2606 OID 16556)
-- Name: staff_report_assigments report_assign_to_user_staff; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.staff_report_assigments
    ADD CONSTRAINT report_assign_to_user_staff FOREIGN KEY (assigned_to) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3359 (class 2606 OID 16528)
-- Name: reports report_category; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT report_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3368 (class 2606 OID 16610)
-- Name: notifications report_id_reports; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT report_id_reports FOREIGN KEY (report_id) REFERENCES public.reports(id);


--
-- TOC entry 3362 (class 2606 OID 16540)
-- Name: report_images report_image_reports; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_images
    ADD CONSTRAINT report_image_reports FOREIGN KEY (report_id) REFERENCES public.reports(id) NOT VALID;


--
-- TOC entry 3360 (class 2606 OID 16523)
-- Name: reports report_location; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT report_location FOREIGN KEY (location_id) REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3361 (class 2606 OID 16518)
-- Name: reports report_reporter; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT report_reporter FOREIGN KEY (reporter_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3365 (class 2606 OID 16566)
-- Name: staff_report_assigments report_reports; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.staff_report_assigments
    ADD CONSTRAINT report_reports FOREIGN KEY (report_id) REFERENCES public.reports(id) NOT VALID;


--
-- TOC entry 3358 (class 2606 OID 16455)
-- Name: locations self-referencing; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT "self-referencing" FOREIGN KEY (parent_id) REFERENCES public.locations(id) NOT VALID;


--
-- TOC entry 3366 (class 2606 OID 16589)
-- Name: report_status_history status_changed_by_user_staff; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_status_history
    ADD CONSTRAINT status_changed_by_user_staff FOREIGN KEY (change_by) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3367 (class 2606 OID 16584)
-- Name: report_status_history status_history_reports; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_status_history
    ADD CONSTRAINT status_history_reports FOREIGN KEY (report_id) REFERENCES public.reports(id) NOT VALID;


--
-- TOC entry 3369 (class 2606 OID 16605)
-- Name: notifications user_id_users; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT user_id_users FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-04-14 12:46:37 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict 0eyITo7Nf8pxzHHP4Z13W26K7rlq0LV3ExEAwO1fqaCyZHdSr0WHqIgsab7bpYm

