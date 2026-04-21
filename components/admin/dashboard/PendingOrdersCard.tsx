"use client";

import { ShoppingBag, ArrowRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ProductOrderWithRelations } from "@/types";

interface PendingOrdersCardProps {
  orders: ProductOrderWithRelations[];
}

export function PendingOrdersCard({ orders }: PendingOrdersCardProps) {
  return (
    <div className="bg-white p-6 rounded-[1rem] border border-slate-200 shadow-sm space-y-5 flex-1 w-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg text-red-600 border border-red-100">
            <ShoppingBag size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Pesanan Tertunda
          </h3>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
            orders.length > 0
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-green-50 text-green-700 border-green-200"
          }`}
        >
          {orders.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          )}
          {orders.length} MENUNGGU
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
        {orders.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-xs font-medium text-slate-400">
              Semua pesanan telah diproses.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-4 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
            >
              <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-white">
                <Image
                  src={order.products?.image_url || "/images/placeholder.jpg"}
                  alt={order.products?.name || "Produk"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-red-600 transition-colors">
                  {order.products?.name || "Produk Tidak Ditemukan"}
                </p>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <User size={12} className="text-slate-400" />{" "}
                  {order.profiles?.full_name || "Siswa Tidak Ditemukan"}
                </div>
              </div>

              <Link
                href="/admin/orders"
                className="p-2 bg-white text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-colors"
                title="Proses Pesanan"
              >
                <ArrowRight size={16} />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
