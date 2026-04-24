/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Mail, MessageCircle, Earth } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactFooterSection({ contact }: { contact: any }) {
  return (
    <>
      <section id="contact" className="py-24 px-6 bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16"
        >
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900">
              Mari Berjumpa!
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-md rounded-[1rem] border border-white shadow-sm hover:border-green-200 transition-colors">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
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
              <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-md rounded-[1rem] border border-white shadow-sm hover:border-pink-200 transition-colors">
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center">
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
              <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-md rounded-[1rem] border border-white shadow-sm hover:border-blue-200 transition-colors">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
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
          <div className="w-full min-h-75 bg-white rounded-[1rem] shadow-sm overflow-hidden border border-slate-200 relative group">
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

      <footer className="bg-slate-900 text-slate-400 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="space-y-4">
                <h3 className="text-white font-bold text-2xl tracking-tight">
                  Sekolah Minggu Buddha Suvanna Dipa
                </h3>
                <p className="text-sm leading-relaxed max-w-sm">
                  Membentuk generasi muda &apos;Buddhis seutuhnya&apos; melalui
                  pelayanan terpadu dan sistematis. Saddha, Sila, Sippa.
                </p>
                <p className="text-xs pt-4 border-t border-slate-800">
                  © 2026 SMB Suvanna Dipa. All rights reserved.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">
                  Informasi
                </h4>
                <ul className="space-y-3 text-xs">
                  <li>
                    <Link
                      href="#about"
                      className="hover:text-orange-400 transition-colors"
                    >
                      Tentang Kami
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#activity"
                      className="hover:text-orange-400 transition-colors"
                    >
                      Program Kerja
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">
                  Legalitas
                </h4>
                <ul className="space-y-3 text-xs">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-orange-400 transition-colors"
                    >
                      Kebijakan Privasi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-orange-400 transition-colors"
                    >
                      Syarat & Ketentuan
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4 col-span-2 md:col-span-1">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">
                  Aksi Cepat
                </h4>
                <div className="flex flex-col gap-3">
                  <Link
                    href={`https://wa.me/${contact.whatsapp || "628129663404"}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-[1rem] hover:bg-green-500 hover:text-white transition-all text-xs font-bold border border-green-500/20"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </Link>
                  <Link
                    href={`https://instagram.com/${contact.instagram || "smbsuvannadipa"}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-500 rounded-[1rem] hover:bg-pink-500 hover:text-white transition-all text-xs font-bold border border-pink-500/20"
                  >
                    <Earth size={14} /> Instagram
                  </Link>
                  <Link
                    href={`mailto:${contact.email || "smbsuvannadipa@gmail.com"}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-[1rem] hover:bg-blue-500 hover:text-white transition-all text-xs font-bold border border-blue-500/20"
                  >
                    <Mail size={14} /> Email
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
