"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();

  // 🧠 STATE
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🌐 URL webhook n8n (dari .env.local)
  const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!;
  const WEBHOOK_GOOGLE = process.env.NEXT_PUBLIC_N8N_GOOGLE_SIGNUP_URL!;

  // ✅ Handle Manual Sign-Up → kirim ke n8n
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Timestamp: new Date().toISOString(),
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Password: password,
        }),
      });

      let data;
      const text = await response.text(); // ambil dulu sebagai teks mentah
      try {
        data = JSON.parse(text); // coba parse jadi JSON
      } catch {
        data = text; // kalau gagal, berarti dia teks biasa
      }

      if (typeof data === "string") {
        // responsnya bukan JSON
        if (data.toLowerCase().includes("sudah terdaftar")) {
          setErrorMsg("Anda sudah terdaftar, silakan login.");
        } else {
          setErrorMsg(data);
        }
      } else if (data.success) {
        // JSON valid dan sukses
        const userData = {
          firstName,
          lastName,
          email,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("user", JSON.stringify(userData));
        router.push("/check-email");
      } else {
        // JSON valid tapi gagal
        if (data.error === "User already registered") {
          setErrorMsg("Anda sudah terdaftar, silakan login.");
        } else {
          setErrorMsg("Failed to register: " + (data.error || "Unknown error"));
        }
      }
    } catch (err) {
      console.error("Webhook error:", err);
      setErrorMsg("Gagal terhubung ke server. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Handle Google Sign-Up (redirect ke n8n workflow)
  const handleGoogleSignUp = async () => {
    try {
      if (!WEBHOOK_GOOGLE) {
        console.error("❌ Missing NEXT_PUBLIC_N8N_GOOGLE_SIGNUP_URL in .env.local");
        setErrorMsg("Google Sign-Up belum dikonfigurasi.");
        return;
      }
      window.location.href = WEBHOOK_GOOGLE; // arahkan langsung ke workflow Google
    } catch (error) {
      console.error("Google Sign Up failed:", error);
      setErrorMsg("Gagal memulai Google Sign Up.");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your details to create your account
          </p>
        </div>

        <div>
          {/* Google Sign Up */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 sm:gap-5">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                  fill="#4285F4"
                />
                <path
                  d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                  fill="#34A853"
                />
                <path
                  d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                  fill="#EB4335"
                />
              </svg>
              Sign up with Google
            </button>
          </div>

          <div className="relative py-3 sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                Or
              </span>
            </div>
          </div>

          {errorMsg && <div className="mt-4 text-red-500 text-sm">{errorMsg}</div>}

          <form onSubmit={handleSignUp}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label>First Name*</Label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label>Email*</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label>Password*</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <Label>Confirm Password*</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  By creating an account you agree to the{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    <Link href="/T&C"> Terms and Conditions </Link>
                  </span>{" "}
                  and our{" "}
                  <span className="text-gray-800 dark:text-white">
                    <Link href="/PrivacyPolicy"> Privacy Policy </Link>
                  </span>
                </p>
              </div>

              <Button
                className="w-full"
                size="sm"
                type="submit"
                disabled={loading || !isChecked}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>

              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <Link
                  href="/landing"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  ← Kembali ke halaman utama
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
