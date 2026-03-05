"use client";

import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/publicService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Phone, Store, Loader2 } from "lucide-react";
import Image from "next/image";

interface PublicTenantViewProps {
  slug: string;
}

export function PublicTenantView({ slug }: PublicTenantViewProps) {
  const { data: tenant, isLoading, error } = useQuery({
    queryKey: ["public-tenant", slug],
    queryFn: () => publicService.getTenantBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-2">404</h1>
        <p className="text-zinc-500">Lo sentimos, no pudimos encontrar este negocio.</p>
        <Button className="mt-6" variant="outline" onClick={() => window.location.href = "/"}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 animate-in fade-in duration-700">
      {/* Header / Hero */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="size-10 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-md">
                {tenant.logoUrl ? (
                  <Image src={tenant.logoUrl} alt={tenant.name} width={40} height={40} className="size-full object-cover rounded-lg" />
                ) : (
                  <Store className="size-6 text-primary-foreground" />
                )}
             </div>
             <h1 className="font-bold text-xl tracking-tight uppercase">{tenant.name}</h1>
          </div>
          <Button className="font-bold hidden sm:flex">Reservar Cita</Button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado izquierdo: Info */}
        <div className="md:col-span-1 space-y-6">
           <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                 <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Información</h3>
                 <div className="space-y-4">
                    <div className="flex items-start gap-3">
                       <MapPin className="size-5 text-primary shrink-0" />
                       <span className="text-sm text-zinc-600">{tenant.settings?.address || "Dirección no disponible"}</span>
                    </div>
                    <div className="flex items-start gap-3">
                       <Phone className="size-5 text-primary shrink-0" />
                       <span className="text-sm text-zinc-600 font-medium">{tenant.settings?.phone || "Sin teléfono"}</span>
                    </div>
                    <div className="flex items-start gap-3">
                       <Clock className="size-5 text-primary shrink-0" />
                       <div className="text-sm text-zinc-600">
                          <p className="font-bold">Abierto hoy</p>
                          <p>09:00 AM - 08:00 PM</p>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Lado derecho: Acción principal */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Bienvenido a {tenant.name}</h2>
            <p className="text-zinc-600 leading-relaxed">
              {tenant.settings?.description || "Reserva tu próxima cita en segundos. Elige el servicio y horario que mejor te convenga."}
            </p>
          </section>

          <Card className="border-2 border-primary/10 shadow-lg bg-white overflow-hidden">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
               <h3 className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="size-5 text-primary" />
                  Paso 1: Elige tu servicio
               </h3>
            </div>
            <CardContent className="p-0 divide-y">
               {/* Placeholder de servicios */}
               {[1, 2, 3].map((i) => (
                 <button key={i} className="w-full p-6 text-left hover:bg-zinc-50 transition-colors flex items-center justify-between group">
                    <div>
                       <h4 className="font-bold text-zinc-900 group-hover:text-primary transition-colors">Servicio Premium {i}</h4>
                       <p className="text-sm text-zinc-500">45 minutos • Corte clásico, lavado y peinado.</p>
                    </div>
                    <span className="font-bold text-lg text-primary">$20.00</span>
                 </button>
               ))}
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
             <Store className="size-5 shrink-0" />
             <p className="text-sm">
                Estamos trabajando en el selector de fechas y horas. Muy pronto podrás completar tu reserva online.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}
