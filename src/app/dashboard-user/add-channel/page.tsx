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
    <main className="min-h-screen bg-gradient-to-l from-white via-[#B2F7FF] to-[#80F2FF] text-slate-800 antialiased">
      <section className="pt-10 w-full bg-gradient-to-l from-white via-[#B2F7FF] to-[#80F2FF] text-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-16 md:py-20 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          
          {/* LEFT TEXT AREA */}
          <div className="flex-5 text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-4">
              <motion.img
                src="/buku.png"
                alt="Phone mockup"
                className="text-center w-[120px] z-10"
                animate={{ y: [0, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Cara simpel Nyatet tanpa repot. ✨
            </h2>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
              <br /><br />Langkah awal untuk memulai dengan telegram:<br /><br />
              1. Buat group telegram bareng "catatin.ai" (search).<br />
              2. Dapatkan kode aktivasi dengan klik tombol "add-group" (cek email).<br />
              3. Kirim kode aktivasi dari email ke group.<br />
              4. Jika balasan “berhasil”, lanjut undang siapapun ke group.<br />
              5. Kami bantu catat semua transaksimu.<br /><br />
            </p>

            <button
              onClick={() => setcreategroups(true)}
              className="px-6 py-3 rounded-full bg-[#05668D] text-white font-medium shadow hover:bg-blue-700"
            >
              add-group
            </button>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
              <br /><br />Langkah awal untuk memulai dengan whatsapp:<br /><br />
              1. Kirim pesan WA ke CS catatin.ai.<br />
              2. Dapatkan kode aktivasi dengan klik tombol "add-channel".<br />
              3. Kirim kode aktivasi dari email ke ai.<br />
              4. Jika balasan “berhasil”, kamu sudah bisa gunakan catatin.ai.<br />
              5. Kami bantu catat semua transaksimu.<br /><br />
            </p>

            <button
              onClick={() => setcreategroups(true)}
              className="px-6 py-3 rounded-full bg-[#05668D] text-white font-medium shadow hover:bg-blue-700"
            >
              add-WhatsApp
            </button>
          </div>


          
          {/* MODAL */}
          {creategroups && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
              <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Groups</h2>

                <form className="flex flex-col gap-4" onSubmit={submitAddGroup}>
                  

                  <input
                    value={modalgroupName}
                    onChange={(e) => setmodalgroupName(e.target.value)}
                    type="text"
                    className="border rounded-lg px-3 py-2"
                    placeholder="Group Name"
                  />

                  <select
                    value={modalgroupType}
                    onChange={(e) => setmodalgroupType(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="">-Type-</option>
                    <option value="Keluarga">Personal</option>
                    <option value="Bisnis">Bisnis</option>
                  </select>

                  <select
                    value={ModalChannel}
                    onChange={(e) => setModalChannel(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="">-Channel-</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Telegram">Whatsapp</option>
                  </select>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                      onClick={() => setcreategroups(false)}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
