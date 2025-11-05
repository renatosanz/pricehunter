import ContentLayout from "@/layouts/ContentLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Bell, Eye } from "lucide-react";
import "./styles.css";
import { useUserStore } from "@/stores/user-store";
import useFetchDashboardData from "@/hooks/useFetchDashboardData";
import { Spinner } from "../fallback/Fallback";
import { useNavigate, type NavigateFunction } from "react-router-dom";

export default function Dashboard() {
  const { user } = useUserStore();
  const { dashboardData, newWeekTrackers, isLoading } = useFetchDashboardData();
  const navigate = useNavigate();

  return (
    <ContentLayout title="Dashboard">
      {/* welcome banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          ¡Bienvenido de vuelta, {user.name}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Monitorea tus productos favoritos y ahorra inteligentemente
        </p>
      </div>

      {/* stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatsCard
          title="Rastreadores Activos"
          value={dashboardData?.trackersCount}
          description={
            newWeekTrackers && newWeekTrackers > 0
              ? `+${newWeekTrackers} esta semana`
              : "Sin cambios"
          }
          icon={<TrendingUp className="h-4 w-4" />}
          isLoading={isLoading}
          trend="up"
        />
        <StatsCard
          title="Alertas Activas"
          value={dashboardData?.nofificationCount}
          description="Sin cambios"
          icon={<Bell className="h-4 w-4" />}
          isLoading={isLoading}
          trend="neutral"
        />
      </div>

      {/* main grid */}
      <div className="grid auto-rows-min gap-6 md:grid-cols-2 xl:grid-cols-3">
        <RecentActivityCard
          trackersList={dashboardData?.latestTrackers}
          navigate={navigate}
        />
      </div>

      {/* bottom banner */}
    </ContentLayout>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  isLoading,
}: {
  title: string;
  value: number | string | undefined;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  isLoading: boolean;
}) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        {!isLoading ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              <p className={`text-xs mt-1 ${trendColors[trend]}`}>
                {description}
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Spinner className="m-auto size-8" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivityCard({
  trackersList,
  navigate,
}: {
  trackersList: { name: string; id: number; createdAt: string }[] | undefined;
  navigate: NavigateFunction;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Tus rastreadores más recientes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {trackersList ? (
          trackersList.length > 0 ? (
            trackersList.map(({ name, id, createdAt }) => {
              const date = new Date(createdAt);
              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {date.toLocaleDateString("es-MX", {
                          month: "long",
                          hour: "2-digit",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => navigate(`/home/trackers/${id}`)}>
                    Ver
                  </Button>
                </div>
              );
            })
          ) : (
            <>
              <h3 className="mb-0">Aún no hay rastreadores :(</h3>
              <p>Disponible para productos en MercadoLibre, Amazon, Coppel y Liverpool</p>
              <Button onClick={()=>navigate("/home/new-tracker")}>
                Crea un nuevo rastreador
              </Button>
            </>
          )
        ) : (
          <div className="flex items-center justify-between">
            <Spinner className="m-auto size-8 " />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
