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

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      console.log("Response dari webhook:", data);

      // Pastikan output berupa string agar tidak error
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
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">AI Agent Demo</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Tulis pertanyaanmu di sini..."
        className="border rounded-lg p-2 w-80 h-24"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Kirim
      </button>

      {output && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg w-80 whitespace-pre-wrap">
          <strong>Jawaban AI:</strong>
          <p>{output}</p>
        </div>
      )}
    </main>
  );
}
