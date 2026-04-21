"use client";

import { useState } from "react";
import { CardTable } from "./CardTable";
import { AddCardModal } from "./AddCardModal";
import { PageHeader } from "../../shared/PageHeader";
import { AppButton } from "../../shared/AppButton";
import { AppCard } from "../../shared/AppCard";
import {
  CreditCard,
  Plus,
  Cpu,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
} from "lucide-react";

// IMPORT TIPE KETAT
import type { CardWithProfile } from "@/actions/admin/cards";
import type { Profile } from "@/types";

interface CardManagementUIProps {
  initialCards: CardWithProfile[];
  availableUsers: Pick<Profile, "id" | "full_name" | "role">[];
}

export function CardManagementUI({
  initialCards,
  availableUsers,
}: CardManagementUIProps) {
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // Perhitungan statistik dari data cards yang dilempar dari server
  const stats = [
    {
      label: "Total Kartu Terdaftar",
      val: initialCards.length,
      icon: <CreditCard size={20} />,
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Kartu Terpakai (Aktif)",
      val: initialCards.filter((c) => c.status === "terpakai").length,
      icon: <CheckCircle2 size={20} />,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      label: "Kartu Tersedia (Kosong)",
      val: initialCards.filter((c) => c.status === "tersedia").length,
      icon: <AlertCircle size={20} />,
      color: "text-orange-700",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* 1. HEADER MENGGUNAKAN PAGEHEADER (KONSISTEN) */}
      <PageHeader
        title="MANAJEMEN"
        highlightText="KARTU RFID"
        icon={<Cpu size={24} />}
        subtitle="Registrasi & Sinkronisasi Identitas Digital Siswa"
        themeColor="orange"
        rightContent={
          <AppButton
            onClick={() => setAddModalOpen(true)}
            leftIcon={<Plus size={16} />}
            className="font-bold shadow-md"
          >
            Daftarkan Kartu
          </AppButton>
        }
      />

      {/* 2. STATS GRID: DIBUAT LEBIH ELEGAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-[1rem] border border-slate-200 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors"
          >
            <div
              className={`p-3.5 ${s.bg} ${s.color} ${s.border} border rounded-xl`}
            >
              {s.icon}
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider leading-none">
                {s.label}
              </p>
              <p className={`text-2xl font-bold ${s.color} leading-none`}>
                {s.val}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TABLE SECTION TITLE */}
      <div className="flex items-center gap-3 px-2 pt-2">
        <LayoutGrid size={16} className="text-orange-500" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Database Inventaris Kartu
        </h2>
        <div className="h-px bg-slate-200 grow ml-2" />
      </div>

      {/* 4. TABLE CONTAINER MENGGUNAKAN ADMINCARD */}
      <AppCard className="p-0 border-slate-200 shadow-sm">
        {/* Kita bungkus CardTable di sini, pastikan CardTable tidak punya border luaran lagi */}
        <CardTable cards={initialCards} availableUsers={availableUsers} />
      </AppCard>

      {/* 5. MODALS */}
      <AddCardModal open={isAddModalOpen} setOpen={setAddModalOpen} />
    </div>
  );
}
