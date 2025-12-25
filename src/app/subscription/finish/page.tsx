'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
export const dynamic = "force-dynamic";

export default function PaymentFinishPage() {
  const params = useSearchParams();
  const orderId = params.get("order_id");

  const [status, setStatus] = useState<PaymentStatus>("PENDING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/payment/status?order_id=${orderId}`);
        const data = await res.json();
        setStatus(data.status);
      } catch (err) {
        console.error("Failed to fetch payment status", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

  const renderContent = () => {
    if (loading) {
      return "Memeriksa status pembayaran...";
    }

    if (status === "SUCCESS") {
      return "Pembayaran Berhasil 🎉";
    }

    if (status === "FAILED") {
      return "Pembayaran Gagal ❌";
    }

    return "Menunggu Pembayaran ⏳";
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-bold">
          {renderContent()}
        </h1>

        <p className="text-gray-600">
          Halaman ini akan otomatis menampilkan status terbaru
          setiap kali diperiksa.
        </p>

        {status === "SUCCESS" && (
          <a
            href="/dashboard-user"
            className="inline-block mt-4 text-blue-600 underline"
          >
            Masuk ke Dashboard →
          </a>
        )}
      </div>
    </div>
  );
}
