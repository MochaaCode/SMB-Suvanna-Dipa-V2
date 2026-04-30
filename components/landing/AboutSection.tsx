/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Award } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function AboutSection({
  about,
  vision,
  values,
}: {
  about: any;
  vision: any;
  values: any;
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="about" className="py-24 bg-white">
      <div className="px-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
        className="grid md:grid-cols-2 gap-16 items-center mb-12"
      >
        <motion.div
          variants={itemVariants}
          className="relative aspect-square rounded-[1rem] overflow-hidden shadow-2xl shadow-orange-500/40 border-4 border-orange-500 group hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(249,115,22,0.6)] transition-all duration-500 ease-out"
        >
          <Image
            src="/images/smbsd-bg-hd.jpg"
            alt="Kegiatan"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-orange-500/40 via-transparent to-transparent" />
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-6">
          <motion.div variants={itemVariants} className="mb-4 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-orange-500 leading-[1.1]">
              Tentang Suvanna Dipa
            </h2>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-slate-900 font-bold leading-relaxed text-justify"
          >
            {about.description || "Deskripsi Vihara belum diisi..."}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-4 pt-4"
          >
            <div className="p-5 bg-white/80 backdrop-blur-md rounded-[1rem] border-2 border-orange-400 shadow-sm hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 ease-out">
              <h4 className="font-black text-orange-500 text-3xl mb-1">
                {about.active_students || 0}+
              </h4>
              <p className="text-[10px] text-slate-900 font-bold uppercase tracking-widest">
                Siswa Aktif
              </p>
            </div>
            <div className="p-5 bg-white/80 backdrop-blur-md rounded-[1rem] border-2 border-orange-400 shadow-sm hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 ease-out">
              <h4 className="font-black text-orange-500 text-3xl mb-1">
                {about.founded_year || 2008}
              </h4>
              <p className="text-[10px] text-slate-900 font-bold uppercase tracking-widest">
                Tahun Berdiri
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="pt-12"
      >
        <h3 className="text-2xl md:text-3xl font-extrabold text-orange-500 text-center mb-10 leading-[1.1]">
          Visi & Misi
        </h3>
        <div className="space-y-20">
          <div className="w-full text-center mb-12">
            <p className="text-base md:text-lg font-serif font-medium text-slate-800 leading-relaxed italic">
              &quot;{vision.visi || "Visi belum diisi..."}&quot;
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {vision.misi?.map((text: string, idx: number) => (
              <div
                key={idx}
                className="relative p-6 bg-white/80 backdrop-blur-md rounded-[1rem] border-2 border-orange-400 shadow-sm hover:bg-orange-50 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 ease-out"
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-900 leading-relaxed text-center font-bold pt-4">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-8 text-center mt-20">
            <h4 className="text-2xl md:text-3xl font-extrabold text-orange-500 text-center mb-10 leading-[1.1]">
              Nilai-Nilai Inti
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {values.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-white/80 backdrop-blur-md rounded-[1rem] border-2 border-orange-400 shadow-sm flex flex-col items-center hover:bg-orange-50 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 ease-out"
                >
                  <span className="text-xl font-black text-orange-500">
                    {item.l}
                  </span>
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">
                    {item.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
