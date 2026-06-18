INSERT INTO public.categories (id, name, short_description) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'Infrastruktur', 'Kerusakan gedung, jalan, jembatan, dan fasilitas fisik lainnya'),
('a1b2c3d4-0002-4000-8000-000000000002', 'Kebersihan', 'Sampah, sanitasi, dan kebersihan lingkungan'),
('a1b2c3d4-0003-4000-8000-000000000003', 'Keamanan', 'Gangguan keamanan, pencahayaan, dan pengawasan'),
('a1b2c3d4-0004-4000-8000-000000000004', 'Fasilitas', 'Kerusakan peralatan, AC, listrik, air, dan jaringan'),
('a1b2c3d4-0005-4000-8000-000000000005', 'Lainnya', 'Laporan yang tidak termasuk kategori di atas')
ON CONFLICT (id) DO NOTHING;
