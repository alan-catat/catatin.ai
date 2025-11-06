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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!;

  // ✅ Validasi sebelum submit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setPasswordError("");

    // Validasi required
    if (!firstName || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    // Validasi checkbox
    if (!isChecked) {
      setErrorMsg("You must agree to the Terms and Conditions.");
      return;
    }

    // Validasi password
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setLoading(true);

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
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (typeof data === "string") {
        if (data.toLowerCase().includes("sudah terdaftar")) {
          setErrorMsg("Anda sudah terdaftar, silakan login.");
        } else {
          setErrorMsg(data);
        }
      } else if (data.success) {
        const userData = {
          firstName,
          lastName,
          email,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("user", JSON.stringify(userData));
        
        router.push("/check-email");
      } else {
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
                    className={!firstName && errorMsg ? "border-red-500" : ""}
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
                  className={!email && errorMsg ? "border-red-500" : ""}
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
                    className={passwordError ? "border-red-500" : ""}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={passwordError ? "border-red-500" : ""}
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
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
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
                disabled={
                  loading ||
                  !isChecked ||
                  !firstName ||
                  !email ||
                  !password ||
                  !confirmPassword
                }
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
  );
}
