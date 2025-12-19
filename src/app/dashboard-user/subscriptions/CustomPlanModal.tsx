"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  email: string;
};

const N8N_BASE_URL = "https://n8n.s.hstgr.cloud/webhook";

export default function CustomPlanModal({
  open,
  onClose,
  userId,
  email,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [chat, setChat] = useState("");
  const [channel, setChannel] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch(`${N8N_BASE_URL}/custom-plan-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email,
          estimatedChat: chat,
          channel,
          note,
        }),
      });

      alert("Permintaan paket custom berhasil dikirim 🙌");
      onClose();
    } catch (err) {
      alert("Gagal mengirim permintaan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        >
          <h2 className="text-lg font-bold mb-4">
            Ajukan Paket Custom
          </h2>

          <div className="space-y-3 mb-6 text-sm">
            <input
              placeholder="Perkiraan jumlah chat / bulan"
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            <input
              placeholder="Channel yang dibutuhkan (WA, Telegram, dll)"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            <textarea
              placeholder="Catatan tambahan"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Mengirim..." : "Kirim Permintaan"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
