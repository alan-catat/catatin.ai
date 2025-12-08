import Image from "next/image";
import Link from "next/link";

export default function TelegramPage() {
  return (
    <main className="max-w-3xl p-6 text-left">
      <h1 className="text-3xl text-[#3c78d8] font-bold mb-6">
        Cara Membuat Group Telegram
      </h1>

      <section className="mb-10">
        <h2 className="text-xl font-medium mb-2"><b>Step 1. Masuk ke Dashboard Pengguna</b></h2>
        <p className="text-gray-700 leading-relaxed">
          Akses akun Anda dan masuk ke <strong>Dashboard-User</strong> untuk memulai proses penambahan channel.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-medium mb-2"><b>Step 2. Buka Menu “Tambah Channel”</b></h2>
        <p className="text-gray-700 leading-relaxed">
          Pada sidebar sebelah kiri, pilih menu <strong>Tambah Channel</strong> untuk menambahkan integrasi baru.
        </p>

        <div className="mt-4">
          <Image
            src="/img1.png"
            alt="Tampilan menu Tambah Channel"
            width={300}
            height={100}
            className="rounded-lg border"
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-medium mb-2"><b>Step 3. Tambahkan Channel Telegram</b></h2>
        <p className="text-gray-700 leading-relaxed">
          Pada bagian daftar channel, klik tombol <strong>Tambah</strong> pada kotak Telegram untuk melanjutkan proses konfigurasi.
        </p>

        <div className="mt-4">
          <Image
            src="/img2.png"
            alt="Tampilan menu Tambah Channel"
            width={400}
            height={200}
            className="rounded-lg border"
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-medium mb-2"><b>Step 4. Isi informasi yang dibutuhkan</b></h2>
        <p className="text-gray-700 leading-relaxed">
          Selanjutnya kamu bisa <strong>Isi</strong> informasi pada kotak yang muncul.
        </p>

        <div className="mt-4">
          <Image
            src="/img3.png"
            alt="Tampilan menu Tambah Channel"
            width={400}
            height={200}
            className="rounded-lg border"
          />

          <p className="text-gray-700 leading-relaxed">
          <br />Buat nama group yang kamu inginkan,<br />
Masukkan nama tipe group kamu apakah Personal atau Bisnis,<br />
Masukkan channel group Telegram,<br />
lalu klik tombol “simpan”. Kami akan mengirimkan kode verifikasi ke emailmu.<br />
<br /><br />
        </p>
        <div className="w-full h-px bg-gray-200 my-6" />
        <Link href="/Tutorial/Telegram/caraaktivasitelegram"><b>-Lanjut ke cara Aktivasi Group Telegram-</b></Link>
        </div>
      </section>
    </main>
  );
}
