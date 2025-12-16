"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import EyeIcon from "@/icons/EyeIcon";
import EyeCloseIcon from "@/icons/EyeCloseIcon";
import Link from "next/link";

type SignInFormProps = {
  redirectTo: string;
};

export default function SignInForm({ redirectTo }: SignInFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // URL webhook n8n untuk login
  const N8N_SIGNIN_URL =
    process.env.NEXT_PUBLIC_N8N_SIGNIN_URL ||
    "https://your-n8n-domain.com/webhook/signin";
    
  const WEBHOOK_GOOGLE = process.env.NEXT_PUBLIC_N8N_GOOGLE_SIGNIN_URL!;
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(N8N_SIGNIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });

      if (!response.ok) {
        throw new Error(`Gagal login (${response.status})`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      // ✅ LOGIN BERHASIL (respon object)
      if (typeof data === "object" && data.success && data.user) {
        // Simpan session
        localStorage.setItem("user_email", data.user.email);
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ REMEMBER ME: Simpan credentials jika checkbox dicentang
        if (isChecked) {
          localStorage.setItem("remembered_email", email.toLowerCase());
          // Simpan password (encode base64 untuk sedikit keamanan)
          localStorage.setItem("remembered_password", btoa(password));
        } else {
          // Hapus jika tidak dicentang
          localStorage.removeItem("remembered_email");
          localStorage.removeItem("remembered_password");
        }

        setTimeout(() => router.push(redirectTo || "/dashboard-user/profile"), 200);
        return;
      }

      // ✅ LOGIN BERHASIL (respon plain text)
      if (typeof data === "string" && data.toLowerCase().includes("sukses")) {
        localStorage.setItem("user_email", email.toLowerCase());
        localStorage.setItem("user", JSON.stringify({ email: email.toLowerCase() }));

        // ✅ REMEMBER ME
        if (isChecked) {
          localStorage.setItem("remembered_email", email.toLowerCase());
          localStorage.setItem("remembered_password", btoa(password));
        } else {
          localStorage.removeItem("remembered_email");
          localStorage.removeItem("remembered_password");
        }

        setTimeout(() => router.push(redirectTo || "/dashboard-user/profile"), 200);
        return;
      }

      // ❌ LOGIN GAGAL
      setErrorMsg(
        typeof data === "string"
          ? data
          : data?.error || "Email atau password salah."
      );
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg("Tidak dapat terhubung ke server. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Simpan redirect URL ke localStorage untuk digunakan setelah callback
    localStorage.setItem("redirectAfterLogin", redirectTo);
    
    // Redirect ke n8n webhook untuk Google OAuth
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_GOOGLE_SIGNIN_URL;
    const callbackUrl = `${window.location.origin}/auth/callback`;
    
    // Redirect ke n8n dengan parameter callback
    window.location.href = `${n8nWebhookUrl}?callback=${encodeURIComponent(callbackUrl)}`;
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("remembered_email");
    const savedPassword = localStorage.getItem("remembered_password");
    
    if (savedEmail) {
      setEmail(savedEmail);
      setIsChecked(true);
      
      // Opsional: isi password jika disimpan (kurang aman, tapi bisa digunakan)
      if (savedPassword) {
        setPassword(atob(savedPassword)); // decode dari base64
      }
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Masuk
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Masukkan email dan passwordmu.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-md">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignIn}>
          <div className="space-y-6">
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
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-50 -translate-y-1/2 cursor-pointer right-3 top-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 w-5 h-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Tetap Masuk
                </span>
              </div>
              <Link
                href="/auth/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Lupa password?
              </Link>
            </div>

            <div>
              <Button
                className="w-full"
                size="sm"
                type="submit"
                disabled={loading}
              >
                {loading ? "Mulai masuk..." : "Masuk"}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Link
              href="/auth/dashboard-user/signup"
              className="px-40.5 py-3 md:px-51 py-3 rounded-lg bg-[#4EC722] text-sm text-white font-medium hover:bg-[#378C18] transition"
            >
              Daftar
            </Link></div>

              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <Link
                  href="/home"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  ← Kembali ke halaman utama
                </Link>
              </p>
            
          </div>
        </form>
      </div>
    </div>
  );
}