import Image from "next/image";

export default function TelegramPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold mb-6">
        Cara Membuat Group Telegram
      </h1>

      <section className="mb-10">
        <h2 className="text-xl font-medium mb-2">1. Masuk ke Dashboard Pengguna</h2>
        <p className="text-gray-700 leading-relaxed">
          Akses akun Anda dan masuk ke <strong>Dashboard-User</strong> untuk memulai proses penambahan channel.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-medium mb-2">2. Buka Menu “Tambah Channel”</h2>
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
        <h2 className="text-xl font-medium mb-2">3. Tambahkan Channel Telegram</h2>
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
        <h2 className="text-xl font-medium mb-2">4. Isi informasi yang dibutuhkan</h2>
        <p className="text-gray-700 leading-relaxed">
          Selanjutny kamu bisa <strong>Isi</strong> informasi pada kotak yang muncul.
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
<strong>Lanjut ke cara aktivasi Group Telegram</strong>
        </p>
        <div className="w-full h-px bg-gray-200 my-6" />
        </div>
      </section>

      <h1 className="text-3xl font-semibold mb-6">
        Cara Aktivasi Group Telegram
        <p className="text-xl text-gray-700 leading-relaxed">
          <br />Setelah kamu mendapatkan <strong>Kode Aktivasi</strong> di email kamu, kamu dapat mengaktifkan group Telegram dengan cara sebagai berikut.
        </p>
      </h1>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">1. Copy Kode aktivasi kamu yang ada di email</h2>
        <p className="text-gray-700 leading-relaxed">
          Cek kotak masuk email terdaftarmu, <strong>Copy Kode Aktivasi</strong> yang ada.
        </p>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">2. Buka aplikasi Telegram</h2>
        <p className="text-gray-700 leading-relaxed">
          Install <strong>Aplikasi Telegram</strong> jika kamu belum menginstalnya.
        </p>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">3. Buat Group Telegram</h2>
        <p className="text-gray-700 leading-relaxed">
          Cek bagian kiri atas apliakasi Garis 3 untuk <strong>Pilihan Menu</strong> pilih "New Group".
        </p>

         <div className="mt-4">
          <Image
            src="/img4.png"
            alt="Tampilan menu Tambah Channel"
            width={270}
            height={100}
            className="rounded-lg border"
          /></div>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">4. Undang @catatinaibot</h2>
        <p className="text-gray-700 leading-relaxed">
          Setelah kamu pilih <strong>new group</strong> kamu akan diminta invite member, cari <strong>catatinaibot</strong>.
        </p>

         <div className="flex mt-4">
          <Image
            src="/img5.png"
            alt="Tampilan menu Tambah Channel"
            width={270}
            height={100}
            className="rounded-lg border"
          />
          </div>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">5. Masukan nama group yang mau kamu buat</h2>
        <p className="text-gray-700 leading-relaxed">
          Isi <strong>nama Group</strong> pada bagian yang disediakan.
        </p>

         <div className="mt-4">
          <Image
            src="/img6.png"
            alt="Tampilan menu Tambah Channel"
            width={270}
            height={100}
            className="rounded-lg border"
          /></div>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">6. Gunakan Kode Aktivasi Kamu</h2>
        <p className="text-gray-700 leading-relaxed">
          Setelah group dibuat <strong>tempel kode aktivasi</strong> yang sudah di salin dari email lalu kirim chat ke group.
          <br />Gunakan format <strong>/aktivasi [Kode Aktivasi]</strong>, contoh: /aktivasi 12345 
        </p>

         <div className="mt-4">
          <Image
            src="/img8.png"
            alt="Tampilan menu Tambah Channel"
            width={220}
            height={150}
            className="rounded-lg border"
          /></div>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">7. Group Telegram kamu sudah diaktivasi</h2>
        <p className="text-gray-700 leading-relaxed">
          Jika sudah ada notifikasi bahwa <strong>aktivasi berhasil</strong>, kamu sudah bisa mulai menggunakan layanan catatin.ai 
        </p>

         <div className="mt-4">
          <Image
            src="/img7.png"
            alt="Tampilan menu Tambah Channel"
            width={370}
            height={200}
            className="rounded-lg border"
          /></div>
      </section>
    </main>
  );
}
