import "./globals.css";
import { Nunito } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "catatin.ai",
};

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QGCEM609CF"
        strategy="afterInteractive"
        />
<Script id="google-analytics" strategy="afterInteractive">
{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-QGCEM609CF');
`}
</Script>
      </head>
      <body className={`${nunito.className} antialiased`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
