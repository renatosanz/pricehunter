import { Asterisk, } from "lucide-react";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  useEffect(() => {
    const exitApp = () => {
      toast("Acceso Denegado", {
        description: "Solo administradores",
        icon: <Asterisk />,
      });
      navigate("/home", { replace: true });
    };
    if (user.role != "admin") {
      return exitApp();
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
