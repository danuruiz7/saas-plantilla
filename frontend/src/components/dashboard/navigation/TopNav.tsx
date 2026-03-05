"use client";

import { UserNav } from "./UserNav";
import { 
  Bell, 
  Menu,
  Calendar,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { NavItems } from "./NavItems";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { tenantService } from "@/services/tenantService";
import Image from "next/image";

export function TopNav() {
  const [open, setOpen] = useState(false);
  const { role, isAuthenticated } = useAuth();

  // Fetch tenant info for mobile header
  const { data: tenant } = useQuery({
    queryKey: ["my-tenant"],
    queryFn: () => tenantService.getMyTenant(),
    enabled: isAuthenticated && role !== "SUPERADMIN",
  });

  return (
    <div className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile Menu Button with Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 flex flex-col w-72">
            <SheetHeader className="p-6 border-b text-left">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-md">
                  {tenant?.logoUrl ? (
                    <Image 
                      src={tenant.logoUrl} 
                      alt="Logo" 
                      width={36}
                      height={36}
                      className="size-full object-cover rounded-lg"
                    />
                  ) : (
                    <Store className="size-5 text-primary-foreground" />
                  )}
                </div>
                <SheetTitle className="font-bold text-lg tracking-tight truncate">
                   {role === "SUPERADMIN" ? "Panel Root" : (tenant?.name || "ReservaApp")}
                </SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 py-4 flex flex-col overflow-hidden">
               <NavItems onItemClick={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo and App Name (Visible only on Mobile if sidebar is hidden) */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="size-7 bg-primary rounded-md flex items-center justify-center shadow-sm">
             <Calendar className="size-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm tracking-tight">
            {process.env.NEXT_PUBLIC_APP_NAME || "ReservaApp"}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative text-zinc-500">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
          </Button>
          <div className="h-8 w-px bg-zinc-200 mx-1" />
          <UserNav />
        </div>
      </div>
    </div>
  );
}
