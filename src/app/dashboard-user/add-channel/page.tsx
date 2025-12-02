"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import DatePicker from "@/components/form/date-picker";

export default function Home() {
  // ⬇️ Semua state HARUS berada di dalam komponen
  const [creategroups, setcreategroups] = useState(false);
  const [modalgroupType, setmodalgroupType] = useState<string>("");
  const [modalgroupName, setmodalgroupName] = useState<string>("");
  const [ModalChannel, setModalChannel] = useState<string>("");
  const [modalDate, setModalDate] = useState<string>("");

  /** Helper: format YYYY-MM-DD */
  function formatDateLocal(d: Date) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  /** Helper: parse YYYY-MM-DD → Date */
  function parseYMDToDate(ymd?: string | null) {
    if (!ymd) return undefined;
    const [y, m, d] = ymd.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  }

  const submitAddGroup = async (e: any) => {
    e.preventDefault();

    try {
      const userEmail =
        localStorage.getItem("user_email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;

      if (!userEmail) {
        alert("Email pengguna tidak ditemukan. Silakan login ulang.");
        return;
      }

      const payload = {
        date: modalDate,
        group_type: modalgroupType,
        group_name: modalgroupName,
        channel: ModalChannel,
        email: userEmail,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_ADDGROUP_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to save group");
        return;
      }

      alert("Group saved successfully");
      setcreategroups(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = () => setcreategroups(true);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-cyan-50 to-cyan-100 text-slate-800 antialiased">
      <section className="pt-16 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          
          {/* HEADER - Full Width di atas semua konten */}
          <div className="flex items-center gap-4 justify-center md:justify-start mb-16">
            <motion.img
              src="/buku.png"
              alt="Book illustration"
              className="w-[130px] drop-shadow-xl flex-shrink-0"
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
        
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Catat transaksi tanpa ribet, otomatis & simpel. ✨
            </h2>
          </div>

          {/* GRID CONTENT - Text Left & Video Right */}
          <div className="grid md:grid-cols-[2fr_1fr] gap-16 items-center">
            
            {/* LEFT TEXT AREA */}
            <div className="space-y-8">
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Mulai menggunakan <span className="font-bold bg-gradient-to-r from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent">
            catatin.ai
          </span> dengan cepat di <b>Telegram</b>:
                <br /><br />
                1. Buat grup Telegram dan tambahkan akun "catatin.ai".
                <br />2. Klik tombol "Add Group" untuk dapatkan kode aktivasi.
                <br />3. Kirim kode aktivasi ke dalam grup.
                <br />4. Setelah konfirmasi "berhasil", undang anggota lain.
                <br />5. Semua transaksi akan dicatat otomatis.
              </p>

              <button
                onClick={() => setcreategroups(true)}
                className="px-6 py-3 rounded-full bg-cyan-700 text-white font-medium shadow-md hover:bg-cyan-800 transition"
              >
                Add Group (Telegram)
              </button>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl pt-6">
                Mulai dengan <b>WhatsApp</b>:
                <br /><br />
                1. Chat CS catatin.ai melalui WhatsApp.
                <br />2. Klik "Add Channel" untuk mendapatkan kode.
                <br />3. Kirim kode tersebut ke AI.
                <br />4. Setelah konfirmasi "berhasil", layanan siap digunakan.
              </p>

              <button
                onClick={() => setcreategroups(true)}
                className="px-6 py-3 rounded-full bg-emerald-700 text-white font-medium shadow-md hover:bg-emerald-800 transition"
              >
                Add Channel (WhatsApp)
              </button>
            </div>

            {/* RIGHT VIDEO AREA */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative mx-auto md:mx-0 w-[220px] sm:w-[260px] md:w-[1800px] lg:w-[280px] rounded-[1.5rem] border-[6px] border-black overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-b-xl z-10"></div>
                <video
                  className="w-full h-full"
                  autoPlay
                  muted
                  playsInline
                  controls
                >
                  <source src="/cerah.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

          </div>
        </div>

        {/* MODAL */}
        {creategroups && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 space-y-6">
              <h2 className="text-2xl font-semibold">Tambah Group Baru</h2>

              <form className="flex flex-col gap-5" onSubmit={submitAddGroup}>
                <input
                  value={modalgroupName}
                  onChange={(e) => setmodalgroupName(e.target.value)}
                  type="text"
                  className="border border-slate-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Nama Group"
                />

                <select
                  value={modalgroupType}
                  onChange={(e) => setmodalgroupType(e.target.value)}
                  className="border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">Pilih Tipe</option>
                  <option value="Personal">Personal</option>
                  <option value="Bisnis">Bisnis</option>
                </select>

                <select
                  value={ModalChannel}
                  onChange={(e) => setModalChannel(e.target.value)}
                  className="border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">Pilih Channel</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Whatsapp">Whatsapp</option>
                </select>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-xl hover:bg-gray-100"
                    onClick={() => setcreategroups(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}