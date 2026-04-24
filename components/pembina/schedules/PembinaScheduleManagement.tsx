/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { CalendarDays, Megaphone, Edit3, Send, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { AppButton } from "@/components/shared/AppButton";
import { AppModal } from "@/components/shared/AppModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { updateScheduleMaterial } from "@/actions/pembina/schedules";

export function PembinaScheduleManagement({ schedules }: { schedules: any[] }) {
  const [selectedSched, setSelectedSched] = useState<any | null>(null);
  const [materiText, setMateriText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (sched: any) => {
    setSelectedSched(sched);
    setMateriText(sched.content || "");
  };

  const handleSaveMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSched) return;

    setLoading(true);
    const result = await updateScheduleMaterial(selectedSched.id, materiText);

    if (result.success) {
      toast.success(result.message || "Materi berhasil disimpan!");
      setSelectedSched(null);
    } else {
      toast.error(result.error || "Gagal menyimpan materi.");
    }
    setLoading(false);
  };

  // FUNGSI AJAIB: Share to WhatsApp
  const handleShareWA = (sched: any) => {
    const eventDate = new Date(sched.event_date);
    const dateStr = eventDate.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const timeStr = eventDate.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const text = `Nammo Buddhaya 🙏\n\nMengingatkan jadwal kegiatan SMB kita besok:\n\n📌 *Agenda:* ${sched.title}\n🏫 *Kelas:* ${sched.class?.name || "Semua Kelas"}\n📅 *Tanggal:* ${dateStr}\n⏰ *Waktu:* ${timeStr} WIB\n\n📚 *Materi/Persiapan:*\n${sched.content || "Tidak ada persiapan khusus."}\n\nMohon hadir tepat waktu ya! Terima kasih.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Jadwal"
        highlightText="Kegiatan"
        subtitle="Pantau agenda kelas, isi materi ajaran, dan bagikan informasi ke grup WhatsApp siswa."
        icon={<CalendarDays size={24} />}
        themeColor="orange"
      />

      <div className="relative border-l-2 border-orange-100 ml-3 md:ml-6 space-y-8 pb-10">
        {schedules.length > 0 ? (
          schedules.map((sched) => {
            const isAnnouncement = sched.is_announcement;
            const eventDate = new Date(sched.event_date);
            const hasMateri = sched.content && sched.content.trim() !== "";

            return (
              <div key={sched.id} className="relative pl-8 md:pl-10">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-2.75 top-4 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${isAnnouncement ? "bg-blue-500" : "bg-orange-500"}`}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>

                <AppCard className="p-0 overflow-hidden border-slate-200 transition-all hover:shadow-md group">
                  <div
                    className={`p-4 border-b flex items-center gap-3 ${isAnnouncement ? "bg-blue-50 border-blue-100 text-blue-800" : "bg-orange-50/50 border-orange-100 text-orange-900"}`}
                  >
                    {isAnnouncement ? (
                      <Megaphone size={18} />
                    ) : (
                      <CalendarDays size={18} />
                    )}
                    <h3 className="font-bold text-sm md:text-base flex-1">
                      {sched.title}
                    </h3>
                    {!isAnnouncement && sched.class && (
                      <span className="text-[10px] font-black uppercase bg-white px-2 py-1 rounded shadow-sm text-orange-600">
                        {sched.class.name}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col md:flex-row gap-5 items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Clock size={14} />
                        {eventDate.toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        •{" "}
                        {eventDate.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        WIB
                      </div>

                      {/* Tampilan Materi */}
                      {!isAnnouncement && (
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Materi / Catatan Kelas
                          </p>
                          <p
                            className={`text-sm ${hasMateri ? "text-slate-700 font-medium whitespace-pre-wrap" : "text-slate-400 italic"}`}
                          >
                            {hasMateri
                              ? sched.content
                              : "Materi belum diisi oleh Pembina."}
                          </p>
                        </div>
                      )}
                      {isAnnouncement && sched.content && (
                        <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap">
                          {sched.content}
                        </p>
                      )}
                    </div>

                    {/* Tombol Aksi (Hanya untuk jadwal kelas, bukan pengumuman global) */}
                    {!isAnnouncement && (
                      <div className="flex flex-row md:flex-col w-full md:w-auto gap-2 shrink-0">
                        <AppButton
                          onClick={() => handleOpenModal(sched)}
                          variant="outline"
                          className="flex-1 md:w-40 border-orange-200 text-orange-700 hover:bg-orange-50 text-xs"
                          leftIcon={<Edit3 size={14} />}
                        >
                          {hasMateri ? "Edit Materi" : "Isi Materi"}
                        </AppButton>
                        <AppButton
                          onClick={() => handleShareWA(sched)}
                          variant="default"
                          className="flex-1 md:w-40 bg-green-500 hover:bg-green-600 text-white text-xs border-none"
                          leftIcon={<Send size={14} />}
                        >
                          Share ke WA
                        </AppButton>
                      </div>
                    )}
                  </div>
                </AppCard>
              </div>
            );
          })
        ) : (
          <div className="pl-8 text-slate-400 font-medium italic text-sm py-10">
            Belum ada jadwal kegiatan ke depan.
          </div>
        )}
      </div>

      {/* MODAL ISI MATERI */}
      <AppModal
        isOpen={!!selectedSched}
        onClose={() => setSelectedSched(null)}
        title="Materi Kelas"
        description="Tuliskan materi, topik, atau persiapan yang harus dibawa siswa untuk pertemuan ini."
        variant="orange"
      >
        <form onSubmit={handleSaveMateri} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Isi Materi / Deskripsi
            </Label>
            <Textarea
              value={materiText}
              onChange={(e) => setMateriText(e.target.value)}
              placeholder="Contoh: Belajar Paritta suci, bawa alat tulis..."
              className="min-h-37.5 border-slate-200 focus-visible:ring-orange-500 bg-slate-50"
              required
            />
          </div>
          <AppButton type="submit" isLoading={loading} className="w-full h-11">
            Simpan Materi
          </AppButton>
        </form>
      </AppModal>
    </div>
  );
}
