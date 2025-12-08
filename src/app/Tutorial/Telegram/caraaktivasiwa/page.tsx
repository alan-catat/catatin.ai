import Image from "next/image";      
      
 export default function aktivasitelgeram() {     
  return (
    <main className="text-left max-w-3xl p-6">
      <h1 className="text-3xl text-[#3c78d8] font-bold mb-6">
        Cara Aktivasi Group Telegram
      </h1>
<p className="text-gray-700 leading-relaxed">
          Setelah kamu mendapatkan <strong>Kode Aktivasi</strong> di email kamu, kamu dapat mengaktifkan group Telegram dengan cara sebagai berikut.
        </p><br />

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2"><b>Step 1. Copy Kode aktivasi kamu yang ada di email</b></h2>
        <p className="text-gray-700 leading-relaxed">
          Cek kotak masuk email terdaftarmu, <strong>Copy Kode Aktivasi</strong> yang ada.
        </p>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2"><b>Step 2. Buka aplikasi Telegram</b></h2>
        <p className="text-gray-700 leading-relaxed">
          Install <strong>Aplikasi Telegram</strong> jika kamu belum menginstalnya.
        </p>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2"><b>Step 3. Buat Group Telegram</b></h2>
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
        <h2 className="text-xl font-medium mb-2"><b>Step 4. Undang @catatinaibot</b></h2>
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
        <h2 className="text-xl font-medium mb-2"><b>Step 5. Masukan nama group yang mau kamu buat</b></h2>
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
        <h2 className="text-xl font-medium mb-2"><b>Step 6. Gunakan Kode Aktivasi Kamu</b></h2>
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
        <h2 className="text-xl font-medium mb-2"><b>Step 7. Group Telegram kamu sudah diaktivasi</b></h2>
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