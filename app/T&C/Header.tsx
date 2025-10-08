"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 w-full bg-[#80F2FF]/70 backdrop-blur-md border-b border-gray-200 z-50 transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-3 py-0 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
           <img
            src="/catatin.png"
            alt="Catatin.ai"
            className="w-22 h-22 drop-shadow-lg animate-pulse"
          />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent">
  catatin.ai
</h1>

            <p className="text-xs text-muted-foreground">cara simpel nyatet tanpa repot</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="hover:text-primary transition-colors">Fitur</Link>
          <Link href="/#how" className="hover:text-primary transition-colors">Cara Kerja</Link>
        </nav>

        {/* CTA */}
        <a
          href="#signup"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-medium shadow-sm hover:bg-black-100 hover:scale-105 active:scale-95 cursor-pointer transition"
        >
          Coba Gratis
        </a>
      </div>
    </header>
  );
}