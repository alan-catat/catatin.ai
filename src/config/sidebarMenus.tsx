import {
    GridIcon, UserCircleIcon, ListIcon, PageIcon, PlugInIcon, CalenderIcon,
    ChatIcon,
  } from "@/icons";
import { GroupIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/icons";
import { TelegramIcon } from "@/components/icons/icons";
  
  export type NavItem = {
    name: string;
    path?: string;
    icon?: React.ReactNode;
    subItems?: NavItem[];
    alwaysExpanded?: boolean;
  };
  
  export const sidebarMenus: Record<"admin" | "user" | "Tutorial", NavItem[]> = {
    admin: [
      { name: "Overview", path: "/dashboard-admin", icon: <GridIcon /> },
      { name: "User Management", path: "/dashboard-admin/user-management", icon: <UserCircleIcon /> },
      {
        name: "Master Data",
        icon: <ListIcon />,
        subItems: [
          { name: "Kategori", path: "/dashboard-admin/global-category" },
          { name: "Group", path: "/dashboard-admin/groups" },
          { name: "Channel", path: "/dashboard-admin/channels" },
          { name: "Product", path: "/dashboard-admin/packages" },
        ],
      },
      { name: "Reports & Logs", path: "/dashboard-admin/report-logs", icon: <CalenderIcon /> },
      { name: "Support", path: "/dashboard-admin/supports", icon: <PlugInIcon /> },
      { name: "Settings", path: "/dashboard-admin/settings", icon: <PlugInIcon /> },
    ],
    user: [
      { name: "Beranda Pengguna", path: "/dashboard-user", icon: <GridIcon /> },
      { name: "Obrolan Web", path: "/dashboard-user/webchat", icon: <ChatIcon /> },
      { name: "Profil", path: "/dashboard-user/profile", icon: <UserCircleIcon /> },
      { name: "Tambah channel", path: "/dashboard-user/add-channel", icon: <GroupIcon /> },
      { name: "Laporan", path: "/dashboard-user/reports", icon: <CalenderIcon /> },
      
      
    ],
    Tutorial: [
      { name: "Telegram", icon: <TelegramIcon />,
        alwaysExpanded: true,
        subItems: [
          { name: "Cara Buat Group Telegram", path: "/Tutorial/Telegram" },
          { name: "Cara Aktivasi Group Telegram", path: "/Tutorial/Telegram/caraaktivasitelegram" },
          ],
      },
      { name: "WhatsApp", icon: <WhatsAppIcon />,
        alwaysExpanded: true,
        subItems: [
          { name: "Cara Registrasi Channel WA ", path: "/Tutorial/WhatsApp" },
          { name: "Cara Aktivasi WA", path: "/Tutorial/WhatsApp/caraaktivasiwa" },
          ],
      },
      
      
      
    ],
  };
  