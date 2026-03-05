import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Building2, Globe } from "lucide-react";
import Link from "next/link";
import { publicService, type PublicTenant } from "@/services/publicService";

export async function LandingDirectory() {
  // En Next.js App Router (Server Component), podemos hacer await directamente
  // En caso de que api falle por cookie en Server Component sin next-ssr config, 
  // usaremos el fetch de node puro si es necesario, per api de axios funcionará 
  // si el back está levantado y la URL está bien en el nav
  
  let tenants: PublicTenant[] = [];
  try {
    tenants = await publicService.getPublicTenants();
  } catch (err) {
    console.log(err);
    console.error("No se pudieron cargar los tenants públicos.");
  }

  return (
    <section id="directory" className="py-32 relative border-t border-white/5 bg-slate-950/50 backdrop-blur-md">
       <div className="absolute top-0 inset-x-0 h-px w-full bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 flex flex-col items-center">
          <Globe className="size-12 text-cyan-400 mb-6" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Directorio de Servicios</h2>
          <p className="mt-6 text-slate-400 text-xl font-light max-w-2xl">Explora y conecta con los mejores negocios destacados en nuestra red. Diseño pensado para convertir visitas en clientes.</p>
        </div>
        
        {tenants.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border border-white/5 rounded-3xl bg-white/5">
            Aún no hay negocios registrados. Sé el primero.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tenants.map((t, i) => (
              <div key={t.id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] flex flex-col">
                {i === 0 && ( // Destacamos el primero por ejemplo
                   <div className="absolute -top-4 -right-4 bg-linear-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/30 z-10">
                     <Star className="size-3 fill-white" /> Destacado
                   </div>
                )}
                <div className="h-48 rounded-2xl mb-6 bg-cover bg-center border border-white/5 relative overflow-hidden" style={{ backgroundImage: `url('${t.logoUrl || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop'}')`}}>
                   <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent" />
                   <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium text-white">{(t.settings?.['niche'] as string) || 'General'}</span>
                   </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-violet-400 transition-colors">{t.name}</h3>
                <div className="flex items-center text-slate-400 text-sm mb-8 gap-2">
                   <Building2 className="size-4" />
                   <span>{(t.settings?.['address'] as string) || 'Virtual'}</span>
                </div>
                <div className="mt-auto">
                  <Link href={`/${t.slug}`}>
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0 py-6 rounded-xl transition-all">
                      Ver Perfil
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-16 flex justify-center">
          <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 px-8 py-6 rounded-full font-bold">
             Ver todos los negocios
             <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
