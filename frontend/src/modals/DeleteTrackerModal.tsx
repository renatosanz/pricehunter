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
  callback,
}: {
  children: any;
  name: string;
  id: number;
  callback: () => void;
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
    toast.success("Rastreador eliminado");
    return callback();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar rastreador "{name}"</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="leading-6">
              Al eliminar este rastreador se detendra su ejecución de nuestros
              servidores de web scrapping, siempre puedes volver a activarlo
              desde la pestaña de Historial
            </p>
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
