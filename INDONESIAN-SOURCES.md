# Rujukan Indonesia untuk revisi atlas

Isi halaman berikut berhasil dibaca langsung, HTTP 200. Catatan ini merangkum dasar editorial; bukan rekomendasi budidaya individual.

## PUSTAKA Kementan — 25 Februari 2025
https://pustaka.bppsdmp.pertanian.go.id/info-literasi/info-teknologi-sukses-budi-daya-bawang-merah
Judul: Info Teknologi: Sukses Budi Daya Bawang Merah.
Artikel menyebut sumber BPTP-Balitbangtan Kalimantan Barat, 2019, Budidaya Bawang Merah.
- Umbi bibit segar, sehat, bernas, tidak keriput.
- Tanah memerlukan drainase dan aerasi baik.
- Saat penanaman, umbi dibenamkan sampai ujung rata dengan permukaan tanah.
- Penyiraman bergantung fase dan kondisi cuaca.
- Tanda panen meliputi leher lunak, daun rebah/menguning, umbi menonjol ke permukaan.
Jangan menyalin kalender bulan, dosis pupuk/pestisida, atau jadwal air menjadi resep universal.

## BBPP Lembang — 26 April 2012
https://bbpplembang.bppsdmp.pertanian.go.id/publikasi-detail/1421
Judul: Penyiapan Lahan untuk Tanaman Bawang Merah. Penulis: Cece Mulyana, SP.
Deskripsi praktik Brebes, Jawa Tengah, membedakan penyiapan bedengan/parit pada tanah basah/liat dan tanah kering. Sumber lama untuk konteks praktik, bukan validasi mutakhir dosis atau produk. Hindari mengutip anjuran herbisida di artikel tersebut.

## Direktorat Jenderal Hortikultura — 28 Desember 2025
https://hortikultura.pertanian.go.id/hddap-dorong-peningkatan-daya-saing-bawang-merah-lahan-kering-di-enrekang/
Judul: HDDAP Dorong Peningkatan Daya Saing Bawang Merah Lahan Kering di Enrekang.
Enrekang, Sulawesi Selatan: program pengembangan lahan kering melibatkan Anggeraja, Malua, Baroko; kebutuhan klaster Anggeraja I meliputi saluran pipa sebagai sarana pengairan. Ini berita program, bukan percobaan agronomi atau ukuran kebutuhan air.

## Implikasi visual
Umbi harus berhubungan dengan permukaan tanah, pangkal umbi dan asal akar berada di bawahnya. Saat tanam ujung umbi mendekati permukaan; pada tahap lanjut bahu umbi dapat muncul, bukan seluruh umbi melayang. Geometri tetap skematis; penggaris memakai satu kalibrasi ilustratif, bukan validasi kedalaman agronomis.

## Skala ilustrasi: sumber sekunder dan batas klaim
- https://repository.uin-suska.ac.id/5766/3/BAB%20II.pdf — PDF halaman 1 / halaman tercetak 4: “tinggi dapat mencapai 15-50 cm”, mengutip Wibowo (2006).
- https://repository.uin-suska.ac.id/16540/7/7.%20BAB%20II_2018242PTN.pdf — PDF halaman 1 / halaman tercetak 4: “sistem perakaran dangkal dan bercabang terpencar, pada kedalaman antara 15-20 cm di dalam tanah”. Kalimat ini tidak menetapkan varietas atau umur. Kedua kutipan diverifikasi tim riset dari teks lengkap; ledger `/home/hermes/shallot-research-ledger.json`.
- Model memilih **30 cm** untuk tinggi permukaan tanah hingga vertex daun tertinggi pada tahap Pembentukan umbi, di dalam kisaran umum pertama. Ini pilihan ilustratif, bukan ukuran spesimen hasil eksperimen atau standar varietas.
- `illustrationScale(30)` menghitung `cmPerWorldUnit = 30 / (reference.maxY - 0.38)` dari geometri daun/umbi/akar yang sama dengan renderer. Kalibrasi dihitung sekali, dipakai semua tahap tanpa normalisasi ulang. Saat ini sekitar 7.476 cm per unit dunia; referensi daun tertinggi y≈4.39285.
- Akar model terdalam sekitar −12.03 cm pada Pembentukan umbi dan −12.20 cm pada Pematangan: **tidak** cocok dengan rentang bacaan 15–20 cm, tidak diregangkan agar seolah tervalidasi. Proporsi umbi/akar memang skematis dan disebutkan jelas di UI.
- Penggaris adalah garis dan sprite teks dalam ruang 3D, dari −15 hingga +35 cm setiap 5 cm. Nol selalu y=0.38, sama dengan atas silinder tanah (−0.635 + 2.03/2). Ukuran teks ikut perspektif; hanya orientasinya menghadap kamera. Kamera zoom/orbit tidak mengubah konversi.
- Penggaris disembunyikan (dengan pemberitahuan) pada detail, irisan dan persiapan bibit yang memakai pembesaran lokal. Preferensi tanah/penggaris dipertahankan.
- Tanah: opacity 0.22, FrontSide, depthWrite=false, depthTest default true; transparan setelah objek opak dengan renderOrder=1. Penggaris/label berikutnya memakai depthWrite=false; tidak menghilangkan uji kedalaman terhadap tanaman. Tidak ada perpindahan umbi untuk menampakkannya.
- Kedalaman olah tanah 20–30 cm di Kementan tidak diperlakukan sebagai kedalaman akar. Panjang akar tidak sama dengan kedalaman vertikal.
