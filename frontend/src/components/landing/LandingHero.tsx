import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
// import Image from "next/image";

export function LandingHero() {
  return (
    <section className="relative px-6 pt-20 pb-40 lg:px-8 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold mb-8 backdrop-blur-sm">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        La plantilla multi-tenant definitiva para escalar
      </div>

      <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight max-w-5xl leading-[1.1] text-transparent bg-clip-text bg-linear-to-b from-white to-white/50">
        Digitaliza tus servicios, <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400">escala tu negocio.</span>
      </h1>
      
      <p className="mt-10 text-xl text-slate-400 max-w-2xl leading-relaxed font-light">
        La plataforma definitiva y genérica para dar de alta tu negocio en minutos. Únete, configura tu panel, recibe clientes y revoluciona tu nicho hoy mismo.
      </p>
      
      <div className="mt-14 flex flex-col sm:flex-row gap-5 w-full justify-center">
        <Link href="/auth/onboarding">
          <Button size="lg" className="h-16 px-10 text-lg font-bold w-full sm:w-auto bg-linear-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition-opacity text-white border-0 shadow-[0_0_40px_rgba(139,92,246,0.4)] rounded-2xl group">
            Da de alta tu negocio
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Imagen Mockup Hero */}
      {/* <div className="mt-28 relative w-full max-w-6xl mx-auto">
         <div className="absolute -inset-4 bg-linear-to-r from-violet-500 to-cyan-500 rounded-[2rem] blur-2xl opacity-20" />
         <div className="relative rounded-[1.5rem] p-2 bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
           <Image 
             src="/hero.png" 
             width={1200} 
             height={600} 
             alt="SaaS Dashboard Preview" 
             className="rounded-3xl w-full object-cover shadow-2xl saturate-150"
             priority
           />
         </div> 
      </div>*/}
    </section>
  );
}
