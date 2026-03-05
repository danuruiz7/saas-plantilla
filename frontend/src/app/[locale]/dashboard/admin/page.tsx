import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Ingresos (Mes)", value: "$3,450", icon: DollarSign, color: "text-emerald-600" },
    { label: "Reservas Activas", value: "48", icon: Calendar, color: "text-blue-600" },
    { label: "Clientes", value: "182", icon: Users, color: "text-indigo-600" },
    { label: "Ocupación", value: "78%", icon: TrendingUp, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona tu negocio y reservas.</p>
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximas Reservas</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground italic">Lista de reservas...</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Staff en servicio</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground italic">Lista de empleados...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
