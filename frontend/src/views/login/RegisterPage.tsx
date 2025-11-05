import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus, ArrowLeft, Eye, EyeClosed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { registerUser } from "@/services/user-service";
import { toast } from "sonner";

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
  })
  .refine((data) => data.password === data.password_validate, {
    message: "Las contraseñas no coinciden.",
    path: ["password_validate"],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  // datos default para el form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      password_validate: "",
      phone: "",
    },
  });

  // toggles para cambiar visibilidad de contraseñas
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

  // enviar datos al backend
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    registerUser(values).then((res) => {
      res.success
        ? toast("Bienvenido", {
            description: "Registro exitoso.",
            position: "bottom-center",
            duration: 2000,
            onAutoClose: () => {
              navigate("/login");
            },
          })
        : toast("Error", {
            description: res.message,
            position: "bottom-center",
            action: {
              label: "Iniciar Sesion",
              onClick: () => navigate("/login"),
            },
          });
    });
    console.log(values);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <div className="mb-6">
          <Link
            to={"/"}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a PriceHunter
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Crea una cuenta</CardTitle>
            <CardDescription>
              Unete a PriceHunter y comienza a ahorrar dinero en tus productos
              favoritos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="Nombre"
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
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu_email@email.com"
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
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="2212121212"
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
                      <div className="flex flex-row gap-2">
                        <FormControl>
                          <Input
                            type={pswdInputState.original}
                            autoComplete="password"
                            placeholder="Contraseña"
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
                      <div className="flex flex-row gap-2">
                        <FormControl>
                          <Input
                            type={pswdInputState.confirm}
                            autoComplete="password"
                            placeholder="Confirma la contraseña"
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
                <Button type="submit">Registrar</Button>
              </form>
            </Form>
            
            {/* Login Link */}
            <div className="mt-6 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Inicia Sesion
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
