"use client";
import { useEffect, useState } from "react";
import owlMascot from "./catatin.png";
import Image from "next/image";
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
      className={`fixed top-0 w-full py-4 bg-[#DFF3FF]/70 backdrop-blur-md border-b border-gray-200 z-50 transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 sm:px-6 lg:px-0">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src={owlMascot}
            alt="Catatin.ai"
            className="w-36 h-auto animate-float drop-shadow-xl"
          />
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm md:text-base">
          <a href="#features" className="hover:text-primary transition-colors">
            Fitur
          </a>
          <a href="#how" className="hover:text-primary transition-colors">
            Cara Kerja
          </a>
        <Link
          href="/home/Convert"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#05668D] text-white font-medium shadow-sm hover:bg-[#04506c] hover:scale-105 active:scale-95 transition"
        >
          Coba Convert
        </Link>
        </nav>
        <div className="flex items-center gap-3">
            <Link
              href="/auth/dashboard-user/signin"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Masuk
            </Link>
            <Link
              href="/auth/dashboard-user/signup"
              className="px-4 py-2 rounded-lg bg-[#4EC722] text-white font-medium hover:bg-[#378C18] transition"
            >
              Daftar
            </Link>
          </div>
      </div>
    </header>
  );
}
