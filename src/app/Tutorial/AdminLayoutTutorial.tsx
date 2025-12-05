"use client";

import { useSidebarTutorial } from "@/context/SidebarTutorial";
import AppHeaderTutorial from "@/layout/AppHeaderTutorial";
import AppSidebarTutorial from "@/layout/AppSidebarTutorial";
import BackdropTutorial from "@/layout/BackdropTutorial";
import React, { useState, useEffect } from "react";
import { AlertProvider } from "@/components/ui/alert/Alert";
import { ENVIRONMENT_SYSTEM } from "@/constants/test-data";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State logo untuk light & dark
  const [appLogo, setAppLogo] = useState<{ light: string; dark: string }>({
    light: ENVIRONMENT_SYSTEM.appLogo,
    dark: ENVIRONMENT_SYSTEM.appDarkLogo || ENVIRONMENT_SYSTEM.appLogo,
  });
  
  const { isExpanded, isHovered, isMobileOpen } = useSidebarTutorial();

  // Fetch app logo dari N8N (Google Sheets)
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch("YOUR_N8N_WEBHOOK_URL/system-settings");
        const data = await response.json();

        const logoApp = data.LOGO_APP || ENVIRONMENT_SYSTEM.appLogo;
        const logoDark = 
          data.LOGO_DARK || 
          ENVIRONMENT_SYSTEM.appDarkLogo || 
          ENVIRONMENT_SYSTEM.appLogo;

        setAppLogo({ light: logoApp, dark: logoDark });
      } catch (error) {
        console.error("Failed to fetch logos:", error);
      }
    };

    fetchLogos();
  }, []);

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebarTutorial role="Tutorial" appLogo={appLogo} />
      <BackdropTutorial />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeaderTutorial userRole="Tutorial" />

        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <AlertProvider>{children}</AlertProvider>
        </div>
      </div>
    </div>
  );
}