'use client'

import { useEffect, useState } from "react"
import UserInfoCard from "@/components/user-profile/UserInfoCard"
import UserMetaCard from "@/components/user-profile/UserMetaCard"
import UserSocialCard from "@/components/user-profile/UserSocialMedia"

export default function Profile() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // 📡 Dummy data sementara — nanti ganti ke API n8n kamu
        const dummyUser = {
          user_id: "temp-user-id",
          full_name: "Pengguna Baru",
          email: "user@example.com",
          groups: { name: "Tanpa Group" },
          channels: ["Telegram", "WhatsApp"],
        }

        // ✅ Simulasi loading
        setTimeout(() => {
          setProfiles([dummyUser])
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("Error loading profile:", error)
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  if (loading) return <div>Memuat...</div>

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
              <UserMetaCard profile={profile} />
              <UserSocialCard profile={profile} />
              <UserInfoCard profile={profile} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
