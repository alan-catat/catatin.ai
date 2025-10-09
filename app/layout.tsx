import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "catatin.ai",
  description: "Cara simpel nyatet tanpa repot.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
