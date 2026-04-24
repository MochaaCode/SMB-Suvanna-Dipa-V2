"use client";

import { useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 text-orange-600 rounded-full text-xs font-bold mb-6 uppercase tracking-widest shadow-sm"
        >
          <Sparkles size={14} className="animate-pulse" /> Saddha, Sila, Sippa
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] text-slate-800 tracking-tight"
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
            className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 group hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-900/20 active:scale-95"
          >
            Mulai Menjelajah{" "}
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
