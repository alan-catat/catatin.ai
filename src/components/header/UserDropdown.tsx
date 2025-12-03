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

  const getInitials = (firstname?: string, lastname?: string) => {
    const first = firstname?.charAt(0)?.toUpperCase() ?? "";
    const last = lastname?.charAt(0)?.toUpperCase() ?? "";
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

  const avatarUrl = user?.avatar
    ? getDriveUrl(user.avatar)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User"
      )}&background=random&color=fff&bold=true`;

  const handleSignOut = () => {
    // hanya redirect, tanpa hapus localstorage
    window.location.href = "/auth/dashboard-user/signin";
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
            {user?.avatar ? (
              <Image
                src={avatarUrl}
                alt="User Avatar"
                width={44}
                height={44}
                className="object-cover rounded-full"
                onError={() => console.warn("Gagal load avatar")}
              />
            ) : (
              <span>{getInitials(user?.firstName, user?.lastName)}</span>
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
        <DropdownMenuItem disabled>
          <div className="flex items-center gap-2">
            <UserIcon size={16} />
            <span>
              {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                "User"}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut size={16} className="mr-2" />
          <span></span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
