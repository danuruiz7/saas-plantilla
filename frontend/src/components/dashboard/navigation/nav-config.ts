import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard,
  ExternalLink,
  LucideIcon
} from "lucide-react";

export interface NavRoute {
  label: string;
  icon: LucideIcon;
  href: string;
  active: boolean;
  show?: boolean;
  external?: boolean;
}

export const getDashboardRoutes = (role: string | null, pathname: string, slug?: string): NavRoute[] => {
  const routes: NavRoute[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: role === "SUPERADMIN" ? "/dashboard/root" : role === "OWNER" ? "/dashboard/admin" : "/dashboard/staff",
      active: pathname === "/dashboard/admin" || pathname === "/dashboard/staff" || pathname === "/dashboard/root",
    },
    {
      label: "Ver Página Pública",
      icon: ExternalLink,
      href: `/${slug}`,
      active: false,
      show: !!slug && (role === "OWNER" || role === "SUPERADMIN"),
      external: true,
    },
    {
      label: "Equipo",
      icon: Users,
      href: "/dashboard/admin/team",
      active: pathname.startsWith("/dashboard/admin/team"),
      show: role === "OWNER" || role === "SUPERADMIN",
    },
    {
      label: "Facturación",
      icon: CreditCard,
      href: "/dashboard/admin/billing",
      active: pathname.startsWith("/dashboard/admin/billing"),
      show: role === "OWNER" || role === "SUPERADMIN",
    },
    {
      label: "Configuración",
      icon: Settings,
      href: "/dashboard/admin/settings",
      active: pathname.startsWith("/dashboard/admin/settings"),
      show: role === "OWNER" || role === "SUPERADMIN",
    },
  ];

  return routes;
};
