"use client";

import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBCHAT_URL;

    if (!webhookUrl) {
      console.error("❌ Webhook URL tidak ditemukan di .env.local");
      setOutput("Konfigurasi webhook belum diset di server.");
      return;
    }

    // 1. Ambil email dulu (sebelum fetch)
    const userEmail =
      localStorage.getItem("user_email") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.email;

    if (!userEmail) {
      alert("Email pengguna tidak ditemukan.");
      return; // HENTIKAN agar fetch tidak dikirim
    }

    try {
      // 2. Baru fetch ke webhook
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          email: userEmail, // sekalian kirim email kalau kamu butuh
        }),
      });

      const data = await res.json();
      console.log("Response dari webhook:", data);

      const message =
        typeof data.message === "string"
          ? data.message
          : data.message?.content ||
            JSON.stringify(data.message, null, 2) ||
            "Tidak ada pesan dari server.";

      setOutput(message);
    } catch (error) {
      console.error("Fetch error:", error);
      setOutput("Terjadi kesalahan saat menghubungi server.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
  <div className="w-full max-w-[600px] flex flex-col items-center">
    <h1 className="text-3xl font-extrabold bg-gradient-to-r  from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent tracking-wide">catatin.ai
    </h1>
    <h2 className="text-2xl font-bold bg-gradient-to-r mb-6 from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent">Agent</h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Tulis pertanyaanmu di sini..."
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded-lg p-4 w-full max-w-[500px] h-[240px]"
      />

      <button
  onClick={handleSubmit}
  className="mt-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition text-white px-5 dark:shadow-none
 py-3 rounded-xl text-lg shadow w-full max-w-[200px]"
>
  Kirim
</button>


    <div className="animate-fade-in">
      {output && (
        <div className="animate-fade-in mt-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl text-gray-800 dark:text-gray-200 w-full max-w-[500px] text-base sm:text-lg whitespace-pre-wrap shadow-md">
          <strong className="font-semibold text-xl text-gray-900 dark:text-gray-100">Jawaban AI:</strong>
          <p>{output}</p>
        </div>
      )}
      </div>
      </div>
    </main>
  );
}
