export const dynamic = "force-dynamic";
'use client';

import { useSearchParams } from "next/navigation";

export default function PaymentFinishPage() {
  const params = useSearchParams();
  const status = params.get("status");

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-2xl font-bold">
          {status === "failed"
            ? "Pembayaran Gagal ❌"
            : "Pembayaran Diproses ⏳"}
        </h1>
        <p className="mt-2 text-gray-600">
          Status pembayaran akan diperbarui otomatis.
          Silakan cek dashboard Anda.
        </p>
      </div>
    </div>
  );
}
