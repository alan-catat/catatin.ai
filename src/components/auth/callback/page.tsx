"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const data = searchParams.get("data");

    if (token && data) {
      try {
        // Decode user data
        const userData = JSON.parse(atob(data));
        
        // Simpan token dan user data
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(userData));

        // Ambil redirect URL yang disimpan sebelumnya
        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/dashboard";
        localStorage.removeItem("redirectAfterLogin");

        // Redirect ke halaman yang dituju
        router.push(redirectTo);
      } catch (error) {
        console.error("Error parsing auth data:", error);
        router.push("/LogIn?error=invalid_callback");
      }
    } else {
      router.push("/LogIn?error=missing_credentials");
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}