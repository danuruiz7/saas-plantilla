import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

export default function StaffDashboardPage() {
  const stats = [
    { label: "Mis turnos hoy", value: "6", icon: Clock, color: "text-blue-600" },
    { label: "Completadas", value: "4", icon: CheckCircle2, color: "text-green-600" },
    { label: "Pendientes", value: "2", icon: Calendar, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Agenda</h1>
        <p className="text-muted-foreground">Revisa tus reservas asignadas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
          <CardTitle>Mis Citas para hoy</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground italic">Lista de tus próximas citas...</p>
        </CardContent>
      </Card>
    </div>
  );
}
