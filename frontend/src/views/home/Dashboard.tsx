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

export default function Dashboard() {
  const { user } = useUserStore();
  const { dashboardData, newWeekTrackers } = useFetchDashboardData();

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
          trend="up"
        />
        <StatsCard
          title="Alertas Activas"
          value={dashboardData?.nofificationCount}
          description="Sin cambios"
          icon={<Bell className="h-4 w-4" />}
          trend="neutral"
        />
      </div>

      {/* main grid */}
      <div className="grid auto-rows-min gap-6 md:grid-cols-2 xl:grid-cols-3">
        <RecentActivityCard trackersList={dashboardData?.latestTrackers} />
        <PriceAlertsCard />
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
}: {
  title: string;
  value: number | string | undefined;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        {value ? (
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
}: {
  trackersList: { name: string; id: number; createdAt: string }[] | undefined;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Tus rastreadores más recientes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {trackersList ? (
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
                <Button>Ver</Button>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-between">
            <Spinner className="m-auto size-8 " />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PriceAlertsCard() {
  const alerts = [
    {
      product: "PlayStation 5",
      target: "$9,999",
      current: "$12,499",
      progress: 80,
    },
    {
      product: "AirPods Pro",
      target: "$3,499",
      current: "$4,199",
      progress: 65,
    },
    {
      product: "Kindle Paperwhite",
      target: "$1,999",
      current: "$2,499",
      progress: 45,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Precio</CardTitle>
        <CardDescription>Cerca de alcanzar tus objetivos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{alert.product}</span>
              <span className="text-muted-foreground">
                {alert.current} → {alert.target}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${alert.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full gap-2">
          <Bell className="h-4 w-4" />
          Gestionar Todas las Alertas
        </Button>
      </CardContent>
    </Card>
  );
}
