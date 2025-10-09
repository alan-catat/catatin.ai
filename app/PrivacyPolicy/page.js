"use client";

import Header from "./Header";
import Footer from "./Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white text-slate-800 antialiased py-20">
      <Header />

      <section className="max-w-3xl mx-auto px-6 py-12 leading-relaxed">
        <h1 className="text-3xl font-bold mb-2 text-center">Kebijakan Privasi – Catatin.ai</h1>
        <p className="text-center mb-8 text-sm text-gray-600">
          Terakhir diperbarui: 28 Agustus 2025
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Informasi yang Kami Kumpulkan</h2>
        <ul className="list-disc pl-6">
          <li><strong>Informasi Akun:</strong> nama, email, dan detail pendaftaran lainnya.</li>
          <li><strong>Data Transaksi:</strong> salinan nota, catatan teks, suara, atau gambar yang diunggah pengguna.</li>
          <li><strong>Data Teknis:</strong> informasi perangkat, sistem operasi, log aktivitas, dan alamat IP.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Cara Kami Menggunakan Informasi</h2>
        <ul className="list-disc pl-6">
          <li>Memproses dan merekap data transaksi pengguna.</li>
          <li>Menyediakan fitur ekspor data dan integrasi akuntansi.</li>
          <li>Melakukan backup data di server kami.</li>
          <li>Mengembangkan dan meningkatkan layanan.</li>
          <li>Melakukan analisis data anonim untuk riset, statistik, dan keperluan komersial.</li>
          <li>
            Tidak menggunakan data pengguna untuk iklan pihak ketiga tanpa izin eksplisit dari pengguna.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Penyimpanan dan Keamanan Data</h2>
        <ul className="list-disc pl-6">
          <li>
            Data disimpan dengan standar keamanan wajar, termasuk enkripsi dan pembatasan akses internal.
          </li>
          <li>
            Data disimpan selama akun aktif dan maksimal 2 tahun setelah penutupan akun, kecuali diwajibkan
            oleh hukum untuk disimpan lebih lama.
          </li>
          <li>
            Jika kami menggunakan layanan cloud pihak ketiga, data dapat diproses di server luar negeri dengan
            tetap menjaga kepatuhan terhadap hukum yang berlaku.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Berbagi Data dengan Pihak Ketiga</h2>
        <ul className="list-disc pl-6">
          <li>Kami tidak menjual data pribadi pengguna.</li>
          <li>
            Kami dapat membagikan data yang telah <em>dianonimkan</em> dan <em>diagregasi</em> kepada pihak ketiga untuk
            keperluan riset pasar atau analisis bisnis.
          </li>
          <li>
            Kami dapat membagikan data jika diwajibkan oleh hukum atau dalam konteks transaksi korporasi
            (seperti merger atau akuisisi).
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Hak Pengguna</h2>
        <ul className="list-disc pl-6">
          <li>Mengakses dan mengunduh data pribadi mereka.</li>
          <li>Memperbaiki data yang tidak akurat.</li>
          <li>Meminta penghapusan data pribadi.</li>
          <li>Menarik persetujuan penggunaan data.</li>
          <li>Menolak pemrosesan data tertentu.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Penggunaan oleh Anak di Bawah Umur</h2>
        <p>
          Catatin.ai dapat digunakan oleh semua kalangan. Namun, pengguna di bawah usia 18 tahun disarankan
          menggunakan aplikasi dengan bimbingan orang tua atau wali untuk memastikan pemahaman yang tepat.
          Kami berkomitmen melindungi data pribadi semua pengguna sesuai hukum yang berlaku.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Perubahan Kebijakan Privasi</h2>
        <p>
          Setiap perubahan terhadap kebijakan privasi ini akan diumumkan melalui aplikasi atau melalui email
          yang terdaftar pada akun pengguna.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">8. Hukum dan Penyelesaian Sengketa</h2>
        <p>
          Kebijakan ini tunduk pada hukum <strong>Republik Indonesia</strong>.  
          Sengketa yang timbul akan diselesaikan melalui <strong>Badan Arbitrase Nasional Indonesia (BANI)</strong> atau
          <strong> Pengadilan Negeri Jakarta Selatan</strong>.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">9. Kontak</h2>
        <p>
          Untuk pertanyaan atau permintaan terkait kebijakan privasi ini, silakan hubungi kami melalui:
          <br />
          📧 <a href="mailto:contact@catatin.ai" className="text-blue-600 underline">contact@catatin.ai</a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
