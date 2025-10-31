"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";
  const token = searchParams.get("token");
  const dataParam = searchParams.get("data"); // data profil dari n8n

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const processLogin = async () => {
      try {
        // 🧩 Jika callback dari Google OAuth (via n8n)
        if (dataParam) {
          const decoded = JSON.parse(decodeURIComponent(dataParam));

          // Simpan user ke localStorage
          localStorage.setItem("user", JSON.stringify(decoded));

          setStatus("success");
          return;
        }

        // 🧩 Jika callback pakai token verifikasi akun biasa
        if (token) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_N8N_VERIFY_ACCOUNT_URL}?token=${token}`,
            { cache: "no-store" }
          );

          if (!res.ok) throw new Error("Gagal verifikasi");
          const data = await res.json();

          if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setStatus("success");
          } else {
            setStatus("error");
          }
          return;
        }

        // Jika tidak ada data sama sekali
        setStatus("error");
      } catch (err) {
        console.error("Error di callback:", err);
        setStatus("error");
      }
    };

    processLogin();
  }, [token, dataParam]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      {status === "loading" && <p className="text-gray-600">Memverifikasi akun Anda...</p>}

      {status === "success" && (
        <div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">✅ Login berhasil!</h1>
          <p className="text-gray-500 mb-6">
            Klik tombol di bawah untuk melanjutkan ke pembayaran atau dashboard Anda.
          </p>
          <Link
            href={`/subscription?plan=${plan}&step=1`}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Lanjut ke Pembayaran →
          </Link>
        </div>
      )}

      {status === "error" && (
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">❌ Aktivasi/Login gagal</h1>
          <p className="text-gray-500">Silakan coba login kembali atau cek link aktivasi Anda.</p>
        </div>
      )}
    </div>
  );
}
