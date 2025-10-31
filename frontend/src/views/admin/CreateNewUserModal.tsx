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
import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { Toggle } from "@/components/ui/toggle";
import { registerUser } from "@/services/user-service";
import { toast } from "sonner";
import { createUser } from "@/services/admin-service";

// esquema de validacion
const formSchema = z
  .object({
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
    password: z
      .string()
      .min(8, {
        error: "Contraseña muy corta",
      })
      .nonempty({ error: "Ingresa una contraseña." }),
    password_validate: z
      .string()
      .nonempty({ error: "Ingresa una contraseña." }),
    role: z.enum(["user", "admin"], { error: "Porfavor selecciona un role" }),
  })
  .refine((data) => data.password === data.password_validate, {
    message: "Las contraseñas no coinciden.",
    path: ["password_validate"],
  });

export default function CreateNewUserModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // datos default para el form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      password_validate: "",
      phone: "",
      role: "user",
    },
  });

  const [pswdInputState, setPswdInputState] = useState<{
    original: "password" | "text";
    confirm: "password" | "text";
  }>({
    original: "password",
    confirm: "password",
  });
  const toggleOriginalPswd = () => {
    setPswdInputState({
      ...pswdInputState,
      original: pswdInputState.original == "password" ? "text" : "password",
    });
  };
  const toggleConfirmPswd = () => {
    setPswdInputState({
      ...pswdInputState,
      confirm: pswdInputState.confirm == "password" ? "text" : "password",
    });
  };

  const handleAddUser = (values: z.infer<typeof formSchema>) => {
    createUser(values).then((res) => {
      if (!res?.success) {
        toast("Error", { description: res?.message });
        return;
      }
      toast("Acción Exitosa", { description: res?.message });
      setIsAddDialogOpen(false);
    });
  };
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Complete la información del nuevo usuario. Los datos se guardarán en
            el sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddUser)}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <div className="flex flex-row gap-2">
                    <FormControl>
                      <Input
                        type={pswdInputState.original}
                        autoComplete="password"
                        placeholder="*********"
                        {...field}
                      />
                    </FormControl>
                    <Toggle
                      onClick={toggleOriginalPswd}
                      aria-label="Toggle password"
                    >
                      {pswdInputState.original == "password" ? (
                        <EyeClosed className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Toggle>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_validate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirma la contraseña</FormLabel>
                  <div className="flex flex-row gap-2">
                    <FormControl>
                      <Input
                        type={pswdInputState.confirm}
                        autoComplete="password"
                        placeholder="*********"
                        onPaste={(e) => e.preventDefault()}
                        {...field}
                      />
                    </FormControl>
                    <Toggle
                      onClick={toggleConfirmPswd}
                      aria-label="Toggle password"
                    >
                      {pswdInputState.confirm == "password" ? (
                        <EyeClosed className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Toggle>
                  </div>
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
            <Button type="submit">Registrar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
