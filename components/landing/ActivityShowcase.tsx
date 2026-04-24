/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";

export default function ActivityShowcase({ images }: { images: any[] }) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h3 className="text-3xl font-bold mb-4 text-slate-900">Galeri Ceria</h3>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Momen indah yang membangun kebanggaan dan identitas Buddhis anak-anak
          melalui berbagai kegiatan seru.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-6 py-4 overflow-x-auto custom-scrollbar snap-x snap-mandatory pb-8">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-80 h-56 shrink-0 rounded-[1rem] overflow-hidden shadow-md border-4 border-white transition-transform duration-500 hover:scale-105 snap-center"
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
      </div>
    </section>
  );
}
