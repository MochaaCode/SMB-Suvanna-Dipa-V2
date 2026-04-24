"use client";

import { useState, useMemo } from "react";
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

  const stats = useMemo(() => {
    return [
      {
        label: "Total Inventaris",
        val: initialCards.length,
        icon: <CreditCard size={20} />,
        bg: "bg-slate-50",
        color: "text-slate-700",
        border: "border-slate-200",
      },
      {
        label: "Siap Digunakan",
        val: initialCards.filter((c) => c.status === "tersedia").length,
        icon: <CheckCircle2 size={20} />,
        bg: "bg-green-50",
        color: "text-green-700",
        border: "border-green-100",
      },
      {
        label: "Aktif Terpasang",
        val: initialCards.filter((c) => c.status === "terpakai").length,
        icon: <Cpu size={20} />,
        bg: "bg-blue-50",
        color: "text-blue-700",
        border: "border-blue-100",
      },
      {
        label: "Laporan Hilang",
        val: initialCards.filter((c) => c.status === "hilang").length,
        icon: <AlertCircle size={20} />,
        bg: "bg-red-50",
        color: "text-red-700",
        border: "border-red-100",
      },
    ];
  }, [initialCards]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <PageHeader
        title="INVENTARIS"
        highlightText="KARTU RFID"
        subtitle="Manajemen identitas fisik dan otentikasi kartu akses siswa"
        icon={<CreditCard size={24} />}
        themeColor="orange"
        rightContent={
          <AppButton
            onClick={() => setAddModalOpen(true)}
            leftIcon={<Plus size={16} />}
            className="font-bold rounded-[1rem]"
          >
            Daftar Kartu Baru
          </AppButton>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-[1rem] border border-slate-200 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors"
          >
            <div
              className={`p-3.5 ${s.bg} ${s.color} ${s.border} border rounded-[1rem]`}
            >
              {s.icon}
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider leading-none">
                {s.label}
              </p>
              <p className={`text-2xl font-black ${s.color} leading-none`}>
                {s.val}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 px-2 pt-2">
        <LayoutGrid size={16} className="text-orange-500" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Database Inventaris Kartu
        </h2>
        <div className="h-px bg-slate-200 grow ml-2" />
      </div>

      <AppCard
        noPadding
        className="border-slate-200 shadow-sm rounded-[1rem] overflow-hidden bg-transparent"
      >
        <CardTable
          initialCards={initialCards}
          availableUsers={availableUsers}
        />
      </AppCard>

      <AddCardModal open={isAddModalOpen} setOpen={setAddModalOpen} />
    </div>
  );
}
