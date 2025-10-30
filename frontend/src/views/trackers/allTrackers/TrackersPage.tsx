import ContentLayout from "@/layouts/ContentLayout";
import { AsteriskIcon, Bell, Search, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { columns } from "./columns";
import { DataTable } from "./TrackersTable";
import useFetchAllTrackers from "@/hooks/useFetchAllTrackes";

export default function TrackersPage() {
  const trackersData = useFetchAllTrackers();
  if (trackersData === undefined) {
    toast("Ha ocurrido un error", {
      description: "Error al obtener todos los rastreadores",
      position: "bottom-center",
      duration: 2000,
      icon: <AsteriskIcon />,
    });
  }

  return (
    <ContentLayout title="Rastreadores">
      <h1 className="text-xlscroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
        Tus Rastreadores
      </h1>
      <div className="flex flex-col-reverse md:flex-col gap-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardContent className="p-2 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rastrea productos</h3>
              <p className="text-muted-foreground">
                Añade cualquier producto de las principales tiendas.
                Monitoreamos los precios 24/7 en múltiples comercios.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardContent className="p-2 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
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
            <CardContent className="p-2 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Alertas inteligentes
              </h3>
              <p className="text-muted-foreground">
                Recibe notificaciones al instante por correo, SMS o push cuando
                salgan las ofertas.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="bg-muted/50 flex-1 rounded-xl min-h-min">
          <DataTable
            columns={columns}
            data={trackersData ? trackersData : []}
          />
        </div>
      </div>
    </ContentLayout>
  );
}
