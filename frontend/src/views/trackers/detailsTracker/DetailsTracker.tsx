import ContentLayout from "@/layouts/ContentLayout";
import { getTrackerDetails } from "@/services/tracker-service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PriceHistory, Tracker } from "../allTrackers/columns";
import { PriceTrackingChart } from "./PriceTrackingChart";
import { Spinner } from "@/views/fallback/Fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AsteriskIcon,
  PenSquareIcon,
  Save,
  ShoppingBasket,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function DetailsTracker() {
  const { id } = useParams();
  const [details, setDetails] = useState<Tracker>();
  const [historyData, setHistoryData] = useState<PriceHistory>();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const formatter = new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  useEffect(() => {
    if (id) {
      getTrackerDetails(parseInt(id))
        .then((res) => {
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
          setDetails(res?.tracker);
          setHistoryData(res?.price_history);
        })
        .finally(() => {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        });
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  return (
    <ContentLayout title={"Detalles del Rastreador"}>
      {isLoading ? (
        <Skeleton className="h-[36px] rounded-xl" />
      ) : (
        <div className="flex flex-row gap-4">
          {!isEditing ? (
            <>
              <h2>{details?.name}</h2>
              <Button onClick={() => setIsEditing(true)} variant={"secondary"}>
                <PenSquareIcon />
              </Button>
            </>
          ) : (
            <>
              <Input className="max-w-fit" defaultValue={details?.name} />
              <Button variant={"secondary"} onClick={() => setIsEditing(false)}>
                <Save />
              </Button>
            </>
          )}
        </div>
      )}
      <div className="max-h-full overflow-y-scroll overflow-x-hidden w-full gap-4 flex flex-col-reverse lg:flex-row">
        <div className="min-w-[70%] gap-4 flex flex-col">
          <div className="bg-muted/50 min-h-[45dvh] w-full rounded-xl lg:flex-2 lg:h-full">
            {!isLoading && historyData ? (
              <PriceTrackingChart history_data={historyData.history} />
            ) : (
              <div className="w-full h-full flex items-center gap-4">
                <div className="m-auto">
                  <Spinner className="size-6" />
                </div>
              </div>
            )}
          </div>
          <div className="bg-muted/50 min-h-[30dvh] w-full rounded-xl lg:flex-1 lg:h-full"></div>
        </div>
        <div className="bg-muted/50 h-[45dvh] flex flex-col gap-3 p-5 flex-1 rounded-xl lg:min-w-[30%] lg:h-full">
          {details && !isLoading ? (
            <>
              <h3>
                Precio Actual:{" "}
                <span className="bg-sidebar-ring p-2 rounded-xl">
                  {historyData?.history
                    ? formatPrice(historyData?.history.at(-1)?.price ?? 0)
                    : "???"}
                </span>
              </h3>
              <h3>Información</h3>
              <div className="flex flex-wrap gap-2">
                <p className="tracking-tight w-full">General</p>
                <div className="text-sm flex flex-row bg-ring rounded-xl px-2 max-w-fit gap-2">
                  <p>{details.active ? "Activo" : "Inactivo"}</p>
                  <Switch checked={details.active} className="m-auto" />
                </div>
                <p className=" text-sm bg-ring rounded-xl px-2 max-w-fit">
                  Creado el{" "}
                  {formatter
                    .format(new Date(details?.createdAt))
                    .toLocaleLowerCase("es-MX")}
                </p>
                <p className=" text-sm bg-ring rounded-xl px-2 max-w-fit">
                  Ultima edición el{" "}
                  {formatter
                    .format(new Date(details?.updatedAt))
                    .toLocaleLowerCase("es-MX")}
                </p>
                <a href={details.link} target="_blank">
                  <Button>
                    Visitar Publicación <ShoppingBasket />
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                <p className="tracking-tight w-full">Notificaciones</p>
                <div className="text-sm flex flex-row bg-ring rounded-xl px-2 max-w-fit gap-2">
                  <p className="my-auto">SMS</p>
                  <Switch className="my-auto" checked={details.sms_enabled} />
                </div>
                <div className="text-sm flex flex-row bg-ring rounded-xl px-2 max-w-fit gap-2">
                  <p className="my-auto">Email</p>
                  <Switch className="my-auto" checked={details.email_enabled} />
                </div>
                <Select required value={details.traceInterval.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un lapso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Cada 30 mins</SelectItem>
                    <SelectItem value="60">Cada 1 hr</SelectItem>
                    <SelectItem value="180">Cada 2 hrs</SelectItem>
                    <SelectItem value="300">Cada 5 hrs</SelectItem>
                    <SelectItem value="1440">Cada 24 hrs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Guardar Cambios</Button>
            </>
          ) : (
            <SideDetailsSkeleton />
          )}
        </div>
      </div>
    </ContentLayout>
  );
}

function SideDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Precio Actual Skeleton */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Precio Actual:{" "}
          <span className="bg-sidebar-ring p-2 rounded-xl inline-block">
            <Skeleton className="h-4 w-16 bg-gray-300" />
          </span>
        </h2>
      </div>

      {/* Información Section Skeleton */}
      <div>
        <h3 className="text-md font-medium mb-3">
          <Skeleton className="h-5 w-24 bg-gray-300" />
        </h3>
        <div className="flex flex-wrap gap-2">
          <p className="tracking-tight w-full">
            <Skeleton className="h-4 w-16 bg-gray-300" />
          </p>

          {/* Estado Activo/Inactivo Skeleton */}
          <div className="text-sm flex flex-row bg-ring rounded-xl px-2 max-w-fit gap-2 h-8">
            <Skeleton className="h-4 w-12 bg-gray-300 my-auto" />
            <Skeleton className="h-4 w-8 bg-gray-300 my-auto" />
          </div>

          {/* Fechas Skeleton */}
          <div className="text-sm bg-ring rounded-xl px-2 max-w-fit h-8">
            <Skeleton className="h-4 w-32 bg-gray-300 my-1" />
          </div>
          <div className="text-sm bg-ring rounded-xl px-2 max-w-fit h-8">
            <Skeleton className="h-4 w-36 bg-gray-300 my-1" />
          </div>

          {/* Botón Visitar Publicación Skeleton */}
          <div className="h-9">
            <Skeleton className="h-9 w-40 bg-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Notificaciones Section Skeleton */}
      <div>
        <div className="flex flex-wrap gap-2">
          <p className="tracking-tight w-full">
            <Skeleton className="h-4 w-28 bg-gray-300" />
          </p>

          {/* SMS Switch Skeleton */}
          <div className="text-sm flex flex-row bg-ring rounded-xl px-2 max-w-fit gap-2 h-8">
            <Skeleton className="h-4 w-8 bg-gray-300 my-auto" />
            <Skeleton className="h-4 w-8 bg-gray-300 my-auto" />
          </div>

          {/* Email Switch Skeleton */}
          <div className="text-sm flex flex-row bg-ring rounded-xl px-2 max-w-fit gap-2 h-8">
            <Skeleton className="h-4 w-12 bg-gray-300 my-auto" />
            <Skeleton className="h-4 w-8 bg-gray-300 my-auto" />
          </div>

          {/* Select Skeleton */}
          <div className="h-9">
            <Skeleton className="h-9 w-32 bg-gray-300 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
