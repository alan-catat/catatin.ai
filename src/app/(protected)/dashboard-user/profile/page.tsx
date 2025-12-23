"use client";

import { useEffect, useState } from "react";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import SocialMediaCard from "@/components/user-profile/UserSocialMedia";
import PersonalInfoCard from "@/components/user-profile/UserInfoCard";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Ambil email dari localStorage
        const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
        
        if (!userLocal.email) {
          console.error("Email tidak ditemukan di localStorage");
          setLoading(false);
          return;
        }

        // Fetch profile dari n8n
        const res = await fetch(process.env.NEXT_PUBLIC_N8N_GETPROFILE_URL!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userLocal.email }),
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data profil");
        }

        const text = await res.text();
        console.log("Raw response from n8n:", text); // Debug
        
        if (!text) {
          console.error("Response kosong dari n8n");
          setLoading(false);
          return;
        }

        // Parse response
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          console.log("Text yang gagal di-parse:", text);
          setLoading(false);
          return;
        }

        console.log("Parsed profile data:", data); // Debug

        // ✅ Set profile data
        setProfile(data);

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Gagal memuat profil</p>
          <p className="text-gray-600 text-sm">Silakan refresh halaman atau login ulang</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profil</h1>
      
      <UserMetaCard profile={profile} />
      <SocialMediaCard profile={profile} />
      <PersonalInfoCard profile={profile} />
    </div>
  );
}