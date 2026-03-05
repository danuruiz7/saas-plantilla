"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { tenantService, Tenant } from "@/services/tenantService";
import { storageService } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Image as ImageIcon, Loader2, Save, Globe, Store, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsClient() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const data = await tenantService.getMyTenant();
        setTenant(data);
        setName(data.name);
      } catch (error) {
        console.error("Error fetching tenant:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTenant();
  }, []);

  const handleUpdateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsUpdating(true);
      setMessage(null);
      const updatedTenant = await tenantService.updateMyTenant({ name: name.trim() });
      setTenant(updatedTenant);
      setMessage({ type: 'success', text: "Configuración actualizada correctamente" });
    } catch (error) {
      console.error("Error updating tenant:", error);
      setMessage({ type: 'error', text: "Error al actualizar la configuración" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: 'error', text: "Por favor, selecciona una imagen válida" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: "La imagen no debe superar los 2MB" });
      return;
    }

    try {
      setIsUploading(true);
      setMessage(null);
      
      // 1. Obtener URL prefirmada para el logo
      const { uploadUrl, url } = await storageService.getPresignedUrl(file.name, file.type, 'logos');
      
      // 2. Subir a S3
      await storageService.uploadFile(uploadUrl, file);
      
      // 3. Actualizar tenant en BD
      const updatedTenant = await tenantService.updateMyTenant({ logoUrl: url });
      
      // 4. Actualizar estado
      setTenant(updatedTenant);
      setMessage({ type: 'success', text: "Logo del negocio actualizado" });
    } catch (error) {
      console.error("Error uploading logo:", error);
      setMessage({ type: 'error', text: "Error al subir el logo" });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Configuración del Negocio</h1>
        <p className="text-zinc-500 text-sm">Administra la identidad y los ajustes globales de tu plataforma.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Identidad del Negocio */}
        <Card className="md:col-span-1 border-none shadow-sm ring-1 ring-zinc-200">
          <CardHeader>
            <CardTitle className="text-base">Identidad</CardTitle>
            <CardDescription className="text-xs">El logo que verán tus clientes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div 
              className="relative size-32 rounded-xl bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-primary/50 transition-colors"
              onClick={handleLogoClick}
            >
              {tenant?.logoUrl ? (
                <Image 
                  src={tenant.logoUrl} 
                  alt="Logo" 
                  width={128} 
                  height={128} 
                  className="w-full h-full object-contain" 
                />
              ) : (
                <div className="flex flex-col items-center text-zinc-400">
                  <ImageIcon className="size-8 mb-2" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Subir Logo</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon className="size-6 text-white" />
              </div>

              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
            <div className="text-center">
              <p className="text-xs text-zinc-500">JPG, PNG. Máx 2MB.<br/>Fondo transparente recomendado.</p>
            </div>
          </CardContent>
          <CardFooter>
             <Button variant="outline" className="w-full text-xs h-9" onClick={handleLogoClick} disabled={isUploading}>
               Cambiar Logotipo
             </Button>
          </CardFooter>
        </Card>

        {/* Información General */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm ring-1 ring-zinc-200">
            <CardHeader>
              <CardTitle className="text-base">Información del Negocio</CardTitle>
              <CardDescription className="text-xs">Estos datos aparecerán en tu página pública y facturas.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateTenant}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-700 font-medium">Nombre Comercial</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-2.5 size-4 text-zinc-400" />
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Mi Peluquería" 
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-zinc-700 font-medium">Link Público (Slug)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 size-4 text-zinc-400" />
                    <Input 
                      id="slug" 
                      value={`reserva-app.com/${tenant?.slug}`} 
                      disabled 
                      className="pl-9 bg-zinc-50 text-zinc-500"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400">El slug no se puede cambiar después de la creación por motivos de SEO.</p>
                </div>
              </CardContent>
              <CardFooter className="bg-zinc-50/50 border-t flex justify-end py-4">
                <Button 
                  type="submit" 
                  disabled={isUpdating || !name.trim() || name === tenant?.name}
                  className="bg-primary hover:bg-primary/90 min-w-32 gap-2"
                >
                  {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Guardar Cambios
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Planes y Suscripción (Shortcut) */}
          <Card className="border-none shadow-sm ring-1 ring-zinc-200 bg-slate-900 text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <ImageIcon className="size-24 rotate-12" />
             </div>
             <CardHeader>
               <div className="flex items-center justify-between">
                 <CardTitle className="text-base">Plan de Suscripción</CardTitle>
                 <span className="px-2 py-0.5 bg-primary rounded text-[10px] font-bold uppercase tracking-wider">{tenant?.plan}</span>
               </div>
               <CardDescription className="text-slate-400 text-xs text-balance">
                 Para cambiar tu plan, gestionar métodos de pago o ver facturas pasadas, visita la sección de Facturación.
               </CardDescription>
             </CardHeader>
             <CardFooter className="pt-0">
               <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white h-8 text-xs">
                 Gestionar Suscripción
               </Button>
             </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
