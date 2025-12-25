"use client";

import Header from "./Header";
import Footer from "./Footer";
import CTASection from "./CTASection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import Paket from "./paket";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

export default function HomeClient() {
  
  return (
    <main className="min-h-screen bg-[#DFF3FF] text-slate-800 antialiased">
      <Header />
      
      {/* HERO */}
      <section className="pt-10 w-full bg-[#DFF3FF] text-slate-800">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-16 md:py-20 flex flex-col md:flex-row items-center gap-12 md:gap-20">
    
    {/* Left (Text) */}
    <div className="flex-1 text-center md:text-left">
      <div className="flex justify-center md:justify-start mb-4">
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
        />
      </div>

      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
        Cara simpel Nyatet tanpa repot.
        <span className="align-middle ml-2">✨</span>
      </h2>

      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
        Dengan{" "}
        <span className="font-bold bg-gradient-to-r from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent">
          catatin.ai
        </span>
        , siapapun bisa mencatat tanpa repot. <br />
        Data langsung tersimpan rapi.
      </p>

      <div className="flex justify-center md:justify-start gap-4">
        <a
          href="#SignUp"
          className="px-6 py-3 rounded-full bg-[#05668D] text-white font-medium shadow hover:bg-blue-700"
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

    {/* Right (Video) */}
    <div className="flex-1 flex justify-center md:justify-end">
      <div className="relative mx-auto md:mx-0 w-[220px] sm:w-[260px] md:w-[1800px] lg:w-[280px] rounded-[1.5rem] border-[6px] border-black overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-b-xl z-10"></div>
        <video
          className="w-full h-full"
          autoPlay
          muted
          playsInline
          controls
        >
          <source src="/cerah_compressed.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  </div>
</section>


      <FeaturesSection />
      <HowItWorksSection />
      <Paket />
      <CTASection />
      <Footer />
    </main>
  );
}