import {
  Eye,
  EyeClosed,
  GalleryVerticalEnd,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { isUserLogged, loginUser } from "@/services/user-service";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Toggle } from "@radix-ui/react-toggle";

const formSchema = z.object({
  email: z
    .email({
      error: "Email no valido",
    })
    .nonempty({ error: "Ingresa un email." }),
  password: z
    .string()
    .min(8, {
      error: "Contraseña muy corta",
    })
    .nonempty({ error: "Ingresa una contraseña." }),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [pswdVisible, setPswdVisible] = useState(false);

  useEffect(() => {
    if (isUserLogged()) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginUser(values).then((res) => {
      if (res.success) {
        toast("Bienvenido", {
          description: "Inicio de sesion exitoso.",
          position: "bottom-center",
          duration: 2000,
          icon: <UserRoundCheck />,
          onAutoClose: () => {
            navigate("/home", { replace: true });
          },
        });
      } else {
        toast("Error", {
          description: res.message,
          position: "bottom-center",
        });
      }
    });
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium cursor-pointer"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          PriceHunter
        </Link>

        <div className={"flex flex-col gap-6"}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Bienvenido</CardTitle>
              <CardDescription>Empieza a rastrear con PriceHunter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* form para inicio de sesion */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="cool_email@email.com"
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <div className="flex flex-row gap-2">
                              <FormControl>
                                <Input
                                  type={pswdVisible ? "text" : "password"}
                                  autoComplete="password"
                                  placeholder="coolpassword"
                                  {...field}
                                />
                              </FormControl>
                              <Toggle
                                onClick={() => setPswdVisible(!pswdVisible)}
                                aria-label="Toggle password"
                              >
                                {pswdVisible ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeClosed className="h-4 w-4" />
                                )}
                              </Toggle>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Acceder
                    </Button>
                  </form>
                </Form>

                <div className="text-center text-sm">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/register" className="underline underline-offset-4">
                    Registrate
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
