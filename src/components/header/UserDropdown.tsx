"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

export default function UserDropdown() {
  const [user, setUser] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserFromN8N = async () => {
      try {
        const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
        if (!userLocal.email) {
          console.warn("Email user tidak ditemukan di localStorage");
          return;
        }
      
        const res = await fetch(process.env.NEXT_PUBLIC_N8N_GETPROFILE_URL!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userLocal.email }),
        });

        if (!res.ok) throw new Error("Gagal ambil data user dari n8n");

        const text = await res.text();
        if (!text) return;
        const data = JSON.parse(text);

        const formattedUser = {
          firstName: data.full_name?.split(" ")[0] ?? "",
          lastName: data.full_name?.split(" ").slice(1).join(" ") ?? "",
          email: data.email ?? "",
          avatar: data.photo_url ?? "",
        };

        setUser(formattedUser);
      } catch (error) {
        console.error("Error get user from n8n:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFromN8N();
  }, []);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() ?? "";
    const last = lastName?.charAt(0)?.toUpperCase() ?? "";
    return (first + last) || "U";
  };

  const getDriveUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      const match = url.match(/[-\w]{25,}/);
      if (match) return `https://drive.google.com/uc?export=view&id=${match[0]}`;
    }
    return url;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Pastikan avatarUrl valid
  const avatarUrl = getDriveUrl(user?.avatar || '');
  const hasValidAvatar = avatarUrl && isValidUrl(avatarUrl);
  
  // Perbaikan: gunakan firstName dan lastName, bukan full_name
  const initials = getInitials(user?.firstName, user?.lastName);

  const handleSignOut = () => {
    // hanya redirect, tanpa hapus localstorage
    window.location.href = "/home";
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        Memuat user...
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 focus:outline-none">
          <div className="relative h-11 w-11 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-white font-semibold">
            {hasValidAvatar ? (
              <Image
                src={avatarUrl}
                alt="User Avatar"
                width={44}
                height={44}
                className="object-cover"
              />
            ) : (
              <span className="text-lg">
                {initials}
              </span>
            )}
          </div>

          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-semibold">
              {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                "User Unknown"}
            </span>
            <span className="text-xs text-gray-500">
              {user?.email ?? "No email"}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <div className="flex items-center gap-2">
            <UserIcon size={16} />
            <span>
              <Link href="/dashboard-user/profile">
                {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                  "User"}
              </Link>
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut size={16} className="mr-2" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}