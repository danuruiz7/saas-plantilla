"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/dashboard/navigation/Sidebar";
import { TopNav } from "@/components/dashboard/navigation/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-50/50">
        <Sidebar className="hidden md:flex" />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="flex-1 p-6 lg:p-10 mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
