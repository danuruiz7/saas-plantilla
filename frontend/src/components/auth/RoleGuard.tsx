"use client";

import { useAuth } from "@/hooks/useAuth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ("SUPERADMIN" | "OWNER" | "STAFF")[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleGuardProps) {
  const { role, isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) return null;

  if (!isAuthenticated || !role || !allowedRoles.includes(role as "SUPERADMIN" | "OWNER" | "STAFF")) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
