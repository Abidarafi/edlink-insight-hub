# EdLink Usability Insights

Buatkan sebuah web dashboard analisis data penelitian menggunakan React + Tailwind CSS, dengan judul "Sistem Informasi Analisis Kemudahan Penggunaan Aplikasi EdLink", subjudul "Institut Teknologi PLN". Gunakan data dari file CSV yang saya upload (

dashboard_data_fixed.csv

), dengan kolom: Nim, Angkatan, ProgramStudi, JenisKelamin, P1-P10 (skor mentah), SkorKontribusi, SkorSUS, Acceptability, GradeScale, AdjectiveRating, serta P1_Kontribusi sampai P10_Kontribusi (skor kontribusi skala 0-4).

Struktur halaman (top to bottom):

Header: logo Institut Teknologi PLN di pojok kiri atas (gunakan file logo yang saya lampirkan, jangan buat logo baru), logo EdLink di pojok kanan atas (gunakan file logo yang saya lampirkan), judul dan subjudul di tengah, dengan teks "Berdasarkan Metode System Usability Scale (SUS) — 100 Responden Mahasiswa Institut Teknologi PLN" di bawah judul.

Baris filter interaktif (sticky di atas konten): dropdown filter untuk Angkatan dan Jenis Kelamin yang mempengaruhi semua scorecard & chart di bawahnya secara real-time. Tampilkan juga counter "X dari 100 responden" di sisi kanan filter.

Baris scorecard (4 kartu horizontal): Rata-rata Skor SUS (dari kolom SkorSUS, kartu pertama diberi warna hijau solid sebagai penekanan), Median Skor, Skor Tertinggi, Skor Terendah — masing-masing angka besar dengan label kecil di bawahnya.

Section "Distribusi Kategori Interpretasi" dengan subjudul "Sebaran responden pada tiga skala interpretasi hasil SUS" — 3 donut chart berdampingan menggunakan kolom Acceptability, GradeScale, dan AdjectiveRating, masing-masing dengan legend dan jumlah + persentase di sampingnya.

Section "Rata-Rata Skor Kontribusi per Item Pernyataan SUS (Skala 0-4)": gunakan kolom P1_Kontribusi sampai P10_Kontribusi (bukan P1-P10 mentah). Tampilkan sebagai horizontal bar chart, diurutkan dari skor tertinggi ke terendah, dengan garis putus-putus vertikal menandai rata-rata keseluruhan (dihitung dari rata-rata 10 nilai kontribusi tersebut). Beri warna hijau untuk item di atas rata-rata, dan warna oranye untuk item di bawah rata-rata. Di sampingnya, buat card list "Area Perlu Perbaikan" yang menampilkan item-item berwarna oranye tadi beserta teks pernyataan singkatnya dan skornya, diurutkan dari skor tertinggi ke terendah di antara yang oranye.

Gaya visual:

Warna utama: gradasi hijau (hijau tua ke hijau muda/emerald), terinspirasi dari warna logo EdLink, diterapkan pada header, scorecard aktif, dan seluruh chart

Warna oranye/kuning tetap dipakai khusus untuk menandai "area perlu perbaikan" agar kontras dan mudah dibedakan

Card dengan shadow halus dan rounded corners, spacing lega

Font sans-serif modern (Inter/Poppins)

Responsive, rapi juga di layar laptop untuk presentasi

Animasi transisi halus saat filter diubah (angka & chart update dengan smooth transition)

Pastikan semua angka dihitung otomatis dari data CSV (jangan di-hardcode), supaya hasilnya tetap akurat kalau datanya diganti.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://edlink-insight-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3d7f61d1-6edd-4121-af30-ac1d700fad1c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
