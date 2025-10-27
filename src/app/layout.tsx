import "./globals.css";
import type { ReactNode } from "react";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "catatin.ai",
  description: "Cara simpel nyatet tanpa repot.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
