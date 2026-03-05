import TeamClient from "@/app/[locale]/dashboard/admin/team/components/TeamClient";

export const metadata = {
  title: "Equipo | Dashboard",
  description: "Gestión de miembros del equipo",
};

export default function TeamPage() {
  return <TeamClient />;
}
