"use client";
import React, { useState } from "react";
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
        body: JSON.stringify({ email, password }),
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
        // Simpan email + token di localStorage
        localStorage.setItem("user_email", data.user.email);
        if (data.token) localStorage.setItem("token", data.token);

        // Simpan user lengkap (opsional)
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect
        setTimeout(() => router.push(redirectTo || "/dashboard-user/profile"), 200);
        return;
      }

      // ✅ LOGIN BERHASIL (respon plain text)
      if (typeof data === "string" && data.toLowerCase().includes("sukses")) {
        localStorage.setItem("user_email", email);
        localStorage.setItem("user", JSON.stringify({ email }));
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
  window.location.href = process.env.NEXT_PUBLIC_N8N_GOOGLE_SIGNIN_URL!;
  
};
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <div>
         
          <div className="relative py-3 sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
          </div>
          
          {errorMsg && (
            <div className="mt-4 text-red-500 text-sm">{errorMsg}</div>
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
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <Button
                  className="w-full"
                  size="sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <Link
                    href="/home"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    ← Kembali ke halaman utama
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
