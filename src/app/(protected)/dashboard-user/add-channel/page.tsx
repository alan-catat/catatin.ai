"use client";

import { motion } from "framer-motion";
import { useEffect, useState, FormEvent, useRef } from "react";
import DatePicker from "@/components/form/date-picker";
import * as React from "react";
import Link from "next/link";
import { TelegramIcon, WhatsAppIcon } from "@/components/icons/icons";
  
const N8N_BASE = process.env.NEXT_PUBLIC_N8N_BASE_URL || "https://n8n.srv1074739.hstgr.cloud";
const N8N_ADDGROUP_URL = `${N8N_BASE}/webhook/addgroup`;
const N8N_GETGROUPS_URL = `${N8N_BASE}/webhook/get-groups`;

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
  onClick={() => {
    setModalChannel("telegram");
    setcreategroups(true);
    setmodalgroupName("");
    setmodalgroupType("");
    setActivationCode("");
    setIsActivated(false);
  }}
  className="px-3 py-2 rounded-lg bg-cyan-700 text-white text-sm hover:bg-cyan-800 transition"
>
  Tambah
</button>
        <Link
          href="/Tutorial/Telegram/cara-membuat-group-telegram"
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
  onClick={() => {
    setModalChannel("whatsapp");
    setcreategroups(true);
    setmodalgroupName(""); // pastikan kosong
    setmodalgroupType("");
    setActivationCode("");
    setIsActivated(false);
  }}
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
  const [activationCode, setActivationCode] = useState("");
  const [loadingActivation, setLoadingActivation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
    const [groups, setGroups] = useState<any[]>([]);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  setToast({ show: true, message, type });
  setTimeout(() => {
    setToast({ show: false, message: '', type: 'success' });
  }, 3000); // Hilang setelah 3 detik
};

const fetchGroups = async () => {
  try {
    const userEmail =
      localStorage.getItem("user_email") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.email;
    
    if (!userEmail) {
      console.log("No user email found");
      return;
    }

    console.log("=== FETCHING GROUPS ===");
    console.log("userEmail:", userEmail);

    const res = await fetch(N8N_GETGROUPS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });

    if (!res.ok) {
      console.error(`Fetch groups failed with status ${res.status}`);
      return;
    }

    const data = await res.json();
    
    // === DEBUG LOG ===
    console.log("=== GROUPS DATA RECEIVED ===");
    console.log("Type:", typeof data);
    console.log("Is Array:", Array.isArray(data));
    console.log("Length:", data?.length);
    console.log("Raw data:", data);
    
    if (Array.isArray(data) && data.length > 0) {
      console.log("=== FIRST GROUP SAMPLE ===");
      console.log("Keys:", Object.keys(data[0]));
      console.log("Values:", data[0]);
      
      // Cek apakah ada field group_name
      console.log("Has group_name?", "group_name" in data[0]);
      console.log("group_name value:", data[0].group_name);
    }
    
    if (Array.isArray(data)) {
      setGroups(data);
    }
  } catch (err) {
    console.error("Error fetching groups:", err);
  }
};

  const checkAndGenerateActivation = async (email: string, channel: string) => {
    if (!email || !channel) {
      console.log("Email atau channel kosong");
      return;
    }
    
    if (!modalgroupType) {
      showToast("Pilih tipe grup terlebih dahulu", "error");
      return;
    }
    
    if (channel === "telegram" && !modalgroupName) {
      showToast("Nama grup wajib diisi untuk Telegram", "error");
      return;
    }
    
    setLoadingActivation(true);
    
    try {
      const payload = {
        action: "check_activation",
        email: email,
        channel: channel.toLowerCase(),
        group_type: modalgroupType,
        group_name: channel === "telegram" ? modalgroupName : "",
      };
      
      console.log("=== GENERATE KODE AKTIVASI ===");
      console.log("Payload:", JSON.stringify(payload, null, 2));
      
      const res = await fetch(N8N_ADDGROUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Request failed:", errorText);
        showToast("Gagal proses aktivasi: " + errorText, "error");
        return;
      }
  
      const responseText = await res.text();
      console.log("Raw response:", responseText);
      
      if (!responseText || responseText.trim() === "") {
        showToast("Webhook mengembalikan response kosong", "error");
        return;
      }
  
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Parsed data:", data);
      } catch (parseErr) {
        console.error("Parse error:", parseErr);
        showToast("Response bukan format JSON yang valid", "error");
        return;
      }
      
      // ✅ Handle Error Response
      if (data?.error || data?.status === "error") {
        const errorMsg = data.error || data.message || "Terjadi kesalahan";
        console.warn("Error from webhook:", errorMsg);
        showToast(errorMsg, "error");
        setIsActivated(false);
        setActivationCode("");
        return;
      }
      
      // ✅ Handle Success Response - Array
      if (Array.isArray(data) && data.length > 0) {
        const record = data[0];
        
        console.log("Record:", record);
        console.log("aktivasi-code:", record["aktivasi-code"]);
        
        const activationCode = record["aktivasi-code"];
        
        // ✅ Validasi kode aktivasi ada
        if (!activationCode) {
          showToast("⚠️ Kode aktivasi tidak ditemukan dalam response", "error");
          return;
        }
        
        setActivationCode(activationCode);
        
        // Cek apakah sudah aktivasi (opsional, tergantung response)
        const status = record.status || "";
        const chatId = record.chat_id || "";
        const isActive = status.toLowerCase() === "active" || 
                         status.toLowerCase() === "activated" || 
                         !!chatId;
        
        setIsActivated(isActive);
        
        if (isActive) {
          showToast(`✅ ${channel} sudah teraktivasi sebelumnya!`, "success");
        } else {
          showToast(`✅ Kode aktivasi berhasil dibuat: ${activationCode}`, "success");
        }
        
        return; // ✅ PENTING: Return setelah berhasil
      }
      
      // ✅ Fallback jika format tidak sesuai
      console.warn("Unexpected response format:", data);
      showToast("Format response tidak sesuai", "error");
      
    } catch (err) {
      console.error("Fatal error:", err);
      showToast("Error: " + (err as Error).message, "error");
    } finally {
      setLoadingActivation(false);
    }
  };
  
  const handleChannelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChannel = e.target.value;
    setModalChannel(selectedChannel);
    
    // Reset nama grup untuk Whatsapp
    if (selectedChannel === "whatsapp") {
      setmodalgroupName("");
    }
    
    // Reset activation state
    setIsActivated(false);
    setActivationCode("");
  };
  
    const submitAddGroup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const userEmail = localStorage.getItem("user_email") || 
      JSON.parse(localStorage.getItem("user") || "{}")?.email;
  
    if (!userEmail) {
      showToast("Email tidak ditemukan. Silakan login ulang.", "error");
      return;
    }
  
    if (!ModalChannel) {
      showToast("Channel wajib diisi.", "error");
      return;
    }
  
    if (!modalgroupType) {
      showToast("Tipe wajib diisi.", "error");
      return;
    }
  
    if (ModalChannel === "Telegram" && !modalgroupName) {
      showToast("Nama Grup wajib diisi untuk Telegram.", "error");
      return;
    }
  
    if (!activationCode) {
      showToast("Generate kode aktivasi terlebih dahulu.", "error");
      return;
    }
  
    try {
      setIsLoading(true);
  
      const payload = {
        action: "add_group",
        group_type: modalgroupType,
        group_name: ModalChannel === "Whatsapp" ? "" : modalgroupName,
        channel: ModalChannel,
        email: userEmail,
        "aktivasi-code": activationCode,
      };
      
      console.log("=== ADD GROUP PAYLOAD ===");
      console.log(JSON.stringify(payload, null, 2));
      
      const response = await fetch(N8N_ADDGROUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      console.log("Response status:", response.status);
  
      if (response.ok) {
        showToast("Group berhasil disimpan! Silakan kirim kode aktivasi ke bot.", "success");
        
        // ✅ Modal TETAP TERBUKA agar user bisa kirim kode
        // User harus klik "Tutup" manual setelah kirim kode
        
        setTimeout(fetchGroups, 1000);
        
      } else {
        const errorText = await response.text();
        console.error("Add group failed:", errorText);
        showToast(`Gagal: ${response.status} - ${errorText}`, "error");
      }
  
    } catch (err: any) {
      console.error("Add group error:", err);
      
      if (err.name === 'AbortError') {
        showToast("Request timeout", "error");
      } else if (err.message.includes('Failed to fetch')) {
        showToast("Tidak bisa koneksi ke webhook", "error");
      } else {
        showToast("Error: " + err.message, "error");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

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
          
        {/* MODAL ADD GROUP */}
{creategroups && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Tambah Channel</h2>

      <form className="flex flex-col gap-4" onSubmit={async (e) => {
        e.preventDefault();
        
        const userEmail = localStorage.getItem("user_email") || 
          JSON.parse(localStorage.getItem("user") || "{}")?.email;
        
        if (!userEmail) {
          showToast("Email tidak ditemukan. Silakan login ulang.", "error");
          return;
        }
        
        if (!ModalChannel) {
          showToast("Pilih channel terlebih dahulu", "error");
          return;
        }
        
        if (ModalChannel === "telegram" && !modalgroupName) {
          showToast("Nama grup wajib diisi untuk Telegram", "error");
          return;
        }
        
        if (!modalgroupType) {
          showToast("Pilih tipe grup terlebih dahulu", "error");
          return;
        }
        
        await checkAndGenerateActivation(userEmail, ModalChannel);
      }}>
        <div className="text-sm font-medium">
  Channel:{" "}
  <span className="font-semibold capitalize">
    {ModalChannel}
  </span>
</div>
        {ModalChannel === "telegram" && (
  <input 
    value={modalgroupName} 
    onChange={(e) => setmodalgroupName(e.target.value)} 
    type="text" 
    className="border rounded-lg px-3 py-2" 
    placeholder="Nama Grup *" 
    required
  />
)}

        
        <select 
          value={modalgroupType} 
          onChange={(e) => setmodalgroupType(e.target.value)} 
          className="border rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          required={ModalChannel !== "whatsapp"}
        >
          <option value="">-Tipe- *</option>
          <option value="personal">Personal</option>
          <option value="pasangan">Pasangan</option>
          <option value="keluarga">Keluarga</option>
        </select>
        
        <div className="flex justify-end gap-2 mt-4">
          <button 
            type="button" 
            className="px-4 py-2 border rounded-lg hover:bg-gray-100" 
            onClick={() => {
              setcreategroups(false);
              // Reset form
              setModalChannel("");
              setmodalgroupName("");
              setmodalgroupType("");
              setActivationCode("");
              setIsActivated(false);
            }}
          >
            Tutup
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loadingActivation}
          >
            {loadingActivation ? "Generating..." : "Aktivasi"}
          </button>
        </div>

        {/* Pop-up Aktivasi - SELALU TAMPIL */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {!isActivated ? (
            <div className="text-sm">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Kode Aktivasi:
              </p>
              <div className="relative">
                <code className="block bg-white dark:bg-gray-900 p-3 pr-12 rounded border border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 font-mono">
                  /aktivasi {activationCode || ""}
                </code>
                
                {/* Button Copy - Muncul jika ada kode */}
                {activationCode && (
                  <button
                    type="button"
                    onClick={() => {
                      const textToCopy = `/aktivasi ${activationCode}`;
                      navigator.clipboard.writeText(textToCopy).then(() => {
                        showToast("✅ Kode berhasil disalin!", "success");
                      }).catch(() => {
                        showToast("❌ Gagal menyalin kode", "error");
                      });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Copy kode"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Kirim kode ini untuk mengaktifkan channel
              </p>
              
              {/* Button Kirim - Hanya muncul jika ada kode */}
              {activationCode && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      const message = encodeURIComponent(`/aktivasi ${activationCode}`);
                      if (ModalChannel === "telegram") {
                        window.open(`https://t.me/share/url?text=${message}`, '_blank');
                      } else if (ModalChannel === "whatsapp") {
                        window.open(`https://wa.me/?text=${message}`, '_blank');
                      }
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                      ModalChannel === "telegram" 
                        ? "bg-blue-500 hover:bg-blue-600" 
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={!ModalChannel}
                  >
                    {ModalChannel === "telegram" ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                        </svg>
                        Kirim ke Telegram
                      </>
                    ) : ModalChannel === "whatsapp" ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Kirim ke WhatsApp
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        Pilih Channel Terlebih Dahulu
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">Anda sudah aktivasi</span>
            </div>
          )}
        </div>
      </form>
    </div>
  </div>
)}
      </section>
    </main>
    
  );
}