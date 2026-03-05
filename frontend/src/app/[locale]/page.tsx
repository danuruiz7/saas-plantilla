"use client";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, Rocket, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="flex items-center gap-2">
          <div className="size-9 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <Rocket className="size-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">SaaS Starter</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link href="#features" className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors">Características</Link>
          <Link href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors">Precios</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="font-bold">Login</Button>
          </Link>
          <Link href="/auth/onboarding">
            <Button className="font-bold shadow-lg shadow-primary/20">Empezar Gratis</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-32 lg:px-8 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute top-0 inset-x-0 -z-10 h-96 bg-linear-to-b from-primary/10 to-transparent" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 animate-bounce">
            <Zap className="size-3 fill-primary" />
            <span>NUEVO: Integración con Stripe lista</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 max-w-4xl leading-[1.1]">
            Lanza tu plataforma, <span className="text-primary">escala tu visión</span>.
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-zinc-600 max-w-2xl leading-relaxed">
            La infraestructura multi-tenant definitiva para gestionar tus clientes, equipo y facturación en una sola interfaz premium de marca blanca.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/auth/onboarding">
              <Button size="lg" className="h-14 px-8 text-lg font-bold w-full sm:w-auto shadow-xl shadow-primary/25">
                Crea tu negocio ahora
              </Button>
            </Link>
            <Link href="/dashboard/admin">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold w-full sm:w-auto">
                <LayoutDashboard className="mr-2 size-5" />
                Ir al Panel
              </Button>
            </Link>
          </div>

          <div className="mt-20 relative w-full max-w-5xl rounded-2xl border bg-zinc-50/50 p-2 shadow-2xl animate-in zoom-in duration-1000">
             <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden relative border shadow-inner">
                <div className="absolute inset-x-0 top-0 h-8 bg-zinc-800 flex items-center px-4 gap-2 border-b border-zinc-700">
                   <div className="size-2 rounded-full bg-red-400" />
                   <div className="size-2 rounded-full bg-amber-400" />
                   <div className="size-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-8 p-6 flex flex-col gap-4">
                   <div className="h-8 w-1/3 bg-zinc-800 rounded-md animate-pulse" />
                   <div className="grid grid-cols-3 gap-4">
                      <div className="h-32 bg-zinc-800 rounded-lg animate-pulse" />
                      <div className="h-32 bg-zinc-800 rounded-lg animate-pulse" />
                      <div className="h-32 bg-zinc-800 rounded-lg animate-pulse" />
                   </div>
                   <div className="h-48 w-full bg-zinc-800/50 rounded-lg animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent" />
             </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-50 border-y">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Potencia</h2>
              <p className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Todo lo que necesitas para escalar</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Multi-Tenant", icon: ShieldCheck, desc: "Aislamiento total de datos. Tu negocio, tus clientes, tu espacio seguro." },
                { title: "Gestión de Equipo", icon: Rocket, desc: "Invita a tu staff, asigna roles y controla quién puede hacer qué." },
                { title: "Facturación Pro", icon: Zap, desc: "Cobros integrados con Stripe. Planes Free y Pro listos para usar." }
              ].map((f) => (
                <div key={f.title} className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group">
                   <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                      <f.icon className="size-6 text-primary group-hover:text-white" />
                   </div>
                   <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                   <p className="text-zinc-500 leading-relaxed text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t bg-zinc-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Rocket className="size-5" />
            <span className="font-bold text-lg">SaaS Starter</span>
          </div>
          <p className="text-sm text-zinc-500">© 2026 Advanced AI Agency. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
