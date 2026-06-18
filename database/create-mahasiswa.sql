INSERT INTO public.users (id, name, "NIM", password, role)
VALUES (gen_random_uuid(), 'Test Mahasiswa', 'test123', '$2b$10$uWbdHDIsBg7GdAT4uIjbEeUgcDl7HjGdkHd8SsqaRt9CVSjGbviwq', 'MAHASISWA')
ON CONFLICT ("NIM") DO NOTHING;
