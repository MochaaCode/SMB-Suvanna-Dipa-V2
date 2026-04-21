/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";
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

import type { CardWithProfile } from "@/actions/admin/cards";
import type { Profile } from "@/types";

interface CardTableProps {
  initialCards: CardWithProfile[];
  availableUsers: Pick<Profile, "id" | "full_name" | "role">[];
}

export function CardTable({ initialCards, availableUsers }: CardTableProps) {
  const [cards, setCards] = useState<CardWithProfile[]>(initialCards);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const router = useRouter();
  const supabase = createClient();

  const [prevInitialCards, setPrevInitialCards] = useState(initialCards);
  if (initialCards !== prevInitialCards) {
    setPrevInitialCards(initialCards);
    setCards(initialCards);
  }

  useEffect(() => {
    const channel = supabase
      .channel("rfid-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rfid_tags" },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const filteredCards = useMemo(() => {
    return cards.filter(
      (c) =>
        c.uid.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.profile?.full_name
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
    );
  }, [cards, debouncedSearch]);

  const handleUnpair = async (uid: string) => {
    const tid = toast.loading("Melepas kaitan kartu...");
    try {
      await unpairCard(uid);
      toast.success("Kartu sekarang berstatus tersedia.", { id: tid });
    } catch (err: any) {
      toast.error(err.message, { id: tid });
    }
  };

  const handleMarkLost = async (uid: string) => {
    if (
      confirm("Tandai kartu ini sebagai hilang? Akses pengguna akan dicabut.")
    ) {
      const tid = toast.loading("Memperbarui status...");
      try {
        await markCardAsLost(uid);
        toast.success("Kartu ditandai hilang.", { id: tid });
      } catch (err: any) {
        toast.error(err.message, { id: tid });
      }
    }
  };

  const handleDelete = async (uid: string) => {
    if (confirm("Hapus kartu dari inventaris secara permanen?")) {
      const tid = toast.loading("Menghapus data...");
      try {
        await deleteCard(uid);
        toast.success("Kartu dihapus.", { id: tid });
      } catch (err: any) {
        toast.error(err.message, { id: tid });
      }
    }
  };

  return (
    <div className="bg-white rounded-[1rem] flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            placeholder="Cari UID atau nama pemilik..."
            className="pl-9 h-10 rounded-[1rem] border-slate-200 bg-slate-50 focus-visible:ring-orange-500 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Activity size={12} className="text-green-500 animate-pulse" /> Live
          Sync Active
        </div>
      </div>

      <div className="overflow-x-auto min-h-100">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="w-40 text-center text-xs font-bold uppercase py-4">
                UID RFID
              </TableHead>
              <TableHead className="text-xs font-bold uppercase py-4">
                Pemilik Kartu
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase py-4">
                Status
              </TableHead>
              <TableHead className="w-44 text-center text-xs font-bold uppercase py-4">
                Tindakan
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCards.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-40 text-center text-slate-400 font-medium italic"
                >
                  Data kartu tidak ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredCards.map((card) => (
                <TableRow
                  key={card.uid}
                  className="hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                >
                  <TableCell className="font-mono font-bold text-slate-700">
                    <div className="flex items-center justify-center gap-2">
                      <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                        <Fingerprint size={14} />
                      </div>
                      {card.uid}
                    </div>
                  </TableCell>
                  <TableCell>
                    {card.profile ? (
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-800 leading-tight">
                          {card.profile.full_name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Role: {card.profile.role}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 italic">
                        Belum Terpasang
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`
                        ${card.status === "tersedia" ? "bg-green-50 text-green-700 border-green-200" : ""}
                        ${card.status === "terpakai" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                        ${card.status === "hilang" ? "bg-red-50 text-red-700 border-red-200" : ""}
                        px-2.5 py-0.5 rounded-[1rem] text-[10px] font-bold uppercase tracking-wider shadow-none border
                      `}
                    >
                      {card.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      {card.profile ? (
                        <AppButton
                          size="icon"
                          variant="secondary"
                          className="text-orange-600 hover:bg-orange-50 border border-slate-200 h-8 w-8 rounded-[1rem]"
                          onClick={() => handleUnpair(card.uid)}
                          title="Lepas Kaitan"
                        >
                          <Unlink size={14} />
                        </AppButton>
                      ) : (
                        <AppButton
                          size="sm"
                          variant="default"
                          className="h-8 px-3 text-[10px] font-bold uppercase rounded-[1rem]"
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
                          className="text-amber-500 hover:bg-amber-50 border border-slate-200 h-8 w-8 rounded-[1rem]"
                          onClick={() => handleMarkLost(card.uid)}
                          title="Tandai Hilang"
                        >
                          <AlertTriangle size={14} />
                        </AppButton>
                      )}

                      <AppButton
                        size="icon"
                        variant="secondary"
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 h-8 w-8 rounded-[1rem]"
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
