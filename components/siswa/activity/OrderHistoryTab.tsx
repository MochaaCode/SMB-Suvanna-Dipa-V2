"use client";

import { Gift, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { ProductOrderWithRelations } from "@/types";

export function OrderHistoryTab({
  orders,
}: {
  orders: ProductOrderWithRelations[];
}) {
  if (orders.length === 0)
    return <EmptyState message="Belum ada pesanan hadiah." />;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
            <Gift size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-sm truncate">
              {order.products?.name}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {format(new Date(order.created_at), "dd MMM yyyy", {
                locale: id,
              })}
            </p>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <span className="text-xs font-black text-orange-600">
              {order.total_points} Pts
            </span>
            <Badge
              variant="outline"
              className={`text-[9px] uppercase font-black tracking-tighter ${
                order.status === "selesai"
                  ? "bg-green-50 text-green-600 border-green-200"
                  : order.status === "pending"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : order.status === "diproses"
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
      <Clock className="mx-auto text-slate-300 mb-3" size={40} />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-10">
        {message}
      </p>
    </div>
  );
}
