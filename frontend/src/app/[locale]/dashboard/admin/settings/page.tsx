import { Metadata } from "next";
import SettingsClient from "./components/SettingsClient";

export const metadata: Metadata = {
  title: "Configuración | Dashboard",
  description: "Administra la información de tu negocio",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
