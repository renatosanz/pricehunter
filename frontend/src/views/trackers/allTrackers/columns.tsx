import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { LinkIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Tracker = {
  id: number;
  traceInterval: number;
  active: boolean;
  name: string;
  link: string;
  createdAt: string;
  image: string;
};

export const columns: ColumnDef<Tracker>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const name: string = row.getValue("name");
      const trackerId: number = row.original.id;
      return (
        <Link to={`${trackerId}`}>
          <Tooltip>
            <TooltipTrigger>
              <p className=" underline overflow-hidden max-w-[40vw] text-ellipsis">
                {name}
              </p>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Ver Detalles</p>
            </TooltipContent>
          </Tooltip>
        </Link>
      );
    },
  },
  {
    accessorKey: "link",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex gap-4">
        <a target="_blank" className="flex gap-4" href={row.getValue("link")}>
          <Tooltip>
            <TooltipTrigger>
              <LinkIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>Vistar en tienda</p>
            </TooltipContent>
          </Tooltip>
        </a>
        <Button size="icon" variant={"destructive"}>
          <TrashIcon />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "active",
    header: "Estatus",
    cell: ({ row }) => {
      const status = row.getValue("active");
      return status ? <Badge>Activo</Badge> : <Badge>Inactivo</Badge>;
    },
  },
  {
    accessorKey: "traceInterval",
    header: "Intervalo de Rastreo",
    cell: ({ row }) => {
      const intervalMinutes = row.original.traceInterval;
      const intervalFormatted =
        intervalMinutes >= 60
          ? `Cada ${Math.floor(intervalMinutes / 60)} hr(s)`
          : `Cada ${intervalMinutes} min(s)`;
      return <Badge variant={"secondary"}>{intervalFormatted}</Badge>;
    },
  },
];
