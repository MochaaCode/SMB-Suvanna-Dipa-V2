"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import type { UserRole } from "@/types";

export function MobileNav({
  role,
  isAssistant = false,
}: {
  role: UserRole;
  isAssistant?: boolean;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const roleLabel =
    role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-4 flex items-center gap-3 shadow-sm">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-[0.8rem] shrink-0"
          >
            <Menu size={24} />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="p-0 w-72 border-none" showCloseButton={false}>
          <VisuallyHidden.Root>
            <SheetTitle>Menu Navigasi Mobile</SheetTitle>
          </VisuallyHidden.Root>
          <Sidebar role={role} isAssistant={isAssistant} />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[0.8rem] flex items-center justify-center overflow-hidden border border-orange-300">
          <Image
            src="/images/logo-smb.png"
            alt="Logo SMB"
            width={36}
            height={36}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-800 tracking-tight leading-none">
            Suvanna Dipa
          </span>
          <span className="text-[9px] font-bold text-orange-600 uppercase tracking-[0.2em] mt-0.5">
            {roleLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

