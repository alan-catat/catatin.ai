"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // 🟢 icon mata normal

export default function UpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isFromDashboard, setIsFromDashboard] = useState(false);
  
  // Form states
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  const N8N_RESET_PASSWORD_URL =
    process.env.NEXT_PUBLIC_N8N_RESET_PASSWORD_URL ||
    "https://n8n.srv1074739.hstgr.cloud/webhook/gantipassword";


    useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    const fromDashboard = searchParams.get("from") === "dashboard";
    
    if (fromDashboard) {
      setIsFromDashboard(true);
      const userEmail = localStorage.getItem("user_email");
      if (!userEmail) {
        router.push("/LogIn");
      }
    } else if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setIsFromDashboard(false);
    } else {
      setTokenValid(false);
      setErrorMsg("Link tidak valid. Silakan gunakan link dari email atau akses dari dashboard.");
    }
  }, [searchParams, router]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain an uppercase letter.";
    if (!/[0-9]/.test(pwd)) return "Password must contain a number.";
    return null;
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // ✅ Validasi password match
    if (password !== confirmPassword) {
      setErrorMsg("Password dan konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    // ✅ Validasi panjang password
    if (password.length < 8) {
      setErrorMsg("Password minimal 8 karakter.");
      setLoading(false);
      return;
    }

    if (isFromDashboard && !oldPassword) {
      setErrorMsg("Password lama wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      let response;
      
      if (isFromDashboard) {
    const userEmail = localStorage.getItem("user_email");
        const authToken = localStorage.getItem("token");
        
        response = await fetch(N8N_RESET_PASSWORD_URL, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(authToken && { "Authorization": `Bearer ${authToken}` })
          },
          body: JSON.stringify({ 
            email: userEmail,
            oldPassword,
            newPassword: password,
            confirmPassword 
          }),
        });
      } else {
        response = await fetch(N8N_RESET_PASSWORD_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            token, 
            password,
            confirmPassword 
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`Gagal ${isFromDashboard ? 'mengubah' : 'reset'} password (${response.status})`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      console.log("Response dari n8n:", data);
      if (
        Array.isArray(data) && data.length > 0 ||
        (typeof data === "object" && !Array.isArray(data) && data.success) ||
        (typeof data === "string" && data.toLowerCase().includes("sukses"))
      ) {
        setSuccessMsg(
          isFromDashboard 
            ? "Password berhasil diubah!"
            : "Password berhasil direset! Anda akan diarahkan ke halaman login..."
        );
          if (isFromDashboard) {
          // Kembali ke profile setelah 2 detik
          setTimeout(() => {
            router.push("/dashboard-user/profile");
          }, 2000);
        } else {
          // Redirect ke login setelah 3 detik
          setTimeout(() => {
            router.push("/LogIn");
          }, 3000);
        }
      } else {
        // ❌ Gagal
        if (isFromDashboard) {
          setErrorMsg(
            typeof data === "string"
              ? data
              : data?.error || "Password lama salah atau terjadi kesalahan."
          );
        } else {
          setErrorMsg(
            typeof data === "string"
              ? data
              : data?.error || "Token tidak valid atau sudah kadaluarsa. Silakan minta link baru."
          );
          setTokenValid(false);
        }
      }
    } catch (err: any) {
      console.error("Change/Reset password error:", err);
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
              {isFromDashboard ? "Ubah Password" : "Reset Password"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isFromDashboard 
                ? "Masukkan password lama dan password baru Anda."
                : "Masukkan password baru Anda."}
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

          {!isFromDashboard && !tokenValid ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600 dark:text-gray-400">
                Link reset password tidak valid atau sudah kadaluarsa.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/auth/reset-password">
                  <Button className="w-full" size="sm">
                    Minta Link Baru
                  </Button>
                </Link>
                <Link
                  href="/LogIn"
                  className="text-center text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  ← Kembali ke halaman masuk
                </Link>
              </div>
            </div>
          ) : (
          <form onSubmit={handleUpdatePassword}> 
          <div className="space-y-6">
             {/* Password Lama (hanya tampil jika dari dashboard) */}
                {isFromDashboard && (
                  <div>
                    <Label>
                      Password Lama <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Masukkan password lama"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute z-50 -translate-y-1/2 cursor-pointer right-3 top-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        tabIndex={-1}
                      >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                    </div>
                  </div>
                )}
                
            <div>
              <Label>
                Password Baru <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukan Password Baru"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Input Confirm */}
            <div>
              <Label>
                Konfirmasi Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi Password Baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-500 mt-1">Passwords tidak sama.</p>
              )}
            </div>

            <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                  >
                    {loading 
                      ? "Mengubah Password..." 
                      : isFromDashboard 
                        ? "Ubah Password" 
                        : "Reset Password"}
                  </Button>
                </div>
            <div className="text-center">
                  <Link
                    href="/LogIn"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    ← Kembali ke halaman masuk
                  </Link>
                </div>
                </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
