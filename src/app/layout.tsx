import "./globals.css";
import type { ReactNode } from "react";
import { Nunito } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from '@/lib/auth-context';
import type { Metadata } from 'next';

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "catatin.ai",
  description: "Cara simpel nyatet tanpa repot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="id">
      <UserProvider>
      <body className={`${nunito.className} antialiased`}>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
      </UserProvider>
    </html>
  );
}
