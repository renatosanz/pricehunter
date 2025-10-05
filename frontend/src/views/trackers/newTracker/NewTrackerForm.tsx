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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createNewTracker } from "@/services/tracker-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlaneIcon, TrainTrackIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  name: z
    .string()
    .nonempty({ error: "Ingresa un nombre porfavor" })
    .min(5, { error: "Nombre muy corto" })
    .max(64, { error: "Nombre muy largo" }),
  link: z
    .url({ error: "URL no valido", abort: true })
    .nonempty({ error: "Ingresa el link del producto a rastrear porfavor" }),
  traceInterval: z
    .number()
    .nonnegative({ error: "No se pueden asignar valores negativos" })
    .min(1, { error: "El intervalo debe ser al menos 1" }),
});

export default function NewTrackerForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      link: "",
      traceInterval: 2,
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    createNewTracker(values).then((res) => {
      if (!res?.success) {
        toast("Error", {
          description: res?.message,
          position: "bottom-center",
        });
      }

      toast("Bienvenido", {
        description: "Registro exitoso.",
        position: "bottom-center",
        duration: 2000,
        action: {
          label: "Ver Detalles",
          onClick: () => navigate(`/home/trackers/${res?.tracker.id}`),
        },
      });
      navigate("/home");
    });
  };

  return (
    <>
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
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormDescription>
                  Link de la pagina donde se encuentra el producto que deseas
                  rastrear
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="http://ecommerce/items/?q=iphone17"
                    type="url"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="traceInterval"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Lapso de rastreo</FormLabel>
                <FormDescription>
                  El rastreo se realizara de forma asincrona cada determinado
                  periodo de tiempo que tu eligas.
                </FormDescription>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  required
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un lapso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30">Cada 30 mins</SelectItem>
                    <SelectItem value="60">Cada 1 hr</SelectItem>
                    <SelectItem value="180">Cada 2 hrs</SelectItem>
                    <SelectItem value="300">Cada 5 hrs</SelectItem>
                    <SelectItem value="1440">Cada 24 hrs</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            A rastrear! <PlaneIcon className="size-5" />
          </Button>
        </form>
      </Form>
    </>
  );
}
