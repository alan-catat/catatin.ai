'use client';

import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

function PaymentFinishContent() {
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

export default function PaymentFinishPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    }>
      <PaymentFinishContent />
    </Suspense>
  );
}