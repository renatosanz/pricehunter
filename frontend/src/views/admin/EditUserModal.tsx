import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { editUser, type User } from "@/services/admin-service";
import { toast } from "sonner";
import { AsteriskIcon, Smile } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// esquema de validacion
const formSchema = z.object({
  name: z
    .string()
    .min(5, {
      error: "Nombre muy corto",
    })
    .max(64, { error: "Nombre muy largo" })
    .nonempty({ error: "Ingresa un nombre." }),
  email: z
    .email({
      error: "Email no valido",
    })
    .nonempty({ error: "Ingresa un email." }),
  phone: z
    .string()
    .regex(/^\d{10}$/, { error: "Telefono no valido" })
    .nonempty({ error: "Ingresa un email." }),
  role: z.enum(["user", "admin"], { error: "Porfavor selecciona un role" }),
});

export default function EditUserModal({
  children,
  userData,
  callback,
}: {
  children: React.ReactNode;
  userData: User;
  callback: (
    id: number,
    update: {
      name: string;
      role: "admin" | "user";
      phone: string;
      email: string;
    }
  ) => void;
}) {
  // datos default para el form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      role: userData.role,
    },
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const handleEditUser = (values: z.infer<typeof formSchema>) => {
    editUser(values, userData.id).then((res) => {
      if (!res?.success) {
        return toast("Ha ocurrido un error", {
          description: res?.message ?? "Error actualizando usuario",
          position: "bottom-center",
          duration: 2000,
          icon: <AsteriskIcon />,
        });
      }

      callback(userData.id, res.update);
      return toast("Edición Exitósa", {
        description: `Los datos del ${res.update.name} se han actualizado`,
        position: "bottom-center",
        duration: 2000,
        icon: <Smile />,
      });
    });
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifique la información del usuario seleccionado.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditUser)}
            className="flex w-full flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Jack Harlow"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jack.harlow@email.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="1234567890"
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      defaultValue="user"
                      onValueChange={(value: "user" | "admin") =>
                        form.setValue("role", value)
                      }
                      {...field}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="user">Usuario</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
