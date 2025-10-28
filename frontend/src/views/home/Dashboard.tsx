import ContentLayout from "@/layouts/ContentLayout";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Glasses,
  ShoppingBag,
  DrumstickIcon,
  ShoppingBasket,
  BookAIcon,
  CookieIcon,
  Car,
  Smartphone,
  Shirt,
  Footprints,
  TrendingUp,
  Bell,
  BarChart3,
  Target,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Clock,
  Award,
  Heart,
  Eye,
} from "lucide-react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import "./styles.css";
import { useEffect, useRef } from "react";
import { useUserStore } from "@/stores/user-store";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  return (
    <ContentLayout title="Dashboard">
      {/* Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          ¡Bienvenido de vuelta, {user.name}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Monitorea tus productos favoritos y ahorra inteligentemente
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Productos Activos"
          value="12"
          description="+2 esta semana"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="Ahorro Total"
          value="$1,240"
          description="Este mes"
          icon={<Zap className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="Alertas Activas"
          value="8"
          description="Sin cambios"
          icon={<Bell className="h-4 w-4" />}
          trend="neutral"
        />
        <StatsCard
          title="Tasa de Éxito"
          value="85%"
          description="Compras óptimas"
          icon={<Target className="h-4 w-4" />}
          trend="up"
        />
      </div>

      {/* Main Grid */}
      <div className="grid auto-rows-min gap-6 md:grid-cols-2 xl:grid-cols-3">
        <CreateNewTrackerBanner nav={navigate} />
        <QuickActionsCard nav={navigate} />
        <RecentActivityCard />
        <PriceAlertsCard />
        <FeaturedCategoriesCard nav={navigate} />
        <ProTipsCard />
      </div>

      {/* Bottom Banner */}
    </ContentLayout>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
  trend
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className={`text-xs mt-1 ${trendColors[trend]}`}>
              {description}
            </p>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateNewTrackerBanner({ nav }: { nav: NavigateFunction }) {
  const scroller_one = useRef<HTMLDivElement>(null);
  const scroller_two = useRef<HTMLDivElement>(null);
  const shouldAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const productIcons = [
    Glasses, DrumstickIcon, ShoppingBasket, BookAIcon,
    CookieIcon, Car, Smartphone, Shirt, Footprints,
  ];

  const addAnimation = () => {
    if (scroller_one.current && scroller_two.current) {
      scroller_one.current.setAttribute("data-animated", "true");
      duplicateScrollerItems(scroller_one.current);
      scroller_two.current.setAttribute("data-animated", "true");
      duplicateScrollerItems(scroller_two.current);
    }
  };

  const duplicateScrollerItems = (scroller: HTMLDivElement) => {
    const scrollerInner = scroller.querySelector(".scroller__inner");
    if (!scrollerInner) return;

    const scrollerContent = Array.from(scrollerInner.children);
    if (scrollerContent.length === productIcons.length) {
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;
        duplicatedItem.setAttribute("aria-hidden", "true");
        scrollerInner.appendChild(duplicatedItem);
      });
    }
  };

  const handleCreateTracker = () => {
    nav("/home/new-tracker");
  };

  useEffect(() => {
    if (shouldAnimate) {
      addAnimation();
    }
  });

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-xl">Comenzar a Rastrear</CardTitle>
        <CardDescription>
          Más de 100 mil productos te esperan con precios en tiempo real
        </CardDescription>
        <CardAction>
          <Button onClick={handleCreateTracker} className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Crear Rastreador
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div data-speed="fast" className="scroller" ref={scroller_one}>
          <ul className="tag-list scroller__inner">
            {productIcons.map((IconComponent, index) => (
              <li key={index} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                <IconComponent className="h-6 w-6" />
              </li>
            ))}
          </ul>
        </div>
        <div data-speed="fast" data-direction="right" className="scroller" ref={scroller_two}>
          <ul className="tag-list scroller__inner">
            {productIcons.map((IconComponent, index) => (
              <li key={index} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                <IconComponent className="h-6 w-6" />
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ nav }: { nav: NavigateFunction }) {
  const quickActions = [
    {
      title: "Ver Analytics",
      description: "Métricas detalladas",
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => nav("/analytics"),
      color: "bg-blue-500"
    },
    {
      title: "Configurar Alertas",
      description: "Precios objetivo",
      icon: <Bell className="h-5 w-5" />,
      action: () => nav("/alerts"),
      color: "bg-green-500"
    },
    {
      title: "Productos Populares",
      description: "Tendencias actuales",
      icon: <TrendingUp className="h-5 w-5" />,
      action: () => nav("/trending"),
      color: "bg-purple-500"
    },
    {
      title: "Mis Favoritos",
      description: "Guardados recientemente",
      icon: <Heart className="h-5 w-5" />,
      action: () => nav("/favorites"),
      color: "bg-red-500"
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Accesos directos a funciones principales</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50"
            onClick={action.action}
          >
            <div className={`p-2 rounded-lg ${action.color} text-white`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium text-wrap">{action.title}</span>
            <span className="text-xs text-muted-foreground text-wrap">{action.description}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentActivityCard() {
  const activities = [
    { product: "iPhone 15 Pro", change: "-$150", time: "Hace 2h", type: "price_drop" },
    { product: "Nike Air Max", change: "En stock", time: "Hace 5h", type: "stock" },
    { product: "MacBook Air", change: "-$200", time: "Ayer", type: "price_drop" },
    { product: "Samsung TV", change: "Pico de precio", time: "Ayer", type: "price_peak" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Cambios en tus productos monitoreados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${activity.type === 'price_drop' ? 'bg-green-100 text-green-600' :
                activity.type === 'price_peak' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">{activity.product}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
            <Badge variant={
              activity.type === 'price_drop' ? 'default' :
                activity.type === 'price_peak' ? 'destructive' : 'secondary'
            }>
              {activity.change}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PriceAlertsCard() {
  const alerts = [
    { product: "PlayStation 5", target: "$9,999", current: "$12,499", progress: 80 },
    { product: "AirPods Pro", target: "$3,499", current: "$4,199", progress: 65 },
    { product: "Kindle Paperwhite", target: "$1,999", current: "$2,499", progress: 45 },
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
              <span className="text-muted-foreground">{alert.current} → {alert.target}</span>
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

function FeaturedCategoriesCard({ nav }: { nav: NavigateFunction }) {
  const categories = [
    { name: "Tecnología", icon: <Smartphone className="h-5 w-5" />, items: "12,450 productos" },
    { name: "Ropa", icon: <Shirt className="h-5 w-5" />, items: "8,920 productos" },
    { name: "Hogar", icon: <ShoppingBasket className="h-5 w-5" />, items: "15,230 productos" },
    { name: "Deportes", icon: <Footprints className="h-5 w-5" />, items: "5,670 productos" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorías Destacadas</CardTitle>
        <CardDescription>Explora por categoría popular</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => nav(`/categories/${category.name.toLowerCase()}`)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {category.icon}
              </div>
              <div className="text-left">
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.items}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function ProTipsCard() {
  const tips = [
    {
      icon: <Clock className="h-4 w-4" />,
      title: "Mejor Momento",
      description: "Compra los martes por la mañana para mejores precios"
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: "Precio Objetivo",
      description: "Establece alertas al 70% del precio original"
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Compras Seguras",
      description: "Siempre verifica al vendedor antes de comprar"
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Tips Pro
        </CardTitle>
        <CardDescription>Consejos para maximizar tus ahorros</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg shrink-0">
              {tip.icon}
            </div>
            <div>
              <p className="font-medium text-sm">{tip.title}</p>
              <p className="text-xs text-muted-foreground">{tip.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PremiumBanner() {
  return (
    <Card className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Actualiza a Premium</h3>
              <p className="text-white/80 text-sm">
                Alertas instantáneas, analytics avanzados y más
              </p>
            </div>
          </div>
          <Button variant="secondary" className="whitespace-nowrap">
            Descubrir Beneficios
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
