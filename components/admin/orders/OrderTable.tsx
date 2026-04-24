/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Package,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { updateOrderStatus } from "@/actions/admin/orders";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppButton } from "../../shared/AppButton";

import type { OrderWithDetails } from "@/actions/admin/orders";
import type { OrderStatus } from "@/types";

export function OrderTable({
  initialOrders,
}: {
  initialOrders: OrderWithDetails[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_orders" },
        () => {
          router.refresh();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const totalPages = Math.ceil(initialOrders.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return initialOrders.slice(start, start + itemsPerPage);
  }, [initialOrders, currentPage]);

  const handleStatusUpdate = async (id: number, status: OrderStatus) => {
    const tid = toast.loading(`Mengubah status pesanan...`);
    try {
      await updateOrderStatus(id, status);
      toast.success(`Pesanan berhasil di-${status}!`, { id: tid });
    } catch (err: any) {
      toast.error(err.message, { id: tid });
    }
  };

  return (
    <div className="bg-white rounded-[1rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto min-h-100">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-b border-slate-100">
              <TableHead className="w-60 text-xs font-bold uppercase tracking-wider py-4">
                Informasi Pembeli
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider py-4">
                Item Produk
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase tracking-wider py-4">
                Harga Poin
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase tracking-wider py-4">
                Status
              </TableHead>
              <TableHead className="w-20 text-center text-xs font-bold uppercase tracking-wider py-4">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-slate-50/50 transition-colors border-b border-slate-50"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-[0.8rem] bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-black text-xs">
                      {order.profiles?.full_name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-slate-800 leading-tight">
                        {order.profiles?.full_name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <User size={10} />{" "}
                        {order.profiles?.buddhist_name || "Siswa"}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-[0.8rem] overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                      {order.products?.image_url ? (
                        <Image
                          src={order.products.image_url}
                          alt="Item"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <Package
                          size={16}
                          className="text-slate-300 m-auto absolute inset-0"
                        />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-700 leading-tight truncate max-w-37.5">
                      {order.products?.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-lg font-black text-xs">
                    <Sparkles size={12} fill="currentColor" />
                    {order.products?.price?.toLocaleString()}
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4 text-center">
                  <Badge
                    className={`
                    ${order.status === "pending" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                    ${order.status === "diproses" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                    ${order.status === "selesai" ? "bg-green-50 text-green-700 border-green-200" : ""}
                    ${order.status === "dibatalkan" ? "bg-red-50 text-red-700 border-red-200" : ""}
                    px-2.5 py-0.5 rounded-[1rem] text-[10px] font-black uppercase tracking-widest border shadow-none
                  `}
                  >
                    {order.status}
                  </Badge>
                </TableCell>

                <TableCell className="px-6 py-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <AppButton
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-lg border-slate-200"
                      >
                        <MoreVertical size={14} />
                      </AppButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-[1rem] p-1.5 shadow-xl border-slate-200 w-48"
                    >
                      <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase px-3 py-2">
                        Update Pesanan
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order.id, "diproses")}
                        className="p-2.5 rounded-lg font-bold text-xs cursor-pointer hover:bg-blue-50 text-blue-700"
                      >
                        <Clock size={14} className="mr-2" /> Proses Pesanan
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order.id, "selesai")}
                        className="p-2.5 rounded-lg font-bold text-xs cursor-pointer hover:bg-green-50 text-green-700"
                      >
                        <CheckCircle2 size={14} className="mr-2" /> Tandai
                        Selesai
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(order.id, "dibatalkan")
                        }
                        className="p-2.5 rounded-lg font-bold text-xs cursor-pointer hover:bg-red-50 text-red-600"
                      >
                        <XCircle size={14} className="mr-2" /> Batalkan (Refund)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto rounded-b-[1rem]">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Menampilkan {paginatedData.length} dari {initialOrders.length} Pesanan
        </p>
        <div className="flex gap-2">
          <AppButton
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-slate-200"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </AppButton>
          <div className="flex items-center px-3 text-xs font-black text-slate-600">
            {currentPage} / {totalPages || 1}
          </div>
          <AppButton
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-slate-200"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight size={16} />
          </AppButton>
        </div>
      </div>
    </div>
  );
}
