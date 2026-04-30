/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
      <section id="activity" className="pt-24 pb-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-orange-500 mb-6 leading-[1.1]">
              Aktivitas Kami
            </h2>
            <div className="w-full text-center mb-4">
              <p className="text-slate-900 leading-relaxed text-center">
                Momen indah yang membangun kebanggaan dan identitas Buddhis anak-anak melalui berbagai kegiatan seru.
              </p>
            </div>
          </motion.header>

          {/* Desktop Static Grid (Only shows if items <= 4) */}
          {(milestone.items?.length || 0) <= 4 && (
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestone.items?.map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group bg-white/80 backdrop-blur-md rounded-[1rem] border-2 border-orange-400 shadow-sm hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 ease-out"
                >
                  <div className="p-6 pt-8 flex flex-col gap-3 text-center">
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-lg text-slate-800 group-hover:text-orange-600 transition-colors leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Auto-Scrolling Marquee (Always on Mobile. On Desktop only if items > 4) */}
          <div className={`${(milestone.items?.length || 0) > 4 ? 'flex' : 'md:hidden flex'} overflow-hidden w-[100vw] lg:w-full -mx-6 lg:mx-0 pt-8 pb-6 pl-6 lg:pl-0 relative`}>
            <motion.div
              className="flex min-w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            >
              {/* Set 1 */}
              <div className="flex gap-4 lg:gap-6 pr-4 lg:pr-6">
                {milestone.items?.map((item: any, idx: number) => (
                  <div
                    key={`marquee1-${idx}`}
                    className="w-64 lg:w-72 relative group bg-white/80 backdrop-blur-md rounded-[1rem] border-2 border-orange-400 shadow-sm transition-all duration-300 ease-out"
                  >
                    <div className="p-6 pt-8 flex flex-col gap-3 text-center">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-lg text-slate-800 transition-colors leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Set 2 (Perfect Duplicate) */}
              <div className="flex gap-4 lg:gap-6 pr-4 lg:pr-6">
                {milestone.items?.map((item: any, idx: number) => (
                  <div
                    key={`marquee2-${idx}`}
                    className="w-64 lg:w-72 relative group bg-white/80 backdrop-blur-md rounded-[1rem] border-2 border-orange-400 shadow-sm transition-all duration-300 ease-out"
                  >
                    <div className="p-6 pt-8 flex flex-col gap-3 text-center">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-lg text-slate-800 transition-colors leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl md:text-3xl font-extrabold text-orange-500 mb-6 leading-[1.1]">
              Apa Kata Mereka?
            </h3>
            <div className="w-full text-center mb-4">
              <p className="text-slate-900 leading-relaxed text-center">
                Cerita dan pengalaman berharga dari orang tua dan umat mengenai dampak positif kehadiran SMB Suvanna Dipa.
              </p>
            </div>
          </motion.header>

          {/* Desktop Static Grid (Only shows if items <= 3) */}
          {(testimonial.items?.length || 0) <= 3 && (
            <div className="hidden md:grid md:grid-cols-3 gap-8">
              {testimonial.items?.map((testi: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.15 }}
                  className="p-8 bg-white/80 backdrop-blur-md rounded-[1rem] shadow-sm border-2 border-orange-400 flex flex-col justify-between hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 ease-out"
                >
                  <p className="text-slate-900 text-sm italic mb-6 leading-relaxed">
                    &quot;{testi.text}&quot;
                  </p>
                  <div className="flex items-center gap-4 border-t border-orange-300 pt-4 mt-auto">
                    <div className="w-10 h-10 bg-orange-200 rounded-full shrink-0" />
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
          )}

          {/* Auto-Scrolling Marquee (Always on Mobile. On Desktop only if items > 3) */}
          <div className={`${(testimonial.items?.length || 0) > 3 ? 'flex' : 'md:hidden flex'} overflow-hidden w-[100vw] lg:w-full -mx-6 lg:mx-0 pt-4 pb-6 pl-6 lg:pl-0 relative`}>
            <motion.div
              className="flex min-w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            >
              {/* Set 1 */}
              <div className="flex gap-4 lg:gap-8 pr-4 lg:pr-8">
                {testimonial.items?.map((testi: any, index: number) => (
                  <div
                    key={`testi1-${index}`}
                    className="w-[80vw] sm:w-72 lg:w-[380px] p-8 bg-white/80 backdrop-blur-md rounded-[1rem] shadow-sm border-2 border-orange-400 flex flex-col justify-between transition-all duration-300 ease-out hover:bg-orange-50"
                  >
                    <p className="text-slate-900 text-sm italic mb-6 leading-relaxed">
                      &quot;{testi.text}&quot;
                    </p>
                    <div className="flex items-center gap-4 border-t border-orange-300 pt-4 mt-auto">
                      <div className="w-10 h-10 bg-orange-200 rounded-full shrink-0" />
                      <div>
                        <p className="font-bold text-sm">{testi.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          {testi.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Set 2 (Perfect Duplicate) */}
              <div className="flex gap-4 lg:gap-8 pr-4 lg:pr-8">
                {testimonial.items?.map((testi: any, index: number) => (
                  <div
                    key={`testi2-${index}`}
                    className="w-[80vw] sm:w-72 lg:w-[380px] p-8 bg-white/80 backdrop-blur-md rounded-[1rem] shadow-sm border-2 border-orange-400 flex flex-col justify-between transition-all duration-300 ease-out hover:bg-orange-50"
                  >
                    <p className="text-slate-900 text-sm italic mb-6 leading-relaxed">
                      &quot;{testi.text}&quot;
                    </p>
                    <div className="flex items-center gap-4 border-t border-orange-300 pt-4 mt-auto">
                      <div className="w-10 h-10 bg-orange-200 rounded-full shrink-0" />
                      <div>
                        <p className="font-bold text-sm">{testi.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          {testi.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
