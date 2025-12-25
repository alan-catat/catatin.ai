import { MessageCircle, Bot, Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="px-0 md:px-75 md:pr-117 bg-[#80F2FF] py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-4">
        

          {/* Quick Links */}
          <div className="py-1 pb-0">
            <h4 className="font-semibold mb-2">Menu</h4>
            <ul className="flex gap-8 space-y-1 text-black/70">
              <li>
                <Link href="/#features" className="hover:text-black transition-colors">
                  Fitur
                </Link>
              </li>
              <li>
                <Link href="/#how" className="hover:text-black transition-colors">
                  Cara Kerja
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="py-1 pb-0">
            <h4 className="font-semibold mb-2">Bantuan</h4>
            <ul className="flex gap-8 space-y-1 text-black/70">
              <li>
                <Link href="/syarat-ketentuan" className="hover:text-black transition-colors">
                  S&K
                </Link>
              </li>
              <li>
                <Link href="/kebijakanprivasi" className="hover:text-black transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-black/10 py-5">
          <div className="flex flex-col md:flex-row justify-center md:justify-end items-center">
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
