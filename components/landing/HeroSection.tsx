"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yOrbs = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <section
      ref={targetRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20"
    >
      <motion.div
        style={{ y: yOrbs }}
        className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full blur-[80px] opacity-40 animate-pulse"
      />
      <motion.div
        style={{ y: yOrbs }}
        className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200 rounded-full blur-[100px] opacity-30"
      />

      <motion.div
        style={{ y: yText }}
        className="text-center z-10 max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 text-orange-600 rounded-full text-xs font-bold mb-8 md:mb-6 uppercase tracking-widest shadow-sm"
        >
          Saddha, Sila, Sippa
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-[1.7rem] md:text-5xl lg:text-[3.5rem] font-extrabold mb-8 md:mb-6 leading-[1.4] md:leading-[1.3] text-slate-800 tracking-wide md:tracking-wider"
        >
          Selamat Datang! <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500">
            Sotthi Hotu Namo Buddhaya
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-500 mb-10 font-medium"
        >
          Sekolah Minggu Buddha Suvanna Dipa
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="#about"
            className="px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 group hover:bg-slate-800 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 ease-out active:scale-95 max-w-xs mx-auto sm:max-w-none"
          >
            Kenali Lebih Dekat{" "}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
