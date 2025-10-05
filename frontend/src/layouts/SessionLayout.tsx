import { isUserLogged, verifyUserSession } from "@/services/user-service";
import Cookies from "js-cookie";
import { SmileIcon } from "lucide-react";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SessionLayout() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const exitApp = () => {
      console.log("not auth session");
      Cookies.remove("isLogged");
      navigate("/login", { replace: true });
    };

    if (isUserLogged()) {
      verifyUserSession().then((response) => {
        if (!response) {
          exitApp();
        }

        if (response?.success) {
          setUser(response.user);
          toast(`Bienvenido ${response.user.name}`, {
            description: "Inicio de sesion verificado",
            icon: <SmileIcon />,
          });
        } else {
          exitApp();
        }
      });
    } else {
      exitApp();
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
