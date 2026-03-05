"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { UserPlus, X, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userService, User } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import { tenantService } from "@/services/tenantService";
import { getColumns } from "@/app/[locale]/dashboard/admin/team/components/columns";
import { Label } from "@/components/ui/label";

export default function TeamClient() {
  const { user } = useAuthStore();
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    pageCount: 0,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Invite Modal States
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"STAFF" | "OWNER">("STAFF");
  const [isInviting, setIsInviting] = useState(false);

  const fetchUsers = useCallback(async (page: number, limit: number, query: string, role: string, status: string) => {
    try {
      setIsLoading(true);
      const searchParam = query.trim() !== "" ? query : undefined;
      const roleParam = role !== "all" ? role : undefined;
      const statusParam = status !== "all" ? status : undefined;

      const response = await userService.getUsers(page + 1, limit, searchParam, roleParam, statusParam);
      setData(response.data);
      setPagination(prev => ({
        ...prev,
        totalItems: response.meta.total,
        pageCount: response.meta.totalPages,
        pageIndex: page,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(pagination.pageIndex, pagination.pageSize, search, roleFilter, statusFilter);
    }, 300);
    return () => clearTimeout(handler);
  }, [fetchUsers, pagination.pageIndex, pagination.pageSize, search, roleFilter, statusFilter]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [search, roleFilter, statusFilter]);

  const onRefresh = () => {
    fetchUsers(pagination.pageIndex, pagination.pageSize, search, roleFilter, statusFilter);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.tenantId) {
      console.error("No tenantId found for user");
      return;
    }
    
    try {
      setIsInviting(true);
      await tenantService.inviteMember(user.tenantId, inviteEmail, inviteRole);
      setInviteEmail("");
      setIsInviteOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Error al invitar:", error);
    } finally {
      setIsInviting(false);
    }
  };

  const columns = getColumns({ onActionSuccess: onRefresh });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Gestión de Equipo</h1>
          <p className="text-zinc-500 text-sm">Administra los miembros de tu staff y sus permisos.</p>
        </div>
        <Button 
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          Invitar miembro
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input 
          placeholder="Buscar por nombre o email..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="sm:max-w-75"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-45">
             <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">Todos los roles</SelectItem>
             <SelectItem value="OWNER">Owner</SelectItem>
             <SelectItem value="STAFF">Staff</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-45">
             <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">Todos los estados</SelectItem>
             <SelectItem value="ACTIVE">Activo</SelectItem>
             <SelectItem value="INACTIVE">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading}
        totalItems={pagination.totalItems}
        pageCount={pagination.pageCount}
        pageIndex={pagination.pageIndex}
        onPageChange={(newIndex) => {
          setPagination(prev => ({ ...prev, pageIndex: newIndex }));
        }}
      />

      {/* Invite Modal (Simple implementation) */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h3 className="text-lg font-semibold text-zinc-900">Invitar Miembro</h3>
              <button 
                onClick={() => setIsInviteOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                disabled={isInviting}
              >
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="pl-9"
                    disabled={isInviting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={inviteRole} onValueChange={(val: "STAFF" | "OWNER") => setInviteRole(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">Staff (Solo gestión)</SelectItem>
                    <SelectItem value="OWNER">Owner (Administración total)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsInviteOpen(false)}
                  disabled={isInviting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 min-w-32" 
                  disabled={isInviting || !inviteEmail}
                >
                  {isInviting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Enviar Invitación"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
