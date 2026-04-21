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
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid md:grid-cols-2 gap-16 items-center mb-32"
      >
        {/* Gambar diubah menjadi 1rem */}
        <motion.div
          variants={itemVariants}
          className="relative aspect-square rounded-[1rem] overflow-hidden shadow-2xl border-8 border-white group"
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
          <motion.div variants={itemVariants} className="space-y-2">
            <h4 className="text-orange-500 font-bold text-sm uppercase tracking-tighter">
              Tentang Suvanna Dipa
            </h4>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-[1.1]">
              Membangun Fondasi Dharma di Era Digital
            </h2>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-slate-600 leading-relaxed text-justify whitespace-pre-wrap"
          >
            {about.description || "Deskripsi Vihara belum diisi..."}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-4 pt-4"
          >
            {/* Box Statistik diubah menjadi 1rem */}
            <div className="p-5 bg-white/80 backdrop-blur-md rounded-[1rem] border border-white shadow-sm hover:bg-orange-50 transition-colors">
              <h4 className="font-black text-orange-500 text-3xl mb-1">
                {about.active_students || 0}+
              </h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Murid Aktif
              </p>
            </div>
            <div className="p-5 bg-white/80 backdrop-blur-md rounded-[1rem] border border-white shadow-sm hover:bg-blue-50 transition-colors">
              <h4 className="font-black text-blue-500 text-3xl mb-1">
                {about.founded_year || 2004}
              </h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Tahun Berdiri
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Visi Misi Container diubah menjadi 1rem */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="bg-white/70 backdrop-blur-xl rounded-[1rem] p-12 md:p-20 shadow-sm border border-white"
      >
        <h3 className="text-3xl font-bold text-center mb-16 underline decoration-orange-300 decoration-4 underline-offset-8">
          Visi & Misi
        </h3>
        <div className="space-y-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex p-3 bg-orange-50 rounded-[1rem] text-orange-500 mb-2">
              <Award size={32} />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Visi Utama
            </h4>
            <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed italic">
              &quot;{vision.visi || "Visi belum diisi..."}&quot;
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {vision.misi?.map((text: string, idx: number) => (
              <div
                key={idx}
                className="relative p-8 bg-white/80 backdrop-blur-md rounded-[1rem] border border-white shadow-sm hover:bg-orange-50 transition-colors"
              >
                <span className="absolute -top-4 -left-4 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-600 leading-relaxed text-justify">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-8 text-center">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              Our Core Values
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {values.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-white/80 backdrop-blur-md rounded-[1rem] border border-white shadow-sm flex flex-col items-center hover:border-orange-200 transition-all"
                >
                  <span className="text-xl font-black text-orange-500">
                    {item.l}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    {item.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
