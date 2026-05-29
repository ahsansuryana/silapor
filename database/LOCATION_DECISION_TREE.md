# Decision Tree - Fasilitas Kampus UIN Sunan Gunung Djati Bandung

## Cara Menggunakan
Buka file ini di: https://mermaid.live
Copy paste isi file ini ke editor untuk melihat diagram

---

```mermaid
flowchart TD
    subgraph ROOT["📍 UNIVERSITAS UIN SUNAN GUNUNG DJATI BANDUNG"]
        
        subgraph PUBLIK["🏛 AREA PUBLIK"]
            PJ1[Jalan Utama]
            PJ2[Jalan Penghubung]
            PJ3[Trotoar]
            PJ4[Taman Umum]
            PJ5[Parkir Kendaraan]
            PJ6[Masjid]
        end
        
        subgraph FASUM["🍽 FASILITAS UMUM"]
            FU1[Kantin Utama]
            FU2[Kantin Gedung]
            FU3[Pos Keamanan]
            FU4[Pos Tamu / Reception]
            FU5[Toilet Umum]
            FU6[Tempat Ibadah / Prayer Room]
        end
        
        subgraph OLAHRAGA["🏟 FASILITAS OLAHRAGA"]
            OL1[GOR - Gedung Olah Raga]
            OL2[Lapangan Sepak Bola]
            OL3[Lapangan Basket]
            OL4[Lapangan Voli]
            OL5[Tennis Court]
            OL6[Kolam Renang]
            OL7[Area Fitness / Gym]
        end
        
        subgraph ADMIN["🏢 GEDUNG ADMINISTRASI"]
            AD1[Rektorat]
            AD2[Gedung Administrasi Utama]
            AD3[Gedung Keuangan]
            AD4[Gedung Perpustakaan]
            AD5[Auditorium / Aula]
        end
        
        subgraph FAKULTAS["🎓 FAKULTAS"]
            F1[FAKULTAS SAINS DAN TEKNOLOGI]
            F2[FAKULTAS ADAB DAN HUMANIORA]
            F3[FAKULTAS USHULUDDIN]
            F4[FAKULTAS DAKWAH]
            F5[FAKULTAS TARBIYAH DAN KEGURUAN]
            F6[FAKULTAS SYARIAH]
            F7[FAKULTAS PSIKOLOGI]
            F8[FAKULTAS HUKUM]
            F9[FAKULTAS EKONOMI DAN BISNIS]
            F10[FAKULTAS FARMASI]
        end
    end
    
    ROOT --> PUBLIK
    ROOT --> FASUM
    ROOT --> OLAHRAGA
    ROOT --> ADMIN
    ROOT --> FAKULTAS
```

---

## Level 2: FAKULTAS DAN GEDUNG

```mermaid
flowchart TD
    subgraph SAINTEK["🎓 FAKULTAS SAINS DAN TEKNOLOGI"]
        S1A[Gedung A - Teknik]
        S1B[Gedung B - Lab]
        S1C[Lab Komputer]
        S1D[Lab Kimia]
        S1E[Lab Fisika]
    end
    
    subgraph ADHUM["🎓 FAKULTAS ADAB DAN HUMANIORA"]
        A1[Gedung Utama Adhum]
        A2[Auditorium Adhum]
        A3[Lab Bahasa]
    end
    
    subgraph USHULUDDIN["🎓 FAKULTAS USHULUDDIN"]
        U1[Gedung Utama Ushuluddin]
        U2[Masjid Ushuluddin]
    end
    
    subgraph DAKWAH["🎓 FAKULTAS DAKWAH"]
        D1[Gedung Utama Dakwah]
        D2[Studio Media]
    end
    
    subgraph TARBIYAH["🎓 FAKULTAS TARBIYAH DAN KEGURUAN"]
        T1[Gedung A Tarbiyah]
        T2[Gedung B - PGMI]
        T3[Lab School]
    end
    
    subgraph SYARIAH["🎓 FAKULTAS SYARIAH"]
        SY1[Gedung Utama Syariah]
        SY2[Masjid FATWA]
    end
    
    subgraph PSIKOLOGI["🎓 FAKULTAS PSIKOLOGI"]
        PS1[Gedung Utama Psikologi]
        PS2[Lab Psikologi]
    end
    
    subgraph HUKUM["🎓 FAKULTAS HUKUM"]
        H1[Gedung Utama Hukum]
        H2[Ruang Sidang]
        H3[Klinik Hukum]
    end
    
    subgraph EKONOMI["🎓 FAKULTAS EKONOMI DAN BISNIS"]
        E1[Gedung Utama Ekonomi]
        E2[Lab Akuntansi]
        E3[Ruang Meeting]
    end
    
    subgraph FARMASI["🎓 FAKULTAS FARMASI"]
        FM1[Gedung Utama Farmasi]
        FM2[Lab Farmasi]
    end
    
    FAKULTAS --> SAINTEK
    FAKULTAS --> ADHUM
    FAKULTAS --> USHULUDDIN
    FAKULTAS --> DAKWAH
    FAKULTAS --> TARBIYAH
    FAKULTAS --> SYARIAH
    FAKULTAS --> PSIKOLOGI
    FAKULTAS --> HUKUM
    FAKULTAS --> EKONOMI
    FAKULTAS --> FARMASI
```

---

## Level 3: JURUSAN (Contoh SAINTEK)

```mermaid
flowchart TD
    subgraph GUDANG_A["Gedung A - Teknik Informatika"]
        J1[Teknik Informatika]
        J2[Teknik Industri]
        J3[Sistem Informasi]
        J4[Matematika]
        J5[Fisika]
        J6[Kimia]
    end
    
    subgraph GUDANG_B["Gedung B - Lab"]
        LB1[Lab Komputer 1]
        LB2[Lab Komputer 2]
        LB3[Lab Jaringan]
        LB4[Lab Multimedia]
        LB5[Lab Fisika]
        LB6[Lab Kimia]
    end
    
    GUDANG_A --> J1
    GUDANG_A --> J2
    GUDANG_A --> J3
    GUDANG_A --> J4
    GUDANG_A --> J5
    GUDANG_A --> J6
    GUDANG_B --> LB1
    GUDANG_B --> LB2
    GUDANG_B --> LB3
    GUDANG_B --> LB4
    GUDANG_B --> LB5
    GUDANG_B --> LB6
```

---

## Level 4: RUANGAN

```mermaid
flowchart TD
    subgraph TI["Teknik Informatika"]
        R1[Ruang Kelas 101]
        R2[Ruang Kelas 102]
        R3[Ruang Kelas 103]
        R4[Ruang Kelas 104]
        RD[Ruang Dosen]
        RTU[Ruang Tata Usaha]
        RS[Ruang Seminar]
    end
    
    subgraph LABKOM["Lab Komputer"]
        LK1[Laboratorium Komputer 1]
        LK2[Laboratorium Komputer 2]
        LJ[Laboratorium Jaringan]
        LM[Laboratorium Multimedia]
    end
    
    TI --> R1
    TI --> R2
    TI --> R3
    TI --> R4
    TI --> RD
    TI --> RTU
    TI --> RS
    LABKOM --> LK1
    LABKOM --> LK2
    LABKOM --> LJ
    LABKOM --> LM
```

---

## Level 5: INVENTARIS / FASILITAS RUANGAN

```mermaid
flowchart TD
    subgraph INVENTARIS["📦 INVENTARIS RUANGAN"]
        
        subgraph ELEKTRONIK["🔌 Elektronik & AV"]
            E1[AC - Air Conditioner]
            E2[TV LED]
            E3[Projector]
            E4[Speaker]
            E5[Microphone]
            E6[Access Point WiFi]
            E7[Switch Network]
            E8[CCTV]
        end
        
        subgraph FURNITURE["🪑 Furnitur"]
            F1[Meja Dosen]
            F2[Kursi Dosen]
            F3[Meja Student]
            F4[Kursi Student]
            F5[Lemari Arsip]
            F6[Rak Buku]
            F7[Meja Rapat]
        end
        
        subgraph INFRA["🏗 Infrastruktur"]
            I1[Whiteboard / Papan Tulis]
            I2[Lampu Neon / LED]
            I3[Kipas Angin Ceiling]
            I4[Stop Kontak]
            I5[Pintu Utama]
            I6[Jendela]
            I7[Jam Dinding]
            I8[Lantai]
            I9[Dinding]
            I10[Plafon]
        end
        
        subgraph KEAMANAN["🚨 Keamanan & Darurat"]
            K1[APAR - Tabung Pemadam]
            K2[Exit Emergency]
            K3[Rute Evakuasi]
            K4[Alarm Kebakaran]
            K5[Kotak Panel Listrik]
            K6[First Aid Kit]
        end
    end
    
    ELEKTRONIK --> E1
    ELEKTRONIK --> E2
    ELEKTRONIK --> E3
    ELEKTRONIK --> E4
    ELEKTRONIK --> E5
    ELEKTRONIK --> E6
    ELEKTRONIK --> E7
    ELEKTRONIK --> E8
    
    FURNITURE --> F1
    FURNITURE --> F2
    FURNITURE --> F3
    FURNITURE --> F4
    FURNITURE --> F5
    FURNITURE --> F6
    FURNITURE --> F7
    
    INFRA --> I1
    INFRA --> I2
    INFRA --> I3
    INFRA --> I4
    INFRA --> I5
    INFRA --> I6
    INFRA --> I7
    INFRA --> I8
    INFRA --> I9
    INFRA --> I10
    
    KEAMANAN --> K1
    KEAMANAN --> K2
    KEAMANAN --> K3
    KEAMANAN --> K4
    KEAMANAN --> K5
    KEAMANAN --> K6
```

---

## Ringkasan Struktur Decision Tree

| Level | Type | Contoh |
|-------|------|--------|
| 1 | UNIVERSITAS | UIN Sunan Gunung Djati Bandung |
| 2 | AREA PUBLIK | Jalan, Taman, Parkir, Masjid |
| 3 | FASILITAS UMUM | Kantin, Pos Keamanan, Toilet |
| 4 | OLAHRAGA | GOR, Lapangan, Kolam Renang |
| 5 | ADMINISTRASI | Rektorat, Perpustakaan |
| 6 | FAKULTAS | Saintek, Adhum, Tarbiyah, dll |
| 7 | GEDUNG | Gedung A, Gedung B |
| 8 | JURUSAN | Teknik Informatika, PGMI |
| 9 | RUANGAN | Ruang Kelas 101, Lab Komputer |
| 10 | INVENTARIS | AC, TV, Meja, Kursi, dll |