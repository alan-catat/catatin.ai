"use client";

import { SidebarProviderTutorial, useSidebarTutorial } from "@/context/SidebarTutorial";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import AdminLayout from "./AdminLayoutTutorial"; 

export default function TutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProviderTutorial>
        <AdminLayout>{children}</AdminLayout>
      </SidebarProviderTutorial>
    </ThemeProvider>
  );
}
