"use client";
import { useEffect, useState } from "react";
import owlMascot from "./catatin.png";
import Image from "next/image";

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
      className={`fixed top-1 w-full py-4 bg-[#ffffff]/70 backdrop-blur-md border-b border-gray-200 z-50 transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-10 md:px-37 md:pr-77 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
            <Image
              src={owlMascot}
              alt="Catatin.ai"
              className="w-35 h-7 animate-float drop-shadow-xl"
            />
          </div>


        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="hover:text-primary transition-colors">Fitur</a>
          <a href="#how" className="hover:text-primary transition-colors">Cara Kerja</a>
        </nav>

        {/* CTA */}
        <a
          href="#signup"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#05668D] text-white font-medium shadow-sm hover:bg-black-100 hover:scale-105 active:scale-95 cursor-pointer transition"
        >
          Coba Gratis
        </a>
      </div>
    </header>
  );
}