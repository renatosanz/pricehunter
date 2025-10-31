import { deleteUser } from "@/services/admin-service";
import { useUserStore } from "@/stores/user-store";
import { AsteriskIcon, Smile } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function useDeleteUser(deleteID: number) {
  const { user } = useUserStore();
  const [canDelete, setCanDelete] = useState(false);
  const handleDeleteUser = () => {
    deleteUser(deleteID).then((res) => {
      if (!res?.success) {
        return toast("Ha ocurrido un error", {
          description: res?.message,
          duration: 2000,
          icon: <AsteriskIcon />,
        });
      }
      return toast("Usuario Eliminado", {
        description: res?.message,
        duration: 2000,
        icon: <Smile />,
      });
    });
  };
  useEffect(() => {
    if (user.id != deleteID) {
      return setCanDelete(true);
    }
  }, []);
  return { handleDeleteUser, canDelete };
}
