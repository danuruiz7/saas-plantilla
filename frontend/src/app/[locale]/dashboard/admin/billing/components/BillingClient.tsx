"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { billingService } from "@/services/billingService";
import { tenantService } from "@/services/tenantService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, ExternalLink, Loader2, Sparkles, Zap } from "lucide-react";

const PLANS = [
  {
    id: "price_free",
    name: "Free",
    price: "0",
    description: "Para pequeños negocios empezando.",
    features: ["Hasta 50 reservas/mes", "1 Miembro de equipo", "Soporte por email"],
    buttonText: "Plan Actual",
    variant: "outline" as const,
  },
  {
    id: "price_pro_monthly",
    name: "Pro",
    price: "29",
    description: "Todo lo que necesitas para crecer.",
    features: ["Reservas ilimitadas", "Equipo ilimitado", "Soporte prioritario", "Analíticas avanzadas"],
    buttonText: "Mejorar a Pro",
    variant: "default" as const,
    highlight: true,
  }
];

export default function BillingClient() {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const { data: tenant, isLoading: isLoadingTenant } = useQuery({
    queryKey: ["my-tenant"],
    queryFn: () => tenantService.getMyTenant(),
  });

  const checkoutMutation = useMutation({
    mutationFn: (priceId: string) => billingService.createCheckoutSession(priceId),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  const portalMutation = useMutation({
    mutationFn: () => billingService.createPortalSession(),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  const handleUpgrade = async (priceId: string) => {
    setLoadingPriceId(priceId);
    try {
      await checkoutMutation.mutateAsync(priceId);
    } finally {
      setLoadingPriceId(null);
    }
  };

  if (isLoadingTenant) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPro = tenant?.plan === "pro" || tenant?.plan === "enterprise";

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Facturación y Planes</h1>
        <p className="text-zinc-500 text-sm">Gestiona tu suscripción, métodos de pago y facturas.</p>
      </div>

      {/* Estado Actual */}
      <Card className="border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden">
        <div className="bg-zinc-50 border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="size-10 bg-white rounded-lg border shadow-sm flex items-center justify-center">
                <CreditCard className="size-5 text-zinc-600" />
             </div>
             <div>
               <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Plan Actual</p>
               <h3 className="font-bold text-lg capitalize">{tenant?.plan || "Free"}</h3>
             </div>
          </div>
          <Badge variant={isPro ? "default" : "outline"} className={isPro ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
            {tenant?.isActive ? "Activo" : "Pendiente"}
          </Badge>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500 text-xs w-32">Estado:</span>
                  <span className="font-medium">{tenant?.isActive ? "Suscripción verificada" : "Esperando pago"}</span>
               </div>
               <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500 text-xs w-32">ID de Tenant:</span>
                  <span className="font-mono text-[10px] bg-zinc-100 px-1 rounded">{tenant?.id}</span>
               </div>
            </div>
            <div className="flex flex-col justify-center">
               <Button 
                variant="outline" 
                className="w-full md:w-auto ml-auto gap-2"
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
               >
                 {portalMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <ExternalLink className="size-4" />}
                 Gestionar en Stripe
               </Button>
               <p className="text-[10px] text-zinc-400 text-right mt-2 italic">
                 Cambia tu tarjeta o cancela tu suscripción desde el portal seguro de Stripe.
               </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selector de Planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {PLANS.map((plan) => {
          const isCurrent = (plan.name.toLowerCase() === tenant?.plan?.toLowerCase());
          
          return (
            <Card key={plan.id} className={plan.highlight ? "border-primary shadow-md ring-1 ring-primary/20 relative" : "border-zinc-200"}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                  Recomendado
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.highlight ? <Zap className="size-5 text-amber-500 fill-amber-500" /> : null}
                </CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-zinc-500 text-sm">/mes</span>
                </div>
                <CardDescription className="pt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-zinc-600">
                      <div className="size-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="size-3 text-emerald-600" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full font-bold" 
                  variant={isCurrent ? "outline" : plan.variant}
                  disabled={isCurrent || loadingPriceId === plan.id || checkoutMutation.isPending}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {loadingPriceId === plan.id ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : isCurrent ? (
                    <Sparkles className="size-4 mr-2 text-amber-500" />
                  ) : null}
                  {isCurrent ? "Tu Plan Actual" : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
