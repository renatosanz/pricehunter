import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
      return <Link to={`${trackerId}`}>{name}</Link>;
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => (
      <a target="_blank" href={row.getValue("link")}>
        <Button variant={"ghost"}>
          Visitar link
          <LinkIcon />
        </Button>
      </a>
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
