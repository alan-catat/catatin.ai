import "./globals.css";
import { Nunito } from "next/font/google";
import { UserProvider } from "@/context/UserContext";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${nunito.className} antialiased`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
