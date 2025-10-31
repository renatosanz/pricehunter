import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useDeleteUser from "@/hooks/useDeleteUser";
import { useState } from "react";

export default function DeleteUserModal({
  children,
  id,
  name,
}: {
  children: React.ReactNode;
  id: number;
  name: string;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { canDelete, handleDeleteUser } = useDeleteUser(id);
  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {canDelete ? (
            <>
              <AlertDialogTitle>
                ¿Está seguro de eliminar este usuario?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El usuario {name} será
                eliminado permanentemente del sistema.
              </AlertDialogDescription>
            </>
          ) : (
            <>
              <AlertDialogTitle>
                No puedes eliminiarte a ti mismo
              </AlertDialogTitle>
              <AlertDialogDescription>
                PriceHunter no permitirá que elimines tu cuenta por este medio,
                para eliminar tu cuenta dirigete a la pestaña de Configuración.
              </AlertDialogDescription>
            </>
          )}
        </AlertDialogHeader>
        {canDelete ? (
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        ) : (
          <AlertDialogFooter>
            <AlertDialogCancel>Cerrar</AlertDialogCancel>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
