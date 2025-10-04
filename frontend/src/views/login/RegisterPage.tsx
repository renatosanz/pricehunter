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

            {/* Divider */}
            <div className="relative py-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign Up */}
            <Button
              variant="outline"
              type="button"
              className="w-full bg-transparent"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>

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
