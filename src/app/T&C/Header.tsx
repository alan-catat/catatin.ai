"use client";
import { useEffect, useState } from "react";
import owlMascot from "../catatin.png";
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
      className={`fixed top-1 w-full py-4 bg-[#ffffff]/70 backdrop-blur-md border-b border-gray-200 z-50 transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-10 md:px-37 md:pr-77 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
        <div className="flex items-center gap-3">
            <Image
              src={owlMascot}
              alt="Catatin.ai"
              className="w-35 h-7 animate-float drop-shadow-xl"
            />
          </div>
        </Link>

        {/* Nav */}
        

        {/* CTA */}
       
      </div>
    </header>
  );
}