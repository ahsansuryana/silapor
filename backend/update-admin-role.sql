UPDATE users SET role = 'ADMIN' WHERE "NIM" = 'admin';
SELECT "NIM", name, role FROM users WHERE "NIM" = 'admin';