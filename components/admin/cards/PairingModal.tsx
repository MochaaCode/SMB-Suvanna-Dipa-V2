/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition, useState } from "react";
import { AppModal } from "../../shared/AppModal";
import { AppButton } from "../../shared/AppButton";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, UserCheck } from "lucide-react";
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

// IMPORT TIPE
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

  if (!uid) return null;

  const handlePairing = () => {
    if (!selectedUserId) {
      toast.error("Pilih pengguna terlebih dahulu!");
      return;
    }

    startTransition(async () => {
      try {
        await pairCard(uid, selectedUserId);
        toast.success("Kartu berhasil dipasangkan!");
        router.refresh();
        setSelectedUserId("");
        onClose();
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  return (
    <AppModal
      isOpen={!!uid}
      onClose={onClose}
      title="Pasangkan Kartu"
      description={`Hubungkan identitas pengguna dengan UID: ${uid}`}
      variant="orange"
      maxWidth="sm"
      footer={
        <div className="w-full flex justify-end gap-3">
          <AppButton variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </AppButton>
          <AppButton
            onClick={handlePairing}
            disabled={isPending || !selectedUserId}
            isLoading={isPending}
            leftIcon={<UserCheck size={16} />}
          >
            Konfirmasi Pasang
          </AppButton>
        </div>
      }
    >
      <div className="space-y-6 text-left">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pilih Nama Pengguna
          </Label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between h-11 font-semibold border-slate-200 bg-white"
              >
                {selectedUserId
                  ? users.find((u) => u.id === selectedUserId)?.full_name
                  : "Cari nama murid atau pembina..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-lg">
              <Command>
                <CommandInput placeholder="Ketik nama untuk mencari..." />
                <CommandList>
                  <CommandEmpty>Nama tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.full_name || ""}
                        onSelect={() => {
                          setSelectedUserId(user.id);
                          setOpen(false);
                        }}
                        className="font-medium cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-orange-600",
                            selectedUserId === user.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">
                            {user.full_name}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            {user.role}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600 leading-relaxed">
          *Aksi ini akan menyambungkan identitas profil dengan ID kartu fisik.
          Jika profil tersebut sudah memiliki kartu, ia akan ditimpa.
        </div>
      </div>
    </AppModal>
  );
}
