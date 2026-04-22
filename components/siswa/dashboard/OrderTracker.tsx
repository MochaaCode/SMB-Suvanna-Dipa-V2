"use client";

import { Package, ShoppingBag } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import Link from "next/link";
import type { DashboardActiveOrder } from "@/actions/student/dashboard";

interface OrderTrackerProps {
  activeOrders: DashboardActiveOrder[];
}

export function OrderTracker({ activeOrders }: OrderTrackerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
          Pesanan Terkini
        </h3>
        <Link
          href="/siswa/store"
          className="text-[10px] font-bold text-orange-600 hover:underline"
        >
          Katalog Produk &rarr;
        </Link>
      </div>
      {activeOrders && activeOrders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeOrders.map((order) => (
            <AppCard
              key={order.id}
              className="p-3.5 border-slate-200 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors shadow-sm rounded-[1rem]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 shadow-sm">
                  <Package size={16} />
                </div>
                <div>
                  <p className="text-[12px] font-black text-slate-800 line-clamp-1">
                    {order.products?.name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                    {format(new Date(order.created_at), "dd MMM yyyy", {
                      locale: localeID,
                    })}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
                  order.status === "pending"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-blue-50 text-blue-600 border-blue-200",
                )}
              >
                {order.status}
              </div>
            </AppCard>
          ))}
        </div>
      ) : (
        <AppCard className="p-6 border-dashed border-slate-200 text-center bg-slate-50/50 rounded-[1.5rem]">
          <ShoppingBag size={24} className="mx-auto text-slate-300 mb-2" />
          <p className="text-[11px] font-bold text-slate-400 italic">
            Belum ada pesanan yang sedang diproses.
          </p>
        </AppCard>
      )}
    </div>
  );
}
