import ContentLayout from "@/layouts/ContentLayout";
import type { Tracker } from "../trackers/allTrackers/columns";
import {
  ArrowUpLeftSquare,
  Link,
  Trash2,
  Calendar,
  Clock,
  Target,
  ExternalLink,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Empty } from "@/components/ui/empty";
import useFetchHistory from "@/hooks/useFetchHistory";

export default function HistoryPage() {
  const { history, isLoading, restoreTracker } = useFetchHistory();
  return (
    <ContentLayout title="Historial">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <History className="h-8 w-8 text-muted-foreground" />
          <h1 className="text-3xl font-bold tracking-tight">
            Historial de Rastreadores
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Visualiza todos los rastreadores que han sido eliminados
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total en historial
                </p>
                <p className="text-2xl font-bold">
                  {history.length} rastreadores
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Trash2 className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : history.length === 0 ? (
        <Empty title="No hay historial" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((tracker) => (
            <HistoryItemCard
              key={tracker.id}
              tracker={tracker}
              restoreCallback={restoreTracker}
            />
          ))}
        </div>
      )}
    </ContentLayout>
  );
}

function HistoryItemCard({
  tracker,
  restoreCallback,
}: {
  tracker: Tracker;
  restoreCallback: (id: number) => void;
}) {
  const getIntervalBadge = (minutes: number) => {
    const intervals = {
      30: { label: "30 min", variant: "secondary" as const },
      60: { label: "1 hora", variant: "secondary" as const },
      180: { label: "3 horas", variant: "outline" as const },
      300: { label: "5 horas", variant: "outline" as const },
      1440: { label: "24 horas", variant: "default" as const },
    };

    return (
      intervals[minutes as keyof typeof intervals] || {
        label: "Personalizado",
        variant: "secondary" as const,
      }
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  const intervalInfo = getIntervalBadge(tracker.traceInterval);

  return (
    <Card className="group hover:shadow-md transition-all duration-200 ">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm leading-tight line-clamp-2">
            {tracker.name}
          </CardTitle>
          <Trash2 className="size-5" />
        </div>
        <CardDescription className="line-clamp-2">
          {tracker.link && (
            <a
              href={tracker.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Ver producto original
            </a>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-muted/50 rounded-lg">
          <Target className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-medium">Precio objetivo</p>
            <p className="text-lg font-bold text-primary">
              {formatPrice(tracker.target_price)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={intervalInfo.variant}
            className="flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            {intervalInfo.label}
          </Badge>

          {tracker.createdAt && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(tracker.createdAt).toLocaleDateString("es-MX")}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-3 border-t">
        <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
          <a href={tracker.link} target="_blank" rel="noopener noreferrer">
            <Link className="h-4 w-4" />
            Enlace
          </a>
        </Button>

        <Button
          size="sm"
          className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
          onClick={() => {
            restoreCallback(tracker.id);
          }}
        >
          <ArrowUpLeftSquare className="h-4 w-4" />
          Restaurar
        </Button>
      </CardFooter>
    </Card>
  );
}
