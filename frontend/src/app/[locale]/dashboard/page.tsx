"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@/i18n/routing";

export default function DashboardIndexPage() {
  const { role, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;

    if (role === "SUPERADMIN") {
      router.replace("/dashboard/root");
    } else if (role === "OWNER") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard/staff");
    }
  }, [role, isHydrated, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
