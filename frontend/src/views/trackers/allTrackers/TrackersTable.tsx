import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AsteriskIcon, LinkIcon, TrashIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteTrackerModal } from "@/modals/DeleteTrackerModal";
import type { Tracker } from "./columns";
import useFetchAllTrackers from "@/hooks/useFetchAllTrackes";
import { toast } from "sonner";

export function DataTable() {
  // obtener los datos de la tabla
  const { trackersData, fetchTrackerList } = useFetchAllTrackers();
  if (trackersData === undefined) {
    toast("Ha ocurrido un error", {
      description: "Error al obtener todos los rastreadores",
      position: "bottom-center",
      duration: 2000,
      icon: <AsteriskIcon />,
    });
  }

  // declaracion de columnas de la tabla
  const columns: ColumnDef<Tracker, Tracker>[] = [
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
                <p className="cursor-pointer underline overflow-hidden max-w-[40vw] text-ellipsis">
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
                <LinkIcon className="cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Vistar en tienda</p>
              </TooltipContent>
            </Tooltip>
          </a>
          <DeleteTrackerModal
            name={row.original.name}
            id={row.original.id}
            callback={fetchTrackerList}
          >
            <Button
              className="cursor-pointer"
              size="icon"
              variant={"destructive"}
            >
              <TrashIcon />
            </Button>
          </DeleteTrackerModal>
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

  // crear la tabla con los datos
  const table = useReactTable<Tracker>({
    data: trackersData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 p-5 text-center">
                <h3 className="mb-0">Aún no hay rastreadores :(</h3>
                <p className="mb-1 text-wrap">
                  Disponible para productos en MercadoLibre, Amazon, Coppel y
                  Liverpool
                </p>
                <Button onClick={() => navigate("/home/new-tracker")}>Crea un nuevo rastreador</Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
