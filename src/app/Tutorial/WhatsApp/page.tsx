import Image from "next/image";

export default function WhatsAppPage() {
  return (
    <main className="text-left max-w-3xl p-6">
      <h1 className="text-3xl font-semibold mb-6">
        Cara Membuat Group WhatsApp
        <p className="text-xl text-gray-700 leading-relaxed">
          <br /><strong>Catatan:</strong> Layanan channel whatsapp hanya bisa digunakan untuk satu nomor, jika ingin menggunakan lebih dari satu keperluan, kamu dapat buat mengaktifkan group telegram. Lihat caranya disini.
</p>
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
        <h2 className="text-xl font-medium mb-2">3. Tambahkan Channel WhatsApp</h2>
        <p className="text-gray-700 leading-relaxed">
          Pada bagian daftar channel, klik tombol <strong>Tambah</strong> pada kotak WhatsApp untuk melanjutkan proses konfigurasi.
        </p>

        <div className="mt-4">
          <Image
            src="/img9wa.png"
            alt="Tampilan menu Tambah Channel"
            width={450}
            height={250}
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
          <br />Buat nama WhatsApp channel yang kamu inginkan,<br />
Masukkan nama tipe group kamu apakah Personal atau Bisnis,<br />
Masukkan channel group WhatsApp,<br />
lalu klik tombol “simpan”. Kami akan mengirimkan kode verifikasi ke emailmu.<br />
<br /><br />
<strong>Lanjut ke cara aktivasi Group WhatsApp</strong>
        </p>
        <div className="w-full h-px bg-gray-200 my-6" />
        </div>
      </section>

      <h1 className="text-3xl font-semibold mb-6">
        Cara Aktivasi Group WhatsApp
        <p className="text-xl text-gray-700 leading-relaxed">
          <br />Setelah kamu mendapatkan <strong>Kode Aktivasi</strong> di email kamu, kamu dapat mengaktifkan WhatsApp kamu dengan cara sebagai berikut.
        </p>
      </h1>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">1. Copy Kode aktivasi kamu yang ada di email</h2>
        <p className="text-gray-700 leading-relaxed">
          Cek kotak masuk email terdaftarmu, <strong>Copy Kode Aktivasi</strong> yang ada.
        </p>

        <div className="mt-4">
          <Image
            src="/img10wa.png"
            alt="Tampilan menu Tambah Channel"
            width={400}
            height={200}
            className="rounded-lg border"
          /></div>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">2. Buka aplikasi WhatsApp</h2>
        <p className="text-gray-700 leading-relaxed">
          Install <strong>Aplikasi WhatsApp</strong> jika kamu belum menginstalnya.
        </p>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">3. Kirim pesan ke nomor wa catatin.ai</h2>
        <p className="text-gray-700 leading-relaxed">
          Kamu bisa langsung mengirim pesan <strong>ke 081118891092</strong>.
        </p>

         <div className="mt-4">
          <Image
            src="/img11wa.png"
            alt="Tampilan menu Tambah Channel"
            width={270}
            height={100}
            className="rounded-lg border"
          /></div>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">4. Gunakan Kode Aktivasi Kamu</h2>
        <p className="text-gray-700 leading-relaxed">
          Gunakan format <strong>/aktivasi [Kode Aktivasi]</strong>, contoh: /aktivasi 12345 
        </p>

         <div className="mt-4">
          <Image
            src="/img12wa.png"
            alt="Tampilan menu Tambah Channel"
            width={220}
            height={150}
            className="rounded-lg border"
          /></div>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2">5. Channel WhatsApp kamu sudah diaktivasi</h2>
        <p className="text-gray-700 leading-relaxed">
          Jika sudah ada notifikasi bahwa <strong>aktivasi berhasil</strong>, kamu sudah bisa mulai menggunakan layanan catatin.ai 
        </p>

         <div className="mt-4">
          <Image
            src="/img13wa.png"
            alt="Tampilan menu Tambah Channel"
            width={370}
            height={200}
            className="rounded-lg border"
          /></div>
      </section>
    </main>
  );
}
