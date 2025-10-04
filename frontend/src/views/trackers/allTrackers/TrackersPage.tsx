import ContentLayout from "@/layouts/ContentLayout";
import { columns, type Tracker } from "./columns";
import { DataTable } from "./data-table";
import { getAllTrackers } from "@/services/tracker-service";
import { useEffect, useState } from "react";
import { AsteriskIcon, Bell, Search, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export default function TrackersPage() {
  const [trackersData, setTrackersData] = useState<Tracker[]>([]);
  useEffect(() => {
    getAllTrackers().then((res) => {
      if (!res) {
        toast("Ha ocurrido un error", {
          description: "Error al obtener todos los rastreadores",
          position: "bottom-center",
          duration: 2000,
          icon: <AsteriskIcon />,
        });
        return;
      }
      setTrackersData(res);
    });
    return () => {};
  }, []);

  return (
    <ContentLayout title="Rastreadores">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Rastrea productos</h3>
            <p className="text-muted-foreground">
              Añade cualquier producto de las principales tiendas. Monitoreamos
              los precios 24/7 en múltiples comercios.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingDown className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Bajas de precio</h3>
            <p className="text-muted-foreground">
              Recibe alertas en tiempo real cuando los precios bajan de tu
              objetivo. Nunca más pagues el precio completo.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Alertas inteligentes</h3>
            <p className="text-muted-foreground">
              Recibe notificaciones al instante por correo, SMS o push cuando
              salgan las ofertas.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <DataTable columns={columns} data={trackersData} />
      </div>
    </ContentLayout>
  );
}
