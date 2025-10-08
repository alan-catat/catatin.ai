"use client";

import Header from "./Header";
import Footer from "./Footer";
import CTASection from "./CTASection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import { motion } from "framer-motion";

export default function Home() {

  return (
    <main className="min-h-screen bg-gradient-to-l from-white via-[#B2F7FF] to-[#80F2FF] text-slate-800 antialiased">
      <Header />


      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-30 pb-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="flex justify-center mb-4">
            <motion.img
          src="/buku.png"
          alt="Phone mockup"
          className="text-center w-[120px] z-10"
          animate={{ y: [0, -15, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
        /></div>
          <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Cara simpel nyatet tanpa repot. 
            <span className="align-middle ml-3">✨</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mb-10">
            <br />
            Dengan{" "}
            <span className="text-xl font-bold bg-gradient-to-r from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent">
              catatin.ai
            </span>
            , siapapun bisa mencatat tanpa repot. <br />
            Data langsung tersimpan rapi.
          </p>

          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="#signup"
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium shadow hover:bg-blue-700"
            >
              Hubungi kami
            </a>
            <a
              href="#features"
              className="px-6 py-3 rounded-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            >
              Lihat Fitur
            </a>
          </div>
        </div>

        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative mx-auto w-[180px] md:w-[280px] rounded-[1.5rem] border-[6px] border-black overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-19 h-4 bg-black rounded-b-xl z-10"></div>
            <video
              className="w-full h-full"
              autoPlay
              loop
              muted
              playsInline
              controls
            >
              <source src="/cerah.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
}
