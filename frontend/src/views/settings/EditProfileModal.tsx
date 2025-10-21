import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useUserStore, type UserI } from "@/stores/user-store";
import { updateUser } from "@/services/user-service";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "../fallback/Fallback";

const schema = z.object({
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
});

export function EditProfileModal({
  children,
  user,
}: {
  children: any;
  user: UserI;
}) {
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState<boolean>();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...user,
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    setLoading(true);
    updateUser(values)
      .then((res) => {
        if (!res?.success) {
          toast("Error al actualizar el perfil");
          return;
        }
        setUser({ ...res?.user, role: user.role });
        toast("Perfil Actualizado", {
          description: "Continua rastreando con PriceHunter",
        });
        console.log(res);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setOpen(false);
        }, 1000);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Realiza cambios en tu perfil aquí. Haz clic en "Guardar" cuando
            hayas terminado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" disabled={loading} {...field} />
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
                    <Input autoComplete="off" disabled={loading} {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button className="p-4" type="submit" disabled={loading}>
                Guardar {loading && <Spinner scale={1} />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
