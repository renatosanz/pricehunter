import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingDown, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sección Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-muted">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Insignia */}
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              🎯 Rastrea. Compara. Ahorra.
            </Badge>

            {/* Título Principal */}
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
                Nunca más te pierdas una{" "}
                <span className="text-primary">oferta</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                PriceHunter rastrea millones de productos en la web y te avisa
                al instante cuando bajan de precio los artículos que te gustan.
              </p>
            </div>

            {/* Botones de llamado a la acción (CTA) */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link to="/login" className="m-auto">
                <Button size="lg" className="h-12  text-base font-semibold">
                  <Search className="mr-2 h-5 w-5" />
                  Comenzar ahora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Características */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cómo funciona PriceHunter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un rastreo de precios simple y potente que te ahorra dinero en
              cada compra
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Rastrea productos
                </h3>
                <p className="text-muted-foreground">
                  Añade cualquier producto de las principales tiendas.
                  Monitoreamos los precios 24/7 en múltiples comercios.
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
                <h3 className="text-xl font-semibold mb-3">
                  Alertas inteligentes
                </h3>
                <p className="text-muted-foreground">
                  Recibe notificaciones al instante por correo, SMS o push
                  cuando salgan las ofertas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sección de llamado a la acción (CTA) */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Listo para empezar a ahorrar?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Únete a miles de compradores inteligentes que nunca pagan precio
                completo. Comienza a rastrear tu primer producto hoy.
              </p>
              <Button size="lg" className="h-12 px-8 text-base font-semibold">
                <Search className="mr-2 h-5 w-5" />
                Comenzar gratis
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
