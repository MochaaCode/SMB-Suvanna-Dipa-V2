/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition, useState } from "react";
import { AppModal } from "../../shared/AppModal";
import { AppButton } from "../../shared/AppButton";
import { Label } from "@/components/ui/label";
import {
  Check,
  ChevronsUpDown,
  UserCheck,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { pairCard } from "@/actions/admin/cards";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import type { Profile } from "@/types";

interface PairingModalProps {
  uid: string | null;
  onClose: () => void;
  users: Pick<Profile, "id" | "full_name" | "role">[];
}

export function PairingModal({ uid, onClose, users }: PairingModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const router = useRouter();

  const handlePair = () => {
    if (!uid || !selectedUserId) return;

    startTransition(async () => {
      const tid = toast.loading("Menghubungkan kartu ke profil...");
      try {
        await pairCard(uid, selectedUserId);
        toast.success("Kartu berhasil dipasangkan!", { id: tid });
        setSelectedUserId("");
        onClose();
        router.refresh();
      } catch (err: any) {
        toast.error(err.message, { id: tid });
      }
    });
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <AppModal
      isOpen={!!uid}
      onClose={onClose}
      title="Pasang Kartu RFID"
      description={`Hubungkan UID: ${uid} dengan identitas pengguna.`}
      variant="orange"
      maxWidth="md"
      footer={
        <div className="flex w-full gap-3">
          <AppButton
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-[1rem]"
          >
            Batal
          </AppButton>
          <AppButton
            onClick={handlePair}
            disabled={isPending || !selectedUserId}
            isLoading={isPending}
            leftIcon={<ShieldCheck size={18} />}
            className="flex-1 rounded-[1rem]"
          >
            Konfirmasi Pemasangan
          </AppButton>
        </div>
      }
    >
      <div className="space-y-6 text-left mt-2">
        <div className="space-y-2.5">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pilih Pemilik Kartu
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                role="combobox"
                aria-expanded={open}
                aria-controls="user-pairing-list"
                className="w-full h-12 px-4 rounded-[1rem] border border-slate-200 bg-white flex items-center justify-between hover:border-orange-300 transition-all outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <div className="flex items-center gap-2 truncate">
                  <User size={16} className="text-slate-400" />
                  <span
                    className={cn(
                      "text-sm font-bold truncate",
                      !selectedUserId && "text-slate-400 font-medium",
                    )}
                  >
                    {selectedUser
                      ? selectedUser.full_name
                      : "Cari nama siswa atau pembina..."}
                  </span>
                </div>
                <ChevronsUpDown size={16} className="text-slate-400 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0 rounded-[1rem] border-slate-200 shadow-xl"
              align="start"
            >
              <Command className="rounded-[1rem]">
                <CommandInput
                  placeholder="Ketik nama untuk mencari..."
                  className="h-11 border-none focus:ring-0"
                />
                <CommandList className="max-h-64 custom-scrollbar">
                  <CommandEmpty className="py-6 text-center text-xs font-medium text-slate-400">
                    Pengguna tidak ditemukan.
                  </CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => {
                          setSelectedUserId(user.id);
                          setOpen(false);
                        }}
                        className="flex items-center justify-between p-3 cursor-pointer rounded-[0.8rem] m-1 hover:bg-orange-50 group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-[10px] border transition-colors",
                              user.role === "admin"
                                ? "bg-red-50 text-red-600 border-red-100"
                                : user.role === "pembina"
                                  ? "bg-blue-50 text-blue-600 border-blue-100"
                                  : "bg-orange-50 text-orange-600 border-orange-100",
                            )}
                          >
                            {user.full_name?.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-orange-700">
                              {user.full_name}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              {user.role}
                            </span>
                          </div>
                        </div>
                        <Check
                          className={cn(
                            "h-4 w-4 text-orange-600",
                            selectedUserId === user.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-[1rem] border border-blue-100 flex gap-3">
          <UserCheck size={20} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-blue-800 leading-relaxed">
            <strong>Info Penting:</strong> Memasangkan kartu akan mencabut akses
            kartu lama milik pengguna ini (jika ada). Data absensi sebelumnya
            tetap aman dan tersimpan di database.
          </p>
        </div>
      </div>
    </AppModal>
  );
}
