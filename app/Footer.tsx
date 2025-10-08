import { MessageCircle, Bot, Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer id="signup" className="bg-[#80F2FF] py-5  ">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-7">
              <img src="/catatin.png" alt="Catatin.ai" className="w-28 h-28 animate-ping-slow" />
            <p className="text-black/70 mb-1 max-w-md">
              Revolusi cara Anda mengelola keuangan dengan kekuatan AI. 
              Otomatis, pintar, dan mudah digunakan.
            </p></div>
            <a
  href="https://wa.me/6281118891092"
  target="_blank"
  rel="noopener noreferrer"
  className="relative z-10 inline-flex items-center gap-2 bg-primary-light text-black rounded-full px-4 py-2 shadow-sm hover:bg-black-100 hover:scale-105 active:scale-95 cursor-pointer transition"
>
  <MessageCircle className="w-4 h-4" />
  <span className="text-sm">Hubungi kami</span>
</a>

          </div>

          {/* Quick Links */}
          <div className="py-6">
            <h4 className="font-semibold mb-4">Menu</h4>
            <ul className="space-y-2 text-black/70">
              <li>
                <a href="#features" className="hover:text-black transition-colors">
                  Fitur
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-black transition-colors">
                  Cara Kerja
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="py-6">
            <h4 className="font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2 text-black/70">
              <li>
                <Link href="/T&C" className="hover:text-black transition-colors">
                  S&K
                </Link>
              </li>
              <li>
                <Link href="/PrivacyPolicy" className="hover:text-black transition-colors">
                  Kebijakan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-black/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-black/60 text-sm mb-4 md:mb-0">
              © 2025 PT Monivo Global Teknologi. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
