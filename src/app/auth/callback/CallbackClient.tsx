"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";
  const token = searchParams.get("token");
  const dataParam = searchParams.get("data"); // data profil dari n8n (base64 encoded)

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const processLogin = async () => {
      try {
        // 🧩 Jika callback dari Google OAuth (via n8n)
        if (dataParam && token) {
          try {
            // Decode dari base64 (bukan decodeURIComponent)
            const decodedString = atob(dataParam);
            const decoded = JSON.parse(decodedString);

            console.log("Decoded Google data:", decoded);

            // Parse nama (Google return full name, bukan given_name/family_name)
            const nameParts = (decoded.name || "").split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            // Struktur data user yang konsisten
            const userData = {
              firstName: firstName,
              lastName: lastName,
              email: decoded.email || "",
              avatar: decoded.picture || "",
              googleId: decoded.googleId || "",
              verified: decoded.verified_email || false,
              createdAt: new Date().toISOString(),
              provider: "google",
            };

            console.log("Processed user data:", userData);

            // 🧠 Simpan user ke localStorage agar langsung login
            localStorage.setItem("user", JSON.stringify(userData));
            
            // Simpan token untuk autentikasi
            localStorage.setItem("authToken", token);

            setStatus("success");
            return;
          } catch (decodeError) {
            console.error("Error decoding Google data:", decodeError);
            setStatus("error");
            return;
          }
        }

        // 🧩 Jika callback pakai token verifikasi akun biasa (email verification)
        if (token && !dataParam) {
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
        console.error("No token or data found in callback");
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
      {status === "loading" && (
        <div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memverifikasi akun Anda...</p>
        </div>
      )}

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
          <p className="text-gray-500 mb-4">
            Silakan coba login kembali atau cek link aktivasi Anda.
          </p>
          <Link
            href="/auth/signin"
            className="px-6 py-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition"
          >
            Kembali ke Login
          </Link>
        </div>
      )}
    </div>
  );
}