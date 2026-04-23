"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, GraduationCap } from "lucide-react";
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

  const titleLabel =
    role === "admin" ? "Admin" : role === "pembina" ? "Pembina" : "Siswa";

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-600 rounded-[0.8rem] flex items-center justify-center shadow-sm">
          <GraduationCap className="text-white" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-800 tracking-tight leading-none">
            SUVANNADIPA
          </span>
          <span className="text-[9px] font-bold text-orange-600 uppercase tracking-[0.2em] mt-0.5">
            {titleLabel} Portal
          </span>
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-[0.8rem]"
          >
            <Menu size={24} />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="p-0 w-72 border-none">
          <VisuallyHidden.Root>
            <SheetTitle>Menu Navigasi Mobile</SheetTitle>
          </VisuallyHidden.Root>
          <Sidebar role={role} isAssistant={isAssistant} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
