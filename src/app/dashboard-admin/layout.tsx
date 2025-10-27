"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext"; // ✅ pakai ThemeContext-mu sendiri
import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import Backdrop from "@/layout/Backdrop";
import { AlertProvider } from "@/components/ui/alert/Alert";
import { ENVIRONMENT_SYSTEM } from "@/constants/test-data";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";

function DashboardAdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [appLogo, setAppLogo] = useState<{ light: string; dark: string }>({
    light: ENVIRONMENT_SYSTEM.appLogo,
    dark: ENVIRONMENT_SYSTEM.appDarkLogo || ENVIRONMENT_SYSTEM.appLogo,
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchLogos = async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("key, value")
        .in("key", ["LOGO_APP", "LOGO_DARK"]);
      if (!error && data) {
        const logoApp =
          data.find((r) => r.key === "LOGO_APP")?.value ||
          ENVIRONMENT_SYSTEM.appLogo;
        const logoDark =
          data.find((r) => r.key === "LOGO_DARK")?.value ||
          ENVIRONMENT_SYSTEM.appDarkLogo ||
          ENVIRONMENT_SYSTEM.appLogo;
        setAppLogo({ light: logoApp, dark: logoDark });
      }
    };
    fetchLogos();
  }, [supabase]);

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar role="admin" appLogo={appLogo} />
      <Backdrop />
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <AppHeader userRole="admin" />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <AlertProvider>{children}</AlertProvider>
        </div>
      </div>
    </div>
  );
}

export default function DashboardAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider> {/* ✅ Tambahkan di sini */}
      <SidebarProvider>
        <DashboardAdminLayoutContent>{children}</DashboardAdminLayoutContent>
      </SidebarProvider>
    </ThemeProvider>
  );
}
