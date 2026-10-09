# AI CREATOR PRO — MCP Starter

Prototipe server MCP untuk **Affiliate Video Pro**. Server mengirim alur instruksi/brief terarah kepada ChatGPT, bukan melakukan panggilan ke model AI lain. **Tidak memerlukan API key AI.**

## Jalankan di komputer

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

Server lokal: `http://127.0.0.1:8000/mcp`. **Alamat localhost tidak dapat digunakan langsung sebagai Server URL dari ChatGPT cloud.** Deploy ke hosting yang menghasilkan HTTPS publik.

## Deploy lewat layanan hosting Docker

1. Unggah folder ini sebagai repositori Git pribadi (jangan memasukkan data sensitif).
2. Pada layanan hosting yang mendukung deploy dari Dockerfile, buat *web service* dari repositori tersebut.
3. Gunakan Dockerfile yang tersedia, pastikan layanan HTTP terbuka di port dari variabel `PORT`.
4. Setelah deploy, catat alamat publik `https://DOMAIN-ANDA/mcp`. Pastikan endpoint dapat diakses dengan HTTPS.
5. Di ChatGPT **Plugins → Add → Add custom MCP server**, masukkan nama `AI CREATOR PRO`, deskripsi, dan Server URL `https://DOMAIN-ANDA/mcp`.
6. Pada **Authentication**, pilih opsi tanpa autentikasi *hanya jika* tersedia dan Anda memang ingin melakukan pengujian tanpa data privat. Bila platform mewajibkan OAuth, server contoh ini **belum mendukung OAuth** dan memerlukan pengembangan sebelum dapat dipasang.
7. Setelah terhubung, di Work pilih plugin (jika muncul), lalu coba: `Gunakan Affiliate Video Pro. Saya menjual sneakers santai untuk mahasiswa, buat video TikTok 30 detik. Fitur terverifikasi: nyaman untuk dipakai santai.`

## Batasan penting

- **Belum menjadi produk untuk dijual**: tidak ada login, lisensi, autentikasi, pembatasan kuota, pembayaran, logging terstruktur, atau distribusi yang sudah diuji.
- **Tool bukan Custom GPT**; pemanggilan Plugin oleh ChatGPT tidak selalu otomatis. Pengguna mungkin perlu memilih Plugin di Work.
- **Tidak memerlukan API AI berbayar**, tetapi layanan hosting dapat memiliki biaya dan batas penggunaan tersendiri.
- **Belum teruji lintas akun.** Keberhasilan pemasangan di akun pemilik tidak menjamin akses bagi seluruh pembeli.
- Jangan membagikan URL publik kepada pembeli sebelum autentikasi, keamanan, dan kebijakan distribusi dipastikan.

## Pengembangan ke 20 tools

Setelah uji tool pertama, daftarkan tool-tool lain pada `server.py` dengan dekorator `@mcp.tool()`, tiap tool punya parameter dan instruksi spesifik. Untuk skala produksi, pisahkan konfigurasi tools ke file dan tambahkan tes, observabilitas, otorisasi, dan rate limiting.
