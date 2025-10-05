import ContentLayout from "@/layouts/ContentLayout";
import { getTrackerDetails } from "@/services/tracker-service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Tracker } from "../allTrackers/columns";
import { PriceTrackingChart } from "./PriceTrackingChart";
import { Spinner } from "@/views/fallback/Fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AsteriskIcon } from "lucide-react";

export default function DetailsTracker() {
  const { id } = useParams();
  const [details, setDetails] = useState<Tracker>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getTrackerDetails(parseInt(id)).then((res) => {
        if (!res?.success) {
          navigate("/home", { replace: true });
          toast("Ha ocurrido un error", {
            description: "Rastreador no encontrado",
            position: "bottom-center",
            duration: 2000,
            icon: <AsteriskIcon />,
          });
          return;
        }
        setIsLoading(false);
        setDetails(res?.tracker);
      });
    }
    return () => {};
  }, []);

  return (
    <ContentLayout title={"Detalles del Rastreador"}>
      {isLoading ? (
        <Skeleton className="h-[36px] rounded-xl" />
      ) : (
        <h2 className="text-xlscroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
          {details?.name}
        </h2>
      )}
      <div className="max-h-full overflow-y-scroll overflow-x-hidden w-full gap-4 flex flex-col-reverse lg:flex-row">
        <div className="min-w-[75%] gap-4 flex flex-col">
          <div className="bg-muted/50 min-h-[45dvh] w-full rounded-xl lg:flex-2 lg:h-full">
            {!isLoading ? (
              <PriceTrackingChart />
            ) : (
              <div className="w-full h-full flex items-center gap-4">
                <div className="m-auto">
                  <Spinner className="size-6" />
                </div>
              </div>
            )}
          </div>
          <div className="bg-muted/50 min-h-[45dvh] w-full rounded-xl lg:flex-1 lg:h-full"></div>
        </div>
        <div className="bg-muted/50 w-full h-[45dvh] flex-1 rounded-xl lg:min-w-[25%] lg:h-full"></div>
      </div>
    </ContentLayout>
  );
}
