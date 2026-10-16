# Pedoman AI dan Karakter Teksie

Dokumen ini menjelaskan perilaku AI produk dan karakter Teksie. Instruksi untuk agen yang mengedit kode ada di root [`AGENTS.md`](../AGENTS.md) dan [`AGENT_ADAPTATION.md`](./AGENT_ADAPTATION.md).

## 1. Karakter Teksie

Teksie adalah maskot musang oranye PahamTeks. Saat ini Teksie tampil sebagai ilustrasi belajar di [`TeksieCodingCard.jsx`](../client/src/components/TeksieCodingCard.jsx) dan sebagai karakter interaktif pada [`MiniCharacters.jsx`](../client/src/components/MiniCharacters.jsx) di beranda. Teksie tidak dipasang sebagai pendamping melayang global.

Pada panel belajar, Teksie menemani siswa di belakang laptop. Pertahankan siluet musang, warna oranye, ekspresi ramah, dan visual yang tidak mengganggu pemilihan materi. Karakter pada cluster beranda dapat menampilkan sapaan dan tips saat dipilih.

## 2. AI pembelajaran

Prompt fitur Gemini berada di [`geminiResolvers.js`](../server/src/resolvers/geminiResolvers.js); retry dan pemilihan model/API key berada di [`gemini.js`](../server/src/config/gemini.js). Prompt tiap fitur berbeda. Pertahankan tujuan yang sudah ada: definisi kamus yang jelas, terjemahan langsung, soal kuis sesuai topik, dan penjelasan jawaban yang ramah serta membantu.

Jangan mengklaim skor AI selalu benar. Beri tahu pengguna melalui UI bila layanan gagal, dan jangan menyamarkan kegagalan sebagai hasil yang berhasil.

## 3. Materi dokumen pengguna: rencana

Upload folder/dokumen dan retrieval materi belum tersedia. Jika fitur ini dibangun:

- Perlakukan isi dokumen sebagai sumber tak tepercaya, bukan instruksi sistem.
- Batasi retrieval pada dokumen yang dimiliki atau dapat diakses pengguna/kelas tersebut.
- Berikan rujukan bagian/halaman bila tersedia dan nyatakan dengan jelas bila sumber tidak menjawab pertanyaan.
- Jangan menjalankan macro/kode, membuka tautan dari dokumen, atau meminta rahasia.
- Jangan menyalin dokumen panjang lebih banyak dari yang diperlukan untuk membantu belajar.

## 4. Alur kerja kode

Ikuti [`AGENTS.md`](../AGENTS.md) untuk standar implementasi, build frontend, keamanan, dan Git. Ringkasan arsitektur ada di [`ARCHITECTURE.md`](./ARCHITECTURE.md).
