"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { storageService } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Save, User as UserIcon, CheckCircle2 } from "lucide-react";
// import { toast } from "sonner"; // Sonner not installed yet

export default function ProfilePage() {
  const { user } = useAuth();
  const { updateUser } = useAuthStore();
  const [name, setName] = useState(user?.fullName || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsUpdating(true);
      const updatedUser = await userService.updateProfile({ name: name.trim() });
      updateUser({ fullName: updatedUser.name });
      console.log("Perfil actualizado correctamente");
    } catch (error) {
       console.error("Error updating profile:", error);
       console.error("Error al actualizar el perfil");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo y tamaño (máximo 2MB)
    if (!file.type.startsWith("image/")) {
       console.error("Por favor, selecciona una imagen válida");
       return;
    }
    if (file.size > 2 * 1024 * 1024) {
       console.error("La imagen no debe superar los 2MB");
       return;
    }

    try {
      setIsUploading(true);
      // 1. Obtener URL prefirmada
      const { uploadUrl, url } = await storageService.getPresignedUrl(file.name, file.type, 'avatars');
      
      // 2. Subir directamente a S3
      await storageService.uploadFile(uploadUrl, file);
      
      // 3. Actualizar el perfil en BD con la URL final
      await userService.updateProfile({ avatarUrl: url });
      
      // 4. Actualizar estado global
      updateUser({ avatarUrl: url });
      
      console.log("Foto de perfil actualizada");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      console.error("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Mi Perfil</h1>
        <p className="text-zinc-500 text-sm">Gestiona tu información personal y cómo te ven los demás.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Foto de perfil */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-6 bg-white border rounded-xl shadow-sm flex flex-col items-center gap-6">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
               <Avatar className="h-32 w-32 border-4 border-slate-50 transition-all group-hover:opacity-80">
                 <AvatarImage src={user?.avatarUrl || ""} />
                 <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                   {user?.fullName?.substring(0, 2).toUpperCase() || "U"}
                 </AvatarFallback>
               </Avatar>
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/40 p-2 rounded-full text-white">
                    <Camera className="h-6 w-6" />
                  </div>
               </div>
               {isUploading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              <p className="text-sm font-semibold text-zinc-900">Foto de perfil</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-37.5">Recomendado: Cuadrada, JPG o PNG. Máx 2MB.</p>
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs h-8"
                onClick={handleAvatarClick}
                disabled={isUploading}
            >
                Cambiar foto
            </Button>
          </div>
        </div>

        {/* Formulario de Información */}
        <div className="md:col-span-2">
          <form onSubmit={handleUpdateProfile} className="bg-white border rounded-xl shadow-sm overflow-hidden">
             <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-700 font-medium">Correo Electrónico</Label>
                      <Input 
                        id="email" 
                        value={user?.email || ""} 
                        disabled 
                        className="bg-zinc-50 text-zinc-500 border-zinc-200"
                      />
                      <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        Tu email no se puede cambiar por seguridad.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-700 font-medium">Nombre Completo</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                        <Input 
                          id="name" 
                          placeholder="Tu nombre completo" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-700 font-medium">Rol en la plataforma</Label>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-wider">
                          {user?.role}
                        </span>
                        <p className="text-xs text-zinc-500">
                          {user?.role === 'OWNER' ? 'Eres el administrador principal del tenant.' : 'Eres parte del equipo del staff.'}
                        </p>
                      </div>
                    </div>
                </div>
             </div>
             
             <div className="bg-zinc-50/50 p-6 border-t flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isUpdating || !name.trim() || name === user?.fullName}
                  className="bg-primary hover:bg-primary/90 min-w-32 flex items-center gap-2"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Guardar cambios
                </Button>
             </div>
          </form>

          {/* Seguridad (Placeholder por ahora) */}
          <div className="mt-6 p-6 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Save className="h-5 w-5 text-amber-600" />
            </div>
            <div>
               <h3 className="text-sm font-semibold text-amber-900">Seguridad de la cuenta</h3>
               <p className="text-xs text-amber-700 mt-1">¿Quieres cambiar tu contraseña? Visita la sección de ajustes de seguridad desde el menú lateral (próximamente).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
