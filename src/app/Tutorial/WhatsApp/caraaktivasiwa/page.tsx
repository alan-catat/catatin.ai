import Image from "next/image";      
      
 export default function aktivasiwa() {     
  return (
    <main className="text-left max-w-3xl p-6">
      <h1 className="text-3xl text-[#3c78d8] font-bold mb-6">
        Cara Aktivasi WhatsApp
      </h1>
      <p className="text-gray-700 leading-relaxed">
          Setelah kamu mendapatkan <strong>Kode Aktivasi</strong> di email kamu, kamu dapat mengaktifkan WhatsApp kamu dengan cara sebagai berikut.
        </p><br />

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2"><b>Step 1. Copy Kode aktivasi kamu yang ada di email</b></h2>
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
        <h2 className="text-xl font-medium mb-2"><b>Step 2. Buka aplikasi WhatsApp</b></h2>
        <p className="text-gray-700 leading-relaxed">
          Install <strong>Aplikasi WhatsApp</strong> jika kamu belum menginstalnya.
        </p>
      </section>

<section className="mb-10">
        <h2 className="text-xl font-medium mb-2"><b>Step 3. Kirim pesan ke nomor wa catatin.ai</b></h2>
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
        <h2 className="text-xl font-medium mb-2"><b>Step 4. Gunakan Kode Aktivasi Kamu</b></h2>
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
        <h2 className="text-xl font-medium mb-2"><b>Step 5. Channel WhatsApp kamu sudah diaktivasi</b></h2>
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