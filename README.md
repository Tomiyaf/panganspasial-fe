# 🌾 Panganspasial.id — Frontend WebGIS & SDSS Platform

> **Sistem Informasi Geospasial (WebGIS) & Sistem Pendukung Keputusan Spasial (SDSS) Pemetaan Potensi Peternakan dan Ketahanan Pangan Kabupaten Pringsewu.**

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=react-query&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-v3-22B5BF)

---

## 📖 Tentang Platform

**Panganspasial.id** adalah platform berbasis web modern yang dirancang untuk mendigitalisasi, memvisualisasikan, dan menganalisis sebaran peternakan, komoditas ternak, serta potensi ketahanan pangan di 9 kecamatan wilayah **Kabupaten Pringsewu, Provinsi Lampung**.

Platform ini menggabungkan visualisasi peta interaktif **PostGIS GeoJSON RFC 7946**, visualisasi analitik statistik **Recharts**, serta mesin pendukung keputusan spasial menggunakan metode **Simple Additive Weighting (SAW)**.

---

## 🚀 Fitur Utama

### 🌐 1. Portal Publik (Public Web)
* **Beranda Interaktif (`/`):**
  * Ringkasan statistik makro peternakan secara *real-time* (Total Peternakan, Populasi Hewan, Jumlah Kecamatan, Variasi Komoditas).
  * Pratinjau peta spasial dengan poligon batas administrasi 9 kecamatan resmi Pringsewu.
  * Narasi nilai strategis ketahanan pangan daerah.
* **WebGIS Layar Penuh (`/spasial`):**
  * Peta interaktif Leaflet dengan pilihan basemap (CartoDB Voyager, Esri Satellite, OpenStreetMap).
  * Layer poligon batas kecamatan & desa/pekon dengan tooltip informatif.
  * Layer titik marker peternakan dengan filter multi-kriteria (Kecamatan, Kategori Usaha, Skala Usaha, Komoditas).
  * Layer *Heatmap* kepadatan populasi ternak berbasis komputasi densitas spasial.
  * **Farm Detail Drawer:** Informasi komprehensif pemilik, alamat, koordinat, rincian populasi ternak, dan galeri foto kandang dengan modal *lightbox*.
* **Dashboard Statistik Wilayah (`/statistik`):**
  * 4 Kartu KPI indikator makro.
  * Visualisasi komposisi populasi ternak (*Bar Chart* per komoditas).
  * Distribusi peternakan antar-kecamatan (*Bar Chart* agregat).
  * Proporsi skala usaha dan kategori peternakan (*Pie / Donut Chart*).
  * Tabel agregasi data wilayah dengan fitur sorting kolom dan tombol pintas ke peta.
* **Rekomendasi Spasial SDSS SAW (`/rekomendasi`):**
  * Peringkat kelayakan & potensi pengembangan wilayah peternakan di 9 kecamatan.
  * Highlight khusus "Sentra Utama Unggulan" (Peringkat 1).
  * Tabel matriks skor SAW (0.0000 - 1.0000) dilengkapi status potensi dan narasi analisis kebijakan.
* **Informasi & Layanan Institusi (`/tentang` & `/kontak`):**
  * Profil sistem informasi, atribusi sumber data resmi (Dinas Pertanian & Peternakan, BPS, BIG).
  * Formulir pengajuan informasi dan saluran kontak resmi dinas.

---

### 🔐 2. Portal Administrator (`/admin/*`)
* **Autentikasi & Keamanan JWT:**
  * Login administrator dengan validasi form Zod.
  * Penyimpanan token tersinkronisasi dan proteksi rute (`ProtectedRoute`).
  * Sesi otomatis logout jika token kedaluwarsa (`401 Unauthorized`).
* **Dashboard Ringkasan Operasional (`/admin`):**
  * Metrik total kandang, total populasi, antrean survei pending, dan total administrator.
  * Akses cepat (*quick shortcuts*) pendaftaran peternakan, validasi survei, dan kalkulasi SDSS.
  * Widget antrean verifikasi survei lapangan terbaru.
* **Manajemen Data Peternakan & Media Spasial (`/admin/farms`):**
  * Tabel data terpaginasi dengan pencarian nama/pemilik dan filter multi-dropdown.
  * **Map Coordinate Picker (PostGIS SRID 4326):** Pin koordinat interaktif pada peta Leaflet atau input manual koordinat lintang/bujur.
  * Form berjenjang (*cascading dropdown*): Pilih Kecamatan $\rightarrow$ Otomatis memuat Desa/Pekon terkait.
  * **Sub-manajemen Komoditas Ternak:** Tambah/edit populasi ternak dengan taksonomi bertingkat (Kategori $\rightarrow$ Jenis $\rightarrow$ Ras/Subtipe).
  * **Sub-manajemen Galeri Foto:** Upload multi-part foto kandang (max 5MB, format JPG/PNG/WebP), toggle status foto utama (*primary*), dan pengaturan urutan.
* **Verifikasi & Validasi Lapangan Mantri Hewan (`/admin/validations`):**
  * Antrean pemeriksaan fisik data kandang dan komoditas oleh petugas dinas.
  * Pembaruan status validasi (`valid`, `rejected`, `pending`) disertai catatan teknis lapangan.
* **Sistem Pendukung Keputusan SDSS SAW (`/admin/sdss`):**
  * Manajemen kriteria keputusan spasial (Tipe *Benefit* / *Cost*, pengaturan bobot desimal).
  * Indikator peringatan normalisasi akumulasi bobot (1.00 / 100%).
  * Tombol aksi **"Hitung Ulang & Simpan Hasil SDSS"** untuk memproses kalkulasi normalisasi matriks dan pemeringkatan SAW ke database.
* **Master Data & Taksonomi (`/admin/master`):**
  * Manajemen Kategori Peternakan (Industri, Rumah Tangga, Kemitraan).
  * Klasifikasi Skala Usaha (Besar, Sedang, Kecil).
  * Taksonomi Komoditas Ternak (Ruminansia Besar, Ruminansia Kecil, Unggas, Aneka Ternak).
* **Manajemen Akun Pengguna Administrator (`/admin/users`):**
  * Pengelolaan akun operator dinas dan superadmin.
  * Ubah nama, email, password baru, toggle aktif/nonaktif.
  * Proteksi keamanan pencegahan penghapusan akun diri sendiri.

---

## 🛠️ Tech Stack & Dependencies

| Kategori | Teknologi | Deskripsi |
|---|---|---|
| **Core Framework** | React 19 + Vite | UI Library & Ultra-fast Bundler |
| **Styling & Icons** | Tailwind CSS v4 + Lucide React | Modern utility-first CSS & icons |
| **Peta & GIS** | Leaflet + React-Leaflet + Leaflet.heat | WebGIS Map Engine & Spatial Heatmaps |
| **Server State & Cache** | TanStack React Query v5 | Data fetching, auto-caching, & mutation |
| **Routing** | React Router v7 | Client-side declarative routing |
| **Visualisasi Data** | Recharts v3 | Interactive charts (Bar, Donut, Pie) |
| **Form & Validasi** | React Hook Form + Zod | Validasi skema & form handling |
| **Animasi & Interaksi** | Framer Motion | Smooth page & component transitions |
| **HTTP Client** | Axios | Interceptor auth & GeoJSON unmarshaling |

---

## 📁 Struktur Direktori Proyek

```text
panganspasial-fe/
├── public/                     # Aset statis & logo
├── src/
│   ├── components/             # Reusable UI & Layout components
│   │   ├── admin/              # Komponen khusus panel admin (Sidebar, Layout, Coordinate Picker)
│   │   ├── home/               # Seksi landing page (Hero, MapPreview, ValueProp)
│   │   ├── layout/             # Header Navbar & Footer publik
│   │   ├── spatial/            # Kontrol layer, filter drawer, & detail drawer WebGIS
│   │   └── ui/                 # Shared UI primitives (Modal, ConfirmDialog, Skeletons, Pagination)
│   ├── context/                # Global contexts (AuthContext, ToastContext)
│   ├── hooks/                  # Custom hooks (useMasterData TanStack Query hooks)
│   ├── pages/                  # Halaman aplikasi
│   │   ├── admin/              # Halaman panel admin (Dashboard, Farms, Validations, SDSS, Master, Users)
│   │   ├── HomePage.jsx        # Beranda
│   │   ├── SpasialPage.jsx     # Peta Spasial WebGIS Layar Penuh
│   │   ├── StatistikPage.jsx   # Dashboard Statistik & Grafik
│   │   ├── RekomendasiPage.jsx # Halaman Rekomendasi SDSS SAW
│   │   ├── TentangPage.jsx     # Profil Platform
│   │   └── KontakPage.jsx      # Saluran Kontak & Form Pesan
│   ├── services/
│   │   └── api/                # Axios instance & modular REST API services
│   ├── utils/                  # Helper utilities (Image URL resolver, formatting)
│   ├── App.jsx                 # Route registry & root layout provider
│   └── main.jsx                # Application entry point
├── .env.example                # Template variabel lingkungan
├── eslint.config.js            # Konfigurasi ESLint
├── vite.config.js              # Konfigurasi Vite bundler
└── package.json                # Dependensi & script proyek
```

---

## ⚙️ Persyaratan Sistem & Instalasi

### 1. Prasyarat
* **Node.js**: Versi `18.0.0` atau yang lebih baru.
* **NPM**: Versi `9.0.0` atau yang lebih baru.
* **Backend API**: Panganspasial Backend berjalan di `http://localhost:5000/api`.

---

### 2. Langkah Instalasi

1. **Clone repository & masuk ke direktori frontend:**
   ```bash
   cd panganspasial-fe
   ```

2. **Pasang seluruh dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Isi file `.env` dengan konfigurasi target API:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
   ```

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Aplikasi frontend dapat diakses di browser pada: `http://localhost:5173`.

---

## 📜 Kredensial Default Administrator

Untuk mengakses dan menguji **Portal Administrator** (`/admin/login`):

| Parameter | Nilai Default |
|---|---|
| **URL Login** | `http://localhost:5173/admin/login` |
| **Email** | `admin@panganspasial.id` |
| **Password** | `Admin#2026` |
| **Peran (Role)** | Superadmin / Administrator Sistem |

---

## 🧪 Script & Perintah Tersedia

* **`npm run dev`** — Menjalankan development server dengan fitur Hot Module Replacement (HMR).
* **`npm run build`** — Melakukan kompilasi dan bundling kode produksi ke folder `dist/`.
* **`npm run preview`** — Menjalankan server lokal untuk menguji build produksi dari folder `dist/`.
* **`npm run lint`** — Menjalankan audit linter kode dengan ESLint.

---

## 🗺️ Panduan Koordinat Wilayah Pringsewu

Platform ini dikalibrasi khusus untuk wilayah **Kabupaten Pringsewu, Lampung**:
* **Titik Pusat Peta:** `Latitude: -5.3582, Longitude: 104.9749`
* **Cakupan Lintang:** `-5.15` s/d `-5.50`
* **Cakupan Bujur:** `104.85` s/d `105.15`
* **Sistem Koordinat PostGIS:** `WGS 84 (SRID 4326)`

---

## 🏛️ Atribusi & Lisensi

Dikembangkan untuk kebutuhan pemetaan spasial dan sistem pendukung keputusan peternakan Kabupaten Pringsewu.  
Data geografis dan statistik bersumber dari:
* **Dinas Pertanian & Peternakan Kabupaten Pringsewu**
* **Badan Pusat Statistik (BPS) Kabupaten Pringsewu**
* **Badan Informasi Geospasial (BIG)**

---
