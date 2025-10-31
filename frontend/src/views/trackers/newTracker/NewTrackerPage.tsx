import ContentLayout from "@/layouts/ContentLayout";
import NewTrackerForm from "./NewTrackerForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeQuestionMark, BellPlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NewTrackerPage() {
  return (
    <ContentLayout title="Nuevo Rastreador">
      <div className="flex">
        <Card className="m-auto w-full max-w-xl">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Crea nuevo Rastreador</CardTitle>
            <CardDescription>
              <p>
                Crea un rastreador que monitoree el precio de un articulo en
                alguna de las tiendas ecommerce soportadas.
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <BadgeQuestionMark></BadgeQuestionMark>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ecommerce soportados: MercadoLibre, Amazon, Coppel y Liverpool</p>
                </TooltipContent>
              </Tooltip>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewTrackerForm />
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
