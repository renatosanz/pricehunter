import { getHistory, restoreTrackerByID } from "@/services/tracker-service";
import type { Tracker } from "@/views/trackers/allTrackers/columns";
import { AsteriskIcon, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function useFetchHistory() {
  const [history, setHistory] = useState<Tracker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const restoreTracker = (id: number) => {
    restoreTrackerByID(id).then((res) => {
      if (!res?.success) {
        return toast("Ha ocurrido un error", {
          description: "Error al obtener todos los rastreadores",
          duration: 2000,
          icon: <AsteriskIcon />,
        });
      }
      setHistory((prev) => prev.filter((tracker) => tracker.id !== id));
      return toast("Restauración Exitosa", {
        description:
          "Ya puedes encontrar tu rastreador en la pestaña de Rastreadores",
        duration: 2000,
        icon: <Smile />,
        action: {
          label: "Ver",
          onClick: () => navigate("/home/trackers"),
        },
      });
    });
  };

  useEffect(() => {
    setIsLoading(true);
    getHistory().then((res) => {
      setHistory(res?.trackers || []);
      setIsLoading(false);
    });
  }, []);

  return { history, isLoading, restoreTracker };
}
