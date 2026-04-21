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
import { Input } from "@/components/ui/input";
import {
  UserPlus,
  Unlink,
  Trash2,
  Search,
  Activity,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";
import { unpairCard, deleteCard, markCardAsLost } from "@/actions/admin/cards";
import { PairingModal } from "./PairingModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AppButton } from "../../shared/AppButton";

// IMPORT TIPE KETAT
import type { CardWithProfile } from "@/actions/admin/cards";
import type { Profile } from "@/types";

interface CardTableProps {
  cards: CardWithProfile[];
  availableUsers: Pick<Profile, "id" | "full_name" | "role">[];
}

export function CardTable({ cards, availableUsers }: CardTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const router = useRouter();

  const filteredCards = cards.filter(
    (c) =>
      c.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUnpair = async (uid: string) => {
    if (window.confirm("Yakin ingin melepas kartu ini dari pengguna?")) {
      const tid = toast.loading("Melepas kaitan kartu...");
      try {
        await unpairCard(uid);
        toast.success("Kartu berhasil dilepas!", { id: tid });
        router.refresh();
      } catch (error: any) {
        toast.error(error.message, { id: tid });
      }
    }
  };

  const handleMarkLost = async (uid: string) => {
    if (
      window.confirm(
        "Tandai kartu ini sebagai HILANG? Kaitan dengan user akan dilepas.",
      )
    ) {
      const tid = toast.loading("Memperbarui status...");
      try {
        await markCardAsLost(uid);
        toast.success("Status: HILANG", { id: tid });
        router.refresh();
      } catch (error: any) {
        toast.error(error.message, { id: tid });
      }
    }
  };

  const handleDelete = async (uid: string) => {
    if (window.confirm("Hapus kartu ini secara permanen?")) {
      const tid = toast.loading("Menghapus...");
      try {
        await deleteCard(uid);
        toast.success("Kartu terhapus!", { id: tid });
        router.refresh();
      } catch (error: any) {
        toast.error(error.message, { id: tid });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* FILTER SEARCH */}
      <div className="p-5 pb-0">
        <div className="relative max-w-sm group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <Input
            type="text"
            placeholder="Cari UID atau Nama Pemilik..."
            className="w-full pl-10 pr-4 h-10 border-slate-200 rounded-lg text-sm font-medium focus-visible:ring-orange-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 border-y border-slate-200">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center text-slate-500">
                UID RFID
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center text-slate-500">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center text-slate-500">
                Pemilik (User)
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center text-slate-500">
                Role
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center text-slate-500 w-44">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCards.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-slate-400 font-medium text-sm"
                >
                  Tidak ada data kartu ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredCards.map((card) => (
                <TableRow
                  key={card.uid}
                  className="group hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 font-mono font-bold text-slate-700 text-sm">
                      <Fingerprint
                        size={16}
                        className="text-slate-400 group-hover:text-orange-500 transition-colors"
                      />
                      {card.uid}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Badge
                      className={`uppercase text-[10px] font-bold tracking-wider px-2.5 py-0.5 border-none shadow-none ${
                        card.status === "terpakai"
                          ? "bg-blue-50 text-blue-700"
                          : card.status === "hilang"
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                      }`}
                      variant="outline"
                    >
                      <Activity size={12} className="mr-1.5" />
                      {card.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center font-bold text-sm text-slate-800">
                    {card.profile?.full_name || (
                      <span className="text-slate-400 font-medium italic">
                        Belum Dipasangkan
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    {card.profile?.role ? (
                      <span className="uppercase text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 tracking-wider">
                        {card.profile.role}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {card.profile ? (
                        <AppButton
                          size="sm"
                          variant="secondary"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 border border-slate-200 h-8 px-3 text-xs"
                          onClick={() => handleUnpair(card.uid)}
                          leftIcon={<Unlink size={14} />}
                        >
                          Lepas
                        </AppButton>
                      ) : (
                        <AppButton
                          size="sm"
                          variant="secondary"
                          className="text-orange-600 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 h-8 px-3 text-xs"
                          onClick={() => setSelectedUid(card.uid)}
                          leftIcon={<UserPlus size={14} />}
                        >
                          Pasang
                        </AppButton>
                      )}

                      {card.status !== "hilang" && (
                        <AppButton
                          size="icon"
                          variant="secondary"
                          className="text-amber-500 hover:bg-amber-50 border border-slate-200 h-8 w-8"
                          onClick={() => handleMarkLost(card.uid)}
                          title="Tandai Hilang"
                        >
                          <AlertTriangle size={14} />
                        </AppButton>
                      )}

                      <AppButton
                        size="icon"
                        variant="secondary"
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 h-8 w-8"
                        onClick={() => handleDelete(card.uid)}
                        title="Hapus Kartu"
                      >
                        <Trash2 size={14} />
                      </AppButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PairingModal
        uid={selectedUid}
        onClose={() => setSelectedUid(null)}
        users={availableUsers}
      />
    </div>
  );
}
