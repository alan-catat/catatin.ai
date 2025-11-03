"use client";

import { useEffect, useState } from "react";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import UserSocialCard from "@/components/user-profile/UserSocialMedia";

export default function Profile() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userLocal.email) {
        console.warn("Email user tidak ditemukan di localStorage");
        return;
      }
        const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_GETPROFILE_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({ email: userLocal.email }),
        });

        if (!res.ok) throw new Error("Gagal ambil data dari n8n");

        const data = await res.json();
        console.log("Hasil dari n8n:", data);

        const formatted = Array.isArray(data) ? data : [data];
        setProfiles(formatted);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) return <div>Memuat...</div>;

  // fungsi untuk memperbarui satu profile di dalam array
  const handleProfileUpdate = (index: number, updatedProfile: any) => {
    setProfiles((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...updatedProfile } : p))
    );
  };

  return (
    <div>
      {profiles.map((profile, index) => (
        <div
          key={index}
          className="mt-6 first:mt-0 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
        >
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Profile
          </h3>
          <div className="space-y-10">
            <div className="space-y-6 border-b border-gray-200 pb-6 last:border-none last:pb-0 dark:border-gray-800">
              {/* Semua card pakai data dari profile yang sama */}
              <UserMetaCard profile={profile} />
              <UserSocialCard profile={profile} />
              <UserInfoCard
                profile={profile}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
