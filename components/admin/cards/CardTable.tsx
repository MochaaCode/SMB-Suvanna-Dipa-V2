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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    actionType: "delete" | "lost" | null;
    uid: string | null;
  }>({ isOpen: false, actionType: null, uid: null });

  const debouncedSearch = useDebounce(searchTerm, 300);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
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

  const executeAction = async () => {
    if (!confirmDialog.uid || !confirmDialog.actionType) return;
    setIsPending(true);
    const tid = toast.loading("Memproses aksi...");
    try {
      if (confirmDialog.actionType === "lost") {
        await markCardAsLost(confirmDialog.uid);
        toast.success("Kartu ditandai hilang.", { id: tid });
      } else if (confirmDialog.actionType === "delete") {
        await deleteCard(confirmDialog.uid);
        toast.success("Kartu dihapus dari inventaris.", { id: tid });
      }
      setConfirmDialog({ isOpen: false, actionType: null, uid: null });
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    } finally {
      setIsPending(false);
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
      </div>

      <div className="overflow-x-auto min-h-100">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="w-40 px-6 text-center text-xs font-bold uppercase text-slate-500 py-4">
                UID RFID
              </TableHead>
              <TableHead className="text-xs font-bold uppercase text-slate-500 py-4">
                Pemilik Kartu
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase text-slate-500 py-4">
                Status
              </TableHead>
              <TableHead className="w-44 text-center text-xs font-bold uppercase text-slate-500 py-4">
                Aksi Cepat
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
                          Peran: {card.profile.role}
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
                          variant="ghost"
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 h-8 w-8 rounded-[1rem]"
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
                          variant="ghost"
                          className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 h-8 w-8 rounded-[1rem]"
                          onClick={() =>
                            setConfirmDialog({
                              isOpen: true,
                              actionType: "lost",
                              uid: card.uid,
                            })
                          }
                          title="Tandai Hilang"
                        >
                          <AlertTriangle size={14} />
                        </AppButton>
                      )}

                      <AppButton
                        size="icon"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-[1rem]"
                        onClick={() =>
                          setConfirmDialog({
                            isOpen: true,
                            actionType: "delete",
                            uid: card.uid,
                          })
                        }
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

      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent className="rounded-[1rem] p-8 border-slate-200 shadow-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-800">
              {confirmDialog.actionType === "lost"
                ? "Tandai Kartu Hilang?"
                : "Hapus Kartu?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-slate-600 mt-2 leading-relaxed">
              {confirmDialog.actionType === "lost"
                ? "Tandai kartu ini sebagai hilang? Akses pengguna yang terhubung akan langsung dicabut demi keamanan."
                : "Hapus data kartu ini secara permanen dari inventaris? Aksi ini tidak dapat dibatalkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel asChild>
              <AppButton
                variant="outline"
                disabled={isPending}
                className="h-10 text-xs rounded-[1rem]"
              >
                Batal
              </AppButton>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <AppButton
                variant={confirmDialog.actionType === "lost" ? "orange" : "red"}
                onClick={executeAction}
                isLoading={isPending}
                className="h-10 text-xs rounded-[1rem]"
              >
                {confirmDialog.actionType === "lost" ? "Ya, Tandai Hilang" : "Ya, Hapus Permanen"}
              </AppButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
