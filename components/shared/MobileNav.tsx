"use client";

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

export function MobileNav({ role }: { role: UserRole }) {
  const titleLabel =
    role === "admin" ? "Admin" : role === "pembina" ? "Pembina" : "Siswa";

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          SMB <span className="text-orange-600">{titleLabel}</span>
        </h2>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:bg-orange-50 hover:text-orange-600"
          >
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          <VisuallyHidden.Root>
            <SheetTitle>Menu Navigasi Mobile</SheetTitle>
          </VisuallyHidden.Root>
          <Sidebar
            role={role}
            className="h-full border-none shadow-none w-full"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
