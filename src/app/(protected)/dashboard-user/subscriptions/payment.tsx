"use client";

import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { useState, useMemo } from "react";

const N8N_BASE_URL = "https://n8n.srv1074739.hstgr.cloud/webhook";

type ToastType = "success" | "error" | "info";

type PaymentModalProps = {
  open: boolean;
  onClose: () => void;

  planId: string;
  planName: string;
  harga: number;
  email: string;
};

export default function PaymentModal({
  open,
  onClose,
  planId,
  planName,
  harga,
  email,
}: PaymentModalProps) {
  if (!open) return null;

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handlePay = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${N8N_BASE_URL}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          email,
          plan: planName,
          amount: finalHarga,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Gagal membuat transaksi", "error");
        return;
      }

      if (!window.snap) {
        showToast("Midtrans belum siap", "error");
        return;
      }

      window.snap.pay(data.snapToken, {
        onSuccess: () => {
          showToast("Pembayaran berhasil 🎉", "success");
          onClose();
        },
        onPending: () => {
          showToast("Menunggu pembayaran", "info");
        },
        onError: () => {
          showToast("Pembayaran gagal", "error");
        },
        onClose: () => {
          showToast("Popup pembayaran ditutup", "info");
        },
      });
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan pembayaran", "error");
    } finally {
      setLoading(false);
    }
  };

  const finalHarga = useMemo(() => {
  if (!harga || !planName) return 0;

  const isAnnual =
    planName.toLowerCase().includes("tahunan") ||
    planName.toLowerCase().includes("annual");

  return isAnnual ? Math.round(harga * 0.8) : harga;
}, [harga, planName]);


  return (
    <>
      {/* Midtrans Snap */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

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
              Konfirmasi Pembayaran
            </h2>

            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p>
                <b>Paket:</b> {planName}
              </p>
              <p>
  <b>Total:</b>{" "}
  Rp {finalHarga > 0 ? finalHarga.toLocaleString("id-ID") : "-"}
</p>

{planName.toLowerCase().includes("tahunan") && (
  <p className="text-xs text-green-600">
    Termasuk diskon 20% paket tahunan 🎉
  </p>
)}

              <p className="text-xs text-gray-500">
                Anda akan diarahkan ke halaman pembayaran Midtrans
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2 border rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handlePay}
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
              >
                {loading ? "Memproses..." : "Lanjutkan Pembayaran"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999]">
          <div
            className={`px-4 py-2 rounded-lg text-white shadow-lg ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}
