/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Mail, MessageCircle, Earth, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactFooterSection({ contact }: { contact: any }) {
  return (
    <>
      <section id="contact" className="py-24 px-6 bg-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16"
        >
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-orange-500 leading-[1.1]">
              Hubungi Kami
            </h2>
            <div className="space-y-4">
            <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-md rounded-[1rem] border-2 border-orange-400 shadow-sm hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 ease-out">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    WhatsApp
                  </p>
                  <p className="font-bold text-lg">
                    +{contact.whatsapp || "62 812-9663-404"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-md rounded-[1rem] border-2 border-orange-400 shadow-sm hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 ease-out">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                  <Earth size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Instagram
                  </p>
                  <p className="font-bold text-lg">
                    @{contact.instagram || "smbsuvannadipa"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-md rounded-[1rem] border-2 border-orange-400 shadow-sm hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 ease-out">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Email
                  </p>
                  <p className="font-bold text-lg">
                    {contact.email || "smbsuvannadipa@gmail.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full min-h-[300px] bg-white rounded-[1rem] overflow-hidden border-4 border-orange-500 shadow-2xl shadow-orange-500/40 relative group hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(249,115,22,0.6)] transition-all duration-500 ease-out">
            {contact.map_url && (
              <iframe
                src={contact.map_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale contrast-[1.1] group-hover:grayscale-0 transition-all duration-700"
              />
            )}
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-[1rem] border border-slate-100 shadow-lg pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity">
              <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider text-center">
                Lokasi Vihara Suvanna Dipa di Google Maps
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-8 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6 px-10 md:px-0">
          
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg md:text-2xl tracking-tight">
              Sekolah Minggu Buddha Suvanna Dipa
            </h3>
            <p className="text-xs text-slate-500">
              © 2026 SMB Suvanna Dipa. Hak cipta dilindungi.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link
              href={`https://wa.me/${contact.whatsapp || "628129663404"}`}
              target="_blank"
              title="WhatsApp"
              className="p-3 bg-orange-500/10 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all border border-orange-500/20"
            >
              <MessageCircle size={18} />
            </Link>
            <Link
              href={`https://instagram.com/${contact.instagram || "smbsuvannadipa"}`}
              target="_blank"
              title="Instagram"
              className="p-3 bg-orange-500/10 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all border border-orange-500/20"
            >
              <Earth size={18} />
            </Link>
            <Link
              href={`mailto:${contact.email || "smbsuvannadipa@gmail.com"}`}
              target="_blank"
              title="Email"
              className="p-3 bg-orange-500/10 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all border border-orange-500/20"
            >
              <Mail size={18} />
            </Link>
          </div>
          
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/5 text-white rounded-full hover:bg-orange-500 hover:text-white transition-all border border-white/10 hover:border-orange-500 flex items-center justify-center group"
          title="Kembali ke Atas"
        >
          <ChevronUp size={18} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </footer>
    </>
  );
}
