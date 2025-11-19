"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FloatingCards() {
  return (
    <div className="absolute inset-0 flex items-center pointer-events-none">
      {/* Card belakang */}
      <motion.div
        className="absolute top-20 left-10 z-0"
        initial={{ y: 0, scale: 0.95, opacity: 0.7 }}
        animate={{ y: [0, -20, 0] }} 
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/card-back.png" // ganti file kamu
          alt="Card Back"
          width={160}
          height={80}
          className="blur-[1px]"
        />
      </motion.div>

      {/* Card depan */}
      <motion.div
        className="absolute top-10 left-24 z-10"
        initial={{ y: 0, scale: 1 }}
        animate={{ y: [0, -30, 0] }} 
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95], // lebih organik
        }}
      >
        <Image
          src="/card-front.png" // ganti file kamu
          alt="Card Front"
          width={160}
          height={80}
          className="drop-shadow-xl"
        />
      </motion.div>
    </div>
  );
}
