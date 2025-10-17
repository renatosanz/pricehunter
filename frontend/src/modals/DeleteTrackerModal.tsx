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
import { Spinner } from "@/components/ui/spinner";
import useDelete from "@/hooks/useDeleteTracker";
import { deleteTracker } from "@/services/tracker-service";
import { AsteriskIcon } from "lucide-react";
import { toast } from "sonner";

export function DeleteTrackerModal({
  children,
  id,
  name,
}: {
  children: any;
  name: string;
  id: number;
}) {
  const { isDeleting, error, deleteItem } = useDelete(deleteTracker);

  const handleDelete = async () => {
    const success = await deleteItem(id);
    if (!success) {
      return toast.error("Error", {
        description: error,
        icon: <AsteriskIcon />,
      });
    }
    return toast.success("Rastreador eliminado");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar rastreador "{name}"</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Eliminará permanentemente el
            rastreador y eliminará los datos de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {isDeleting && <Spinner />} Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
