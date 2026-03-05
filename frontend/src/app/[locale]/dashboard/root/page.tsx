import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Store, CreditCard } from "lucide-react";

export default function RootDashboardPage() {
  const stats = [
    { label: "Total Tenants", value: "124", icon: Building2, color: "text-blue-600" },
    { label: "Usuarios Globales", value: "1,240", icon: Users, color: "text-green-600" },
    { label: "Suscripciones Activas", value: "89", icon: CreditCard, color: "text-amber-600" },
    { label: "Nuevos hoy", value: "+12", icon: Store, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Global Overview</h1>
        <p className="text-muted-foreground">Panel de control de Super Administrador.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tenants Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">Aquí irá la lista de tenants...</p>
        </CardContent>
      </Card>
    </div>
  );
}
