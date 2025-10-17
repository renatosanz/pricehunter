import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ContentLayout from "@/layouts/ContentLayout";
import { useUserStore } from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  name: z
    .string()
    .min(5, {
      error: "Nombre muy corto",
    })
    .max(64, { error: "Nombre muy largo" })
    .nonempty({ error: "Ingresa un nombre." }),
});

export default function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = () => [];

  return (
    <ContentLayout title="Configuracion">
      <h1 className="text-xlscroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
        Configuracion
      </h1>
      <div className="bg-muted/50 flex-1 rounded-xl min-h-min p-4 gap-2 flex flex-col md:flex-row">
        <div className="p-4">
          <img
            src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1"
            className="m-auto w-[40vw] md:w-[15vw] rounded-xl aspect-square object-cover"
          />
        </div>
        <div className="my-auto text-center md:text-left">
          <p>Nombre</p>
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {user.name}
          </h3>
          <p>Email</p>
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {user.email}
          </h3>
          <Button size={"sm"} className="mt-2">
            Editar <Pencil />
          </Button>
        </div>
      </div>
      <div className="bg-muted/50 flex-3 rounded-xl min-h-min p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre </FormLabel>
                  <FormDescription>
                    Asigna un nombre para identificar tu rastreador
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="cooltracker"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              Guardar <SaveIcon className="size-5" />
            </Button>
          </form>
        </Form>
      </div>
    </ContentLayout>
  );
}
