"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { tenantService } from "@/services/tenantService";
import Image from "next/image";

import { NavItems } from "./NavItems";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className }: SidebarProps) {
  const { role, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch tenant info
  const { data: tenant } = useQuery({
    queryKey: ["my-tenant"],
    queryFn: () => tenantService.getMyTenant(),
    enabled: isAuthenticated && role !== "SUPERADMIN",
  });

  return (
    <div className={cn(
      "pb-4 border-r bg-white h-screen sticky top-0 flex-col transition-all duration-300 ease-in-out hidden md:flex",
      isCollapsed ? "w-20" : "w-64",
      className
    )}>
      <div className={cn(
        "py-6 border-b mb-4 flex items-center transition-all",
        isCollapsed ? "px-2 justify-center flex-col gap-4" : "px-6 justify-between"
      )}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            {tenant?.logoUrl && !isCollapsed ? (
              <Image 
                src={tenant.logoUrl} 
                alt="Logo" 
                width={32}
                height={32}
                className="size-full object-cover rounded-lg"
              />
            ) : (
              <Store className="size-5 text-primary-foreground" />
            )}
          </div>
          {!isCollapsed && (
            <span className="font-bold text-sm tracking-tight truncate animate-in fade-in duration-500 max-w-35">
              {role === "SUPERADMIN" ? "Panel Root" : (tenant?.name || process.env.NEXT_PUBLIC_APP_NAME || "ReservaApp")}
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-zinc-500 hover:text-primary hover:bg-primary/5 shrink-0"
          title={isCollapsed ? "Expandir" : "Contraer"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <NavItems isCollapsed={isCollapsed} />
        
        {role === "SUPERADMIN" && (
           <div className={cn(
             "px-6 pb-4 pt-2",
             isCollapsed && "px-0 flex justify-center"
           )}>
             <div className={cn(
               "flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-amber-600 bg-amber-50 rounded-md border border-amber-100 uppercase tracking-wider transition-all",
               isCollapsed ? "w-10 h-10 justify-center p-0 rounded-full border-none bg-transparent" : "w-full"
             )}>
              <ShieldCheck className="size-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Modo Root</span>}
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
