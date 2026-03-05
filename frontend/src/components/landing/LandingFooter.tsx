import { Sparkles } from "lucide-react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="py-16 px-6 lg:px-8 border-t border-white/5 bg-slate-950">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
          <div className="size-8 bg-white/10 rounded-lg flex items-center justify-center">
             <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">SaaS Starter</span>
        </div>
        <div className="flex gap-6">
           <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm font-medium">Términos</Link>
           <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm font-medium">Privacidad</Link>
           <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm font-medium">Contacto</Link>
        </div>
        <p className="text-sm font-medium text-slate-600">© 2026 Advanced AI Agency.</p>
      </div>
    </footer>
  );
}
