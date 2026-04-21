"use client";

import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { OrderTable } from "./OrderTable";
import { PageHeader } from "../../shared/PageHeader";
import { AppCard } from "../../shared/AppCard";

// IMPORT TIPE KETAT
import type { OrderWithDetails } from "@/actions/admin/orders";

export function OrderManagementUI({
  initialOrders,
}: {
  initialOrders: OrderWithDetails[];
}) {
  const stats = [
    {
      label: "Pesanan Masuk (Pending)",
      val: initialOrders.filter((o) => o.status === "pending").length,
      icon: <Sparkles size={20} />,
      color: "text-orange-700",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
    {
      label: "Sedang Diproses",
      val: initialOrders.filter((o) => o.status === "diproses").length,
      icon: <Clock size={20} />,
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Selesai / Terkirim",
      val: initialOrders.filter((o) => o.status === "selesai").length,
      icon: <CheckCircle2 size={20} />,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-100",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* 1. HEADER SECTION */}
      <PageHeader
        title="MANAJEMEN"
        highlightText="ORDERAN"
        icon={<ShoppingBag size={24} />}
        subtitle="Validasi & Distribusi Penukaran Hadiah Siswa"
        themeColor="orange"
      />

      {/* 2. STATS CARDS */}
      {initialOrders.length > 0 && (
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
      )}

      {/* 3. TABLE TITLE */}
      <div className="flex items-center gap-3 px-2 pt-2">
        <LayoutGrid size={16} className="text-orange-500" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Riwayat Pesanan Point Shop
        </h2>
        <div className="h-px bg-slate-200 grow ml-2" />
      </div>

      {/* 4. TABLE COMPONENT WRAPPED IN ADMIN CARD */}
      <AppCard noPadding className="border-slate-200 shadow-sm">
        <OrderTable initialOrders={initialOrders} />
      </AppCard>
    </div>
  );
}
