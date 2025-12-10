"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import DatePicker from "@/components/form/date-picker";
import Link from "next/link";
import { TelegramIcon, WhatsAppIcon } from "@/components/icons/icons";

  
export default function Home() {
  const channel = [
  {
    icon: TelegramIcon,
    title: "Telegram",
    description: "Silakan buat dan aktifkan grup Telegram Anda untuk memulai berbagi struk belanja, teks, maupun audio dengan para anggota. Buat grup baru di Telegram, tambahkan anggota yang diperlukan, dan gunakan grup tersebut sesuai kebutuhan komunikasi Anda.",
    color: "text-success",
    button: (
      <div className="flex space-x-4">
        <button
          onClick={() => setcreategroups(true)}
          className="px-3 py-2 rounded-lg bg-cyan-700 text-white text-sm hover:bg-cyan-800 transition"
        >
          Tambah
        </button>
        <Link
          href="/Tutorial/WhatsApp/cara-registrasi-whatsapp"
          className="px-12 py-2 text-brand-500 hover:text-brand-600 dark:text-brand-400 transition"
        >
          Petunjuk
        </Link>
      </div>
      
    )
  },

  {
    icon: WhatsAppIcon,
    title: "WhatsApp",
    description: "Silakan aktifkan nomor WhatsApp Anda untuk mulai berbagi struk belanja, teks, maupun audio sesuai kebutuhan pribadi, keluarga, atau bisnis.",
    color: "text-success",
    button: (
      <div className="flex space-x-4">
        <button
          onClick={() => setcreategroups(true)}
          className="px-3 py-2 rounded-lg bg-emerald-700 text-white text-sm hover:bg-emerald-800 transition"
        >
          Tambah
        </button>
        <Link
          href="/Tutorial/WhatsApp/cara-registrasi-whatsapp"
          className="px-12 py-2 text-brand-500 hover:text-brand-600 dark:text-brand-400 transition"
        >
          Petunjuk
        </Link>
      </div>
    )
  }
];

  // ⬇️ Semua state HARUS berada di dalam komponen
  const [creategroups, setcreategroups] = useState(false);
  const [modalgroupType, setmodalgroupType] = useState<string>("");
  const [modalgroupName, setmodalgroupName] = useState<string>("");
  const [ModalChannel, setModalChannel] = useState<string>("");
  const [modalDate, setModalDate] = useState<string>("");

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
    <main className="min-h-screen bg-white text-slate-800 antialiased
    dark:bg-[#2e2e2e] dark:from-[#2e2e2e] dark:via-[#2e2e2e] dark:to-[#2e2e2e]">
      <section className="pt-16 w-full">
          
            <div className="space-y-15">
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Aktivasi segera Channel kamu:
               </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch sm:max-w-5xl">

  {channel.map((item, index) => (
    <div
      key={index}
      className="group p-8 rounded-2xl bg-white dark:bg-[#2e2e2e] border-l-8 border-l-success 
                 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-5">
        
        <div className="flex items-start gap-6 w-full">
  
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-100">
            <item.icon className={`w-7 h-7 ${item.color}`} />
          </div>

          <div className="flex-1 grid grid-rows-[auto_1fr_auto] gap-2">
  <h3 className="text-xl font-semibold">{item.title}</h3>

            <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed 
   min-h-[80px] sm:min-h-[100px] md:min-h-[140px] lg:min-h-[140px]">
     {item.description}
            </p>

            <div className="mt-6 flex gap-3 flex-wrap">
              <b>{item.button}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
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