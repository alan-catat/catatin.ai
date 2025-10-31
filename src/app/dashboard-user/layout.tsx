"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AdminLayout from "./AdminLayout"; // meski namanya AdminLayout, isinya layout user kamu
import { UserProvider } from "@/context/UserContext";

export default function DashboardUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AdminLayout>{children}</AdminLayout>
      </SidebarProvider>
    </ThemeProvider>
  );
}
