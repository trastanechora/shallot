# Atlas Bawang Merah

Aplikasi edukasi botani berbahasa Indonesia, dibuat dengan React, React Three Fiber, Three.js, dan Vite. Model, bahan permukaan, dan akar dibuat secara prosedural; tidak memerlukan model 3D, tekstur, font eksternal, API key, atau layanan backend.

## Menjalankan

```sh
npm ci
npm run dev -- --port 5173
```

## Pengujian dan build

```sh
npm test
npx playwright install chromium
# Jalankan server lokal di terminal lain sebelum tes browser:
ATLAS_URL=http://127.0.0.1:5173 npx playwright test tests/*.spec.js --workers=1
npm run build
npm run preview
```

Deploy isi `dist/` ke root hosting statis. Vite menggunakan base `/`. `ATLAS_URL` dapat diarahkan ke deployment untuk pengujian browser.

## Fitur

- Enam tahap: penanaman, bertunas, pembentukan anakan, pertumbuhan daun, pembentukan umbi, dan pematangan.
- Penggeser perkembangan anakan, label tunas utama/anakan, serta penjelasan bahwa rumpun berkembang melalui tunas lateral, bukan umbi yang membelah sama besar.
- Anatomi interaktif, orbit, zoom, reset, detail umbi, dan irisan anatomi.
- Perbandingan bibit utuh dengan pemotongan opsional sekitar sepertiga ujung atas; pangkal dan akar tetap utuh.
- Tanah semi-transparan dan penggaris sentimeter dalam ruang 3D, dengan nol pada permukaan tanah.
- Tata letak responsif, preferensi pengurangan gerakan, dan alternatif edukasi saat WebGL tidak tersedia.

## Struktur

- `src/data.js`: tahap pertumbuhan, anatomi, konfigurasi tampilan.
- `src/geometry.js`: geometri umbi/daun/akar dan kalibrasi skala ilustrasi.
- `src/PlantCanvas.jsx`: adegan R3F, interaksi, kamera, tanah, serta penanganan WebGL.
- `src/WorldRuler.jsx`: penggaris dan label sentimeter.
- `src/SeedPreparation.jsx`: pilihan serta penjelasan persiapan bibit.
- `src/main.jsx`: antarmuka, penjelasan, rujukan, dan aksesibilitas.
- `src/styles.css`: tata letak dan gaya responsif.
- `tests/`: tes logika/geometri Node dan interaksi browser Playwright.

## Rujukan dan batasan

Sumber Indonesia mencakup Kementan, BBPP Lembang, Ditjen Hortikultura, dan tinjauan pustaka UIN Suska Riau. Tautan serta konteks sumber tersedia di aplikasi dan `INDONESIAN-SOURCES.md`.

Model bersifat skematis, bukan acuan varietas, prediksi hasil, atau resep budidaya. Jumlah anakan hanya ilustrasi. Penggaris memakai satu kalibrasi ilustratif: tinggi model pada Pembentukan umbi adalah 30 cm. Proporsi anatomi tidak seluruhnya tervalidasi secara biologis; akar model sekitar 12 cm dibedakan dari kisaran pustaka 15–20 cm. Penggaris disembunyikan pada mode detail, irisan, dan persiapan bibit yang memakai pembesaran tersendiri.
