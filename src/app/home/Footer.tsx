
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#DFF3FF] py-10 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
          

          {/* Quick Links */}
          <div className="py-1 pb-0">
            <h4 className="font-semibold mb-2">Menu</h4>
            <ul className="flex-center md:flex gap-8 space-y-1 text-black/70">
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
          <div className="py-1 pb-0">
            <h4 className="font-semibold mb-2">Bantuan</h4>
            <ul className="flex-center md:flex gap-8 space-y-1 text-black/70">
              <li>
                <Link href="/syarat-ketentuan" className="hover:text-black transition-colors">
                  S&K
                </Link>
              </li>
              <li>
                <Link href="/kebijakanprivasi" className="hover:text-black transition-colors">
                  Kebijakan Privasi</Link>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center md:justify-end items-center">
          <div className="text-black/60 text-m mb-4 md:mb-0 font-bold"><br />
              © 2025 PT Monivo Global Teknologi.
            </div>
            </div>
        </div>
        

      </div>
    </footer>
  );
};

export default Footer;
