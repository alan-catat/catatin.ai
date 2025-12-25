"use client";

import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link href="/convertin">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold bg-[#066D97] bg-clip-text text-transparent">
                convertin
              </span>
                </div>
                </Link>
                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      <Link
                        href="/convertin"
                        className="text-2l text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >
                        <b>← Kembali ke halaman utama</b>
                      </Link>
                    </p>
              </div>
            </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 leading-relaxed">

        <h1 className="text-3xl font-bold mb-2 text-center">Syarat dan Ketentuan – Catatin.ai</h1>
        <p className="text-center mb-8 text-sm text-gray-600">
          Terakhir diperbarui: 24 Desember 2025
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Penerimaan Syarat</h2>
        <p>
            Dengan mengakses dan menggunakan aplikasi <b>convertin</b>, Anda menyetujui dan terikat oleh Syarat &
             Ketentuan ini. Jika Anda tidak setuju, harap <b>tidak menggunakan</b> layanan ini.
          </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Definisi</h2>
        <ul className="list-disc pl-6">
          <li><b>convertin</b> berarti aplikasi dan layanan konversi file yang disediakan oleh PT MONIVO GLOBAL 
            TEKNOLOGI, baik melalui web maupun aplikasi mobile.
          </li>
          <li>
            <b>Pengguna</b> berarti setiap individu atau badan hukum yang menggunakan layanan convertin.
          </li>
          <li>
            <b>Layanan</b> berarti seluruh fitur, fungsi, konten, konversi file, dan alat lain yang tersedia 
            melalui convertin.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Ruang Lingkup Layanan</h2>
        <p>convertin menyediakan layanan untuk <b>mengunggah dan mengkonversi file digital</b> dari satu format 
          ke format lain sesuai fitur yang tersedia. convertin berhak mengubah, menambah, atau menghentikan fitur/layanan kapan saja tanpa pemberitahuan sebelumnya.
</p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Pendaftaran dan Akun</h2>
        <ul className="list-disc pl-6">
          <li>
            Pengguna wajib memberikan informasi yang <b>benar, lengkap, dan terkini</b> saat mendaftar.
          </li>
          <li>
            Pengguna bertanggung jawab atas keamanan akun, termasuk kredensial, akses, serta aktivitas yang terjadi melalui akunnya.
          </li>
          <li>
            convertin berhak menghentikan atau menangguhkan akun jika terdapat pelanggaran terhadap Ketentuan ini.
            </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Penggunaan yang Diperbolehkan</h2>
        <ul className="list-disc pl-6">
          <li>Pengguna hanya boleh mengunggah konten yang <b>miliknya sendiri atau sudah memiliki izin</b> untuk diproses.</li>
          <li>
            Layanan hanya boleh digunakan untuk tujuan <b>legal dan sesuai hukum yang berlaku</b>.
          </li>
          <li>
            convertin <b>tidak bertanggung jawab</b> atas penggunaan konten oleh pengguna yang melanggar hak pihak ketiga atau hukum setempat.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Larangan dan Batasan</h2>
        <p>Pengguna dilarang:</p>
        <ul className="list-disc pl-6">
          <li>Mengunggah, menyimpan, atau memproses file yang melanggar hukum atau hak cipta pihak lain.</li>
          <li>Menggunakan layanan untuk tujuan yang merugikan pihak lain atau merusak sistem convertin.</li>
          <li>
            Melakukan kegiatan meretas (hacking), mengganggu keamanan, atau mencoba menembus sistem convertin.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Privasi dan Data</h2>
        <ul className="list-disc pl-6">
          <li>
            convertin akan menyimpan file sementara untuk <b>diproses</b> dan kemudian menghapusnya sesuai kebijakan internal (misalnya dalam jangka waktu tertentu).
            </li>
          <li>
            Penggunaan data akan mengikuti <b>Kebijakan Privasi</b> kami, yang merupakan bagian terpisah namun terikat dengan dokumen ini.
          </li>
          <li>convertin berhak menggunakan data anonim untuk pengembangan fitur, analisis performa, dan peningkatan kualitas layanan.
</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">8. Biaya dan Pembayaran</h2>
        <ul className="list-disc pl-6">
          <li>
           convertin mungkin menyediakan layanan gratis dan/atau berbayar.
          </li>
          <li>
            Paket berbayar (jika ada) harus dibayar sesuai harga dan metode pembayaran yang berlaku.
          </li>
          <li>Pembayaran tidak dapat dikembalikan kecuali diwajibkan oleh hukum yang berlaku.
        </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">9. Hak Kekayaan Intelektual</h2>
        <ul className="list-disc pl-6">
          <li>
           Seluruh hak cipta, merek, desain, dan konten aplikasi convertin adalah milik convertin atau pemberi lisensinya.
          </li>
          <li>
            Pengguna tidak diperkenankan menyalin, memodifikasi, atau mendistribusikan konten convertin tanpa izin tertulis.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">10. Batasan Tanggung Jawab</h2>
        <ul className="list-disc pl-6">
          <li>
           convertin menyediakan layanan <b>“sebagaimana adanya”</b> tanpa jaminan tersurat atau tersirat terkait ketersediaan, keakuratan, atau kelengkapan hasil konversi.
         </li>
          <li>
            convertin <b>tidak bertanggung jawab atas kerugian langsung maupun tidak langsung</b> akibat penggunaan layanan.
        </li>
        </ul>

         <h2 className="text-xl font-semibold mt-8 mb-2">11. Penghentian Akses</h2>
        <p>
         convertin berhak menghentikan, menangguhkan, atau membatasi akses pengguna jika dianggap melanggar Ketentuan ini.
       </p>

         <h2 className="text-xl font-semibold mt-8 mb-2">12. Perubahan Ketentuan</h2>
        <p>
          convertin dapat mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan <b>ditampilkan pada aplikasi</b> atau melalui pemberitahuan lain. Penggunaan layanan setelah perubahan berarti Anda telah menyetujui
            versi terbaru.
           </p>

         <h2 className="text-xl font-semibold mt-8 mb-2">13. Hukum yang Berlaku dan Penyelesaian Sengketa</h2>
        <p>
          Syarat ini tunduk pada <b>hukum Republik Indonesia</b>. Sengketa akan diselesaikan melalui jalur hukum yang berlaku di Indonesia.
        </p>

         <h2 className="text-xl font-semibold mt-8 mb-2">14. Kontak</h2>
        <p>
          Untuk pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi:
          <br />
          📧 <b>Email: </b><a href="mailto:contact@catatin.ai" className="text-blue-600 underline">contact@catatin.ai</a>
        </p>
      </section>

      <footer className="bg-slate-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            
            <div>© PT. Monivo Global Teknologi · All rights reserved (2025)</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
