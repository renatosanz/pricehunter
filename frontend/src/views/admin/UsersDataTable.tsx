import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserDataTable from "@/hooks/useUserDataTable";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { User } from "@/services/admin-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import DeleteUserModal from "./DeleteUserModal";
import EditUserModal from "./EditUserModal";

export default function UsersDataTable() {
  const {
    usersData,
    nextPage,
    previousPage,
    setPageSize,
    pageSize,
    setSearchTerm,
  } = useUserDataTable();
  const data = usersData.users;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Usuario",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("name")}</span>
          <span className="text-sm text-muted-foreground">
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={"default"}>{row.getValue("role")}</Badge>
      ),
    },
    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => (
        <div>
          {row.original.isBanned ? (
            <Badge variant={"destructive"}>Suspendido</Badge>
          ) : row.original.isLogged ? (
            <Badge variant={"default"}>Activo</Badge>
          ) : (
            <Badge variant={"outline"}>Inactivo</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "lastLogin",
      header: "Ultimo Acceso",
      cell: ({ row }) => (
        <div>
          {row.getValue("lastLogin")
            ? new Date(row.getValue("lastLogin")).toLocaleDateString("es-MX")
            : "Nunca"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Creacion",
      cell: ({ row }) => (
        <div>
          {row.getValue("createdAt")
            ? new Date(row.getValue("createdAt")).toLocaleDateString("es-MX")
            : "Nunca"}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Telefono
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => row.getValue("phone"),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { id, name } = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <EditUserModal>
                <Button variant={"outline"}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </EditUserModal>
              <DropdownMenuSeparator />
              <DeleteUserModal id={id} name={name}>
                <Button variant={"destructive"}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </DeleteUserModal>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <UserSearchBar
          pageSize={pageSize}
          setPageSize={setPageSize}
          setSearchTerm={setSearchTerm}
        />
      </div>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <p className="font-mono bg-accent px-2 py-1 rounded-sm">
          {usersData.pagination.currentPage}/{usersData.pagination.totalPages}
        </p>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => previousPage()}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => nextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

function UserSearchBar({
  pageSize,
  setPageSize,
  setSearchTerm,
}: {
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleSearch = () => {};
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className=" w-full relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por email..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los roles</SelectItem>
          <SelectItem value="admin">Administrador</SelectItem>
          <SelectItem value="user">Usuario</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="active">Activo</SelectItem>
          <SelectItem value="inactive">Inactivo</SelectItem>
          <SelectItem value="suspended">Suspendido</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => {
          setPageSize(parseInt(value));
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`Max ${pageSize} Resultados`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 resultados</SelectItem>
          <SelectItem value="10">10 resultados</SelectItem>
          <SelectItem value="20">20 resultados</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSearch}>Buscar</Button>
    </div>
  );
}
