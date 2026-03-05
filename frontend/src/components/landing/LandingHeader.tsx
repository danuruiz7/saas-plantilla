import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="px-6 lg:px-12 h-24 flex items-center justify-between sticky top-0 bg-slate-950/50 backdrop-blur-xl z-50 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Sparkles className="size-5 text-white" />
        </div>
        <span className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          SaaS Starter
        </span>
      </div>
      <nav className="hidden md:flex gap-10">
        <Link href="#directory" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Directorio</Link>
        <Link href="#pricing" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Planes para Negocios</Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/auth/login">
          <Button variant="ghost" className="font-bold text-slate-300 hover:text-white hover:bg-white/5">Login</Button>
        </Link>
        <Link href="/auth/onboarding">
          <Button className="font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Registrar Negocio
          </Button>
        </Link>
      </div>
    </header>
  );
}
