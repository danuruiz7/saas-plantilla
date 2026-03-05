"use client";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";
import { getDashboardRoutes } from "./nav-config";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { tenantService } from "@/services/tenantService";

interface NavItemsProps {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

export function NavItems({ isCollapsed = false, onItemClick }: NavItemsProps) {
  const { role, logout } = useAuth();
  const pathname = usePathname();

  const { data: tenant } = useQuery({
    queryKey: ["my-tenant"],
    queryFn: () => tenantService.getMyTenant(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const routes = getDashboardRoutes(role, pathname, tenant?.slug);

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="space-y-1 px-3 flex-1 overflow-y-auto">
        {routes.map((route) => {
          if (route.show === false) return null;

          const isExternal = route.external;
          const linkContent = (
            <div
              className={cn(
                "text-sm group flex p-3 w-full items-center justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200",
                isCollapsed ? "justify-center" : "gap-3",
                route.active ? "text-primary bg-primary/5" : "text-zinc-500",
              )}
            >
              <route.icon className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                route.active ? "text-primary" : "text-zinc-500 group-hover:text-primary"
              )} />
              {!isCollapsed && (
                <span className="truncate animate-in fade-in slide-in-from-left-2 duration-300">
                  {route.label}
                </span>
              )}
            </div>
          );

          if (isExternal) {
            return (
              <a 
                key={route.href} 
                href={route.href} 
                target="_blank" 
                rel="noopener noreferrer"
                title={isCollapsed ? route.label : ""}
                className="block w-full"
              >
                {linkContent}
              </a>
            );
          }

          return (
            <Link
              key={route.href}
              href={route.href}
              onClick={onItemClick}
              title={isCollapsed ? route.label : ""}
              className="block w-full"
            >
              {linkContent}
            </Link>
          );
        })}
      </div>

      <div className="px-3 pb-4 mt-auto">
        <Button
          onClick={logout}
          className={cn(
            "w-full flex items-center transition-all duration-300 group cursor-pointer border",
            "bg-destructive text-white border-transparent",
            "hover:bg-white hover:text-destructive hover:border-destructive",
            isCollapsed ? "justify-center px-0" : "justify-start px-3 gap-3"
          )}
          title={isCollapsed ? "Cerrar sesión" : ""}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
          {!isCollapsed && <span className="text-sm font-semibold">Cerrar sesión</span>}
        </Button>
      </div>
    </div>
  );
}
