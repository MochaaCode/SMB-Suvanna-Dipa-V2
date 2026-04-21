/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function MilestoneSection({
  milestone,
  testimonial,
}: {
  milestone: any;
  testimonial: any;
}) {
  return (
    <>
      <section id="activity" className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Milestone Dharma</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Perjalanan penuh makna melalui kegiatan rutin dan peringatan hari
              besar agama Buddha di SMB Suvanna Dipa.
            </p>
          </motion.header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestone.items?.map((item: any, idx: number) => (
              // Radius diubah menjadi 1rem
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white/80 backdrop-blur-md rounded-[1rem] overflow-hidden border border-white shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-48 w-full bg-slate-200">
                  <Image
                    src={item.img || "/images/placeholder.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center mb-16 italic font-serif text-slate-800 tracking-tight"
          >
            Apa Kata Mereka?
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonial.items?.map((testi: any, index: number) => (
              // Radius diubah menjadi 1rem
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="p-8 bg-white/80 backdrop-blur-md rounded-[1rem] shadow-sm border border-white flex flex-col justify-between"
              >
                <p className="text-slate-600 italic mb-6 leading-relaxed">
                  &quot;{testi.text}&quot;
                </p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                  <div className="w-10 h-10 bg-orange-200 rounded-full" />
                  <div>
                    <p className="font-bold text-sm">{testi.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      {testi.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
