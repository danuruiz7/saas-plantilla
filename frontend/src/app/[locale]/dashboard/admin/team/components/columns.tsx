"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userService, User } from "@/services/userService";
import { ConfirmModal } from "@/components/dashboard/shared/ConfirmModal";
import { toast } from "sonner";

interface ColumnProps {
  onActionSuccess: () => void;
}

const ActionsCell = ({ user, onActionSuccess }: { user: User; onActionSuccess: () => void }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "delete" | "deactivate" | "activate" | null;
  }>({
    isOpen: false,
    type: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => setModalState({ isOpen: false, type: null });

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      if (modalState.type === "delete") {
        await userService.deleteUser(user.id);
        toast.success("Miembro eliminado correctamente");
      } else if (modalState.type === "deactivate") {
        await userService.deactivateUser(user.id);
        toast.success("Miembro desactivado");
      } else if (modalState.type === "activate") {
        await userService.activateUser(user.id);
        toast.success("Miembro activado");
      }
      onActionSuccess();
      handleClose();
    } catch (error) {
      console.error("Error en acción:", error);
      toast.error("Ocurrió un error al procesar la solicitud");
    } finally {
      setIsProcessing(false);
    }
  };

  const getModalConfig = () => {
    switch (modalState.type) {
      case "delete":
        return {
          title: "Eliminar miembro",
          description: `¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`,
          confirmText: "Eliminar",
          variant: "danger" as const,
        };
      case "deactivate":
        return {
          title: "Desactivar miembro",
          description: `¿Deseas desactivar el acceso de ${user.name}? Se podrá reactivar más tarde.`,
          confirmText: "Desactivar",
          variant: "warning" as const,
        };
      case "activate":
        return {
          title: "Activar miembro",
          description: `¿Deseas reactivar el acceso de ${user.name}?`,
          confirmText: "Activar",
          variant: "info" as const,
        };
      default:
        return { title: "", description: "", confirmText: "", variant: "danger" as const };
    }
  };

  const config = getModalConfig();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem 
            onClick={() => setModalState({ isOpen: true, type: user.isActive ? "deactivate" : "activate" })} 
            className="cursor-pointer"
          >
            {user.isActive ? "Desactivar" : "Activar"}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setModalState({ isOpen: true, type: "delete" })} 
            className="cursor-pointer text-destructive"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        isLoading={isProcessing}
        {...config}
      />
    </>
  );
};

export const getColumns = ({ onActionSuccess }: ColumnProps): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
          {row.original.name.substring(0, 2).toUpperCase()}
        </div>
        <span className="font-medium text-zinc-900">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-zinc-500">
        <Mail className="h-3.5 w-3.5" />
        <span className="truncate">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <div className="flex items-center gap-2">
          <Shield className={`h-3.5 w-3.5 ${role === "OWNER" ? "text-amber-500" : "text-blue-500"}`} />
          <span className="text-xs font-medium">{role}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <Badge 
          variant={isActive ? "default" : "outline"}
          className={
            isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20" :
            "bg-zinc-100 text-zinc-500 border-zinc-200"
          }
        >
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ActionsCell user={row.original} onActionSuccess={onActionSuccess} />,
  },
];
