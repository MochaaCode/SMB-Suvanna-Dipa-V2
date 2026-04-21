/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Package,
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

// IMPORT TIPE KETAT
import type { OrderWithDetails } from "@/actions/admin/orders";
import type { OrderStatus } from "@/types";

export function OrderTable({
  initialOrders,
}: {
  initialOrders: OrderWithDetails[];
}) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleStatusUpdate = async (id: number, status: OrderStatus) => {
    const tid = toast.loading(`Memperbarui status ke ${status}...`);
    try {
      await updateOrderStatus(id, status);
      toast.success(`Pesanan berhasil diupdate!`, { id: tid });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    }
  };

  const filtered = initialOrders.filter(
    (o) =>
      o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.products?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "diproses":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "selesai":
        return "bg-green-50 text-green-700 border-green-200";
      case "dibatalkan":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* SEARCH BAR */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="relative max-w-sm group">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Cari nama siswa atau hadiah..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Waktu / ID
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Siswa (Pemesan)
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Hadiah Ditukar
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-16 text-center text-slate-400 font-medium text-sm"
                >
                  Riwayat pesanan tidak ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow
                  key={order.id}
                  className="group hover:bg-slate-50/50 border-b border-slate-100 transition-colors"
                >
                  {/* WAKTU & ID */}
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-bold text-slate-800">
                        {new Date(order.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        #ORD-{order.id}
                      </span>
                    </div>
                  </TableCell>

                  {/* SISWA */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 group-hover:border-orange-200 transition-colors shrink-0">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <span className="font-bold text-slate-800 text-sm truncate max-w-50">
                          {order.profiles?.full_name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                          {order.profiles?.buddhist_name || "Siswa"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* PRODUK / HADIAH */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {order.products?.image_url ? (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                          <Image
                            src={order.products.image_url}
                            alt="Product"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 border border-dashed border-slate-200">
                          <Package size={16} />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 truncate max-w-45">
                          {order.products?.name}
                        </span>
                        <span className="text-[11px] font-bold text-orange-600">
                          {order.products?.price?.toLocaleString()} PTS
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="px-6 py-4 text-center">
                    <Badge
                      className={`${getStatusColor(
                        order.status,
                      )} px-2.5 py-1 rounded-md font-bold uppercase text-[10px] tracking-wider shadow-none border`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>

                  {/* AKSI / DROPDOWN */}
                  <TableCell className="px-6 py-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100 hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
                        >
                          <MoreVertical size={16} className="text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-[1rem] p-2 border-slate-200 shadow-xl"
                      >
                        <DropdownMenuLabel className="text-[10px] font-bold uppercase text-slate-400 px-2.5 py-1.5 tracking-wider">
                          Ubah Status Pesanan
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(order.id, "diproses")
                          }
                          className="p-2.5 rounded-lg cursor-pointer hover:bg-blue-50 group transition-colors"
                        >
                          <Clock className="mr-2.5 text-blue-500" size={14} />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">
                            Diproses
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(order.id, "selesai")
                          }
                          className="p-2.5 rounded-lg cursor-pointer hover:bg-green-50 group transition-colors mt-1"
                        >
                          <CheckCircle2
                            className="mr-2.5 text-green-500"
                            size={14}
                          />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-green-700">
                            Selesaikan
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(order.id, "dibatalkan")
                          }
                          className="p-2.5 rounded-lg cursor-pointer hover:bg-red-50 group transition-colors"
                        >
                          <XCircle className="mr-2.5 text-red-500" size={14} />
                          <span className="text-xs font-bold text-red-600">
                            Batalkan (Refund)
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
