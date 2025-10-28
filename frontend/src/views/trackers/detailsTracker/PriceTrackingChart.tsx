import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  price: {
    label: "Precio",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PriceTrackingChart({ history_data }: { history_data: { timestamp: string; price: number }[] }) {

  if (!history_data || history_data.length == 0) {
    return <div className="w-full h-full flex items-center gap-4">
      <div className="m-auto p-[10%] text-center">
        <h1 className="text-foreground/70">Estamos rastreando tu producto</h1>
        <p className="text-wrap text-foreground/60">Por el momento no se encuentran datos disponibles sobre tu producto, vuelve más tarde porfavor.
        </p>
      </div>
    </div>
  }

  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = React.useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date(history_data[0].timestamp);

    switch (timeRange) {
      case "24h":
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "7d":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90d":
      default:
        cutoffDate.setDate(now.getDate() - 90);
        break;
    }

    return history_data.filter((item) => {
      const date = new Date(item.timestamp);
      return date >= cutoffDate && date <= now;
    });
  }, [history_data, timeRange]);

  const cardDescription = React.useMemo(() => {
    switch (timeRange) {
      case "24h":
        return "Mostrando historial de precios en las últimas 24 horas";
      case "7d":
        return "Mostrando historial de precios en los últimos 7 días";
      case "30d":
        return "Mostrando historial de precios en los últimos 30 días";
      case "90d":
      default:
        return "Mostrando historial de precios en los últimos 3 meses";
    }
  }, [timeRange]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Gráfico Interactivo</CardTitle>
          <CardDescription>
            {cardDescription}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Últimos 30 días
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 días
            </SelectItem>
            <SelectItem value="24h" className="rounded-lg">
              Últimas 24 horas
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.price.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.price.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-MX", {
                  hour: "2-digit",
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-MX", {
                      month: "long",
                      hour: "2-digit",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke={chartConfig.price.color}
            // Removed stackId since we only have one area
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
