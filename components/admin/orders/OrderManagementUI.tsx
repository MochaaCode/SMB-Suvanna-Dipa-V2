"use client";

import { useState, useMemo } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Sparkles,
  Search,
  PackageX,
} from "lucide-react";
import { OrderTable } from "./OrderTable";
import { PageHeader } from "../../shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/useDebounce";

import type { OrderWithDetails } from "@/actions/admin/orders";

export function OrderManagementUI({
  initialOrders,
}: {
  initialOrders: OrderWithDetails[];
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [activeTab, setActiveTab] = useState("all");

  const stats = useMemo(
    () => [
      {
        label: "Pesanan Masuk",
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
        label: "Telah Selesai",
        val: initialOrders.filter((o) => o.status === "selesai").length,
        icon: <CheckCircle2 size={20} />,
        color: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-100",
      },
    ],
    [initialOrders],
  );

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const matchSearch =
        order.profiles?.full_name
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        order.products?.name
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase());

      const matchTab = activeTab === "all" || order.status === activeTab;

      return matchSearch && matchTab;
    });
  }, [initialOrders, debouncedSearch, activeTab]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <PageHeader
        title="PENUKARAN"
        highlightText="POIN"
        icon={<ShoppingBag size={24} />}
        subtitle="Pantau dan kelola penukaran poin siswa secara langsung."
        themeColor="orange"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-[1rem] border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div
              className={`p-3.5 ${s.bg} ${s.color} ${s.border} border rounded-[1rem]`}
            >
              {s.icon}
            </div>
            <div className="space-y-1 text-left">
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

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-[1rem] border border-slate-200 shadow-sm">
        <Tabs
          defaultValue="all"
          className="w-full lg:w-auto"
          onValueChange={setActiveTab}
        >
          <TabsList className="bg-slate-100 p-1 rounded-[0.8rem] h-11">
            <TabsTrigger
              value="all"
              className="rounded-[0.6rem] text-xs font-bold px-4 data-[state=active]:bg-white data-[state=active]:text-orange-600"
            >
              Semua
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-[0.6rem] text-xs font-bold px-4 data-[state=active]:bg-white data-[state=active]:text-orange-600"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="diproses"
              className="rounded-[0.6rem] text-xs font-bold px-4 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Diproses
            </TabsTrigger>
            <TabsTrigger
              value="selesai"
              className="rounded-[0.6rem] text-xs font-bold px-4 data-[state=active]:bg-white data-[state=active]:text-green-600"
            >
              Selesai
            </TabsTrigger>
            <TabsTrigger
              value="dibatalkan"
              className="rounded-[0.6rem] text-xs font-bold px-4 data-[state=active]:bg-white data-[state=active]:text-red-600"
            >
              Batal
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full lg:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            placeholder="Cari nama siswa / barang..."
            className="pl-9 h-11 rounded-[0.8rem] border-slate-200 focus-visible:ring-orange-500 bg-slate-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[1rem] border border-dashed border-slate-200">
          <PackageX size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold">
            Tidak ada pesanan ditemukan.
          </p>
        </div>
      ) : (
        <OrderTable initialOrders={filteredOrders} />
      )}
    </div>
  );
}
