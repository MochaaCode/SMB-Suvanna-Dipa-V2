/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ActivityShowcase({ images }: { images: any[] }) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-8 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold text-orange-500 mb-6 leading-[1.1]">
            Galeri Ceria
          </h3>
          <div className="w-full text-center mb-4">
            <p className="text-slate-900 leading-relaxed text-center">
              Kumpulan potret keceriaan dan semangat kebersamaan anak-anak dalam berbagai kegiatan di SMB Suvanna Dipa.
            </p>
          </div>
        </motion.header>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop Static Grid (Only shows if items <= 4) */}
        {(images?.length || 0) <= 4 && (
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.1 }}
                className="relative h-56 rounded-[1rem] overflow-hidden shadow-md border-2 border-orange-400 transition-transform duration-500 hover:scale-105"
              >
                <Image
                  src={img.url || "/images/smbsd-bg-hd.jpg"}
                  alt={img.caption || "Kegiatan SMB"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-white font-bold text-sm leading-tight shadow-sm z-10">
                  {img.caption}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Auto-Scrolling Marquee (Always on Mobile. On Desktop only if items > 4) */}
        <div className={`${(images?.length || 0) > 4 ? 'flex' : 'md:hidden flex'} overflow-hidden w-[100vw] lg:w-full -mx-6 lg:mx-0 pt-4 pb-8 pl-6 lg:pl-0 relative`}>
          <motion.div
            className="flex min-w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {/* Set 1 */}
            <div className="flex gap-4 lg:gap-6 pr-4 lg:pr-6">
              {images.map((img, i) => (
                <div
                  key={`gal1-${i}`}
                  className="relative w-72 lg:w-80 h-56 shrink-0 rounded-[1rem] overflow-hidden shadow-md border-2 border-orange-400 transition-transform duration-500 hover:scale-105"
                >
                  <Image
                    src={img.url || "/images/smbsd-bg-hd.jpg"}
                    alt={img.caption || "Kegiatan SMB"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-4 left-4 right-4 text-white font-bold text-sm leading-tight shadow-sm z-10">
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>

            {/* Set 2 (Perfect Duplicate) */}
            <div className="flex gap-4 lg:gap-6 pr-4 lg:pr-6">
              {images.map((img, i) => (
                <div
                  key={`gal2-${i}`}
                  className="relative w-72 lg:w-80 h-56 shrink-0 rounded-[1rem] overflow-hidden shadow-md border-2 border-orange-400 transition-transform duration-500 hover:scale-105"
                >
                  <Image
                    src={img.url || "/images/smbsd-bg-hd.jpg"}
                    alt={img.caption || "Kegiatan SMB"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-4 left-4 right-4 text-white font-bold text-sm leading-tight shadow-sm z-10">
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
