"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

   const N8N_FORGOT_PASSWORD_URL =
    process.env.NEXT_PUBLIC_N8N_FORGOT_PASSWORD_URL ||
    "https://n8n.srv1074739.hstgr.cloud/webhook/lupapassword";

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(N8N_FORGOT_PASSWORD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      if (!response.ok) {
        throw new Error(`Gagal mengirim email (${response.status})`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      // ✅ Berhasil kirim email reset
      if (
        (typeof data === "object" && data.success) ||
        (typeof data === "string" && data.toLowerCase().includes("sukses"))
      ) {
        setSuccessMsg(
          "Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam."
        );
        setEmail(""); // Clear form
      } else {
        setErrorMsg(
          typeof data === "string"
            ? data
            : data?.error || "Email tidak ditemukan atau terjadi kesalahan."
        );
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setErrorMsg("Tidak dapat terhubung ke server. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Lupa Password?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
            </p>
          </div>

          {successMsg && (
            <div className="mb-4 p-4 text-green-700 text-sm bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-md">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-4 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-md">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
                <Button
                  className="w-full"
                  size="sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : "Kirim Link Reset"}
                </Button>
              </div>

              <div className="text-center">
                <Link
                  href="/auth/dashboard-user/signin"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  ← Kembali ke halaman masuk
                </Link>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}
