import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/services/user-service";
import { toast } from "sonner";
import { LogOut, LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { Label } from "./ui/label";
import { useTheme } from "./theme-provider";
import { Toggle } from "./ui/toggle";

export function NavUser({
  user,
}: {
  user: {
    name: string; 
    email: string;
    avatar: string;
  };
}) {
  const navigate = useNavigate();
  const { name } = useUserStore((state) => state.user);
  const { setTheme, theme } = useTheme();

  const { isMobile } = useSidebar();
  const handleLogout = () => {
    logoutUser().then((res) => {
      toast("Sesion Terminada", {
        description: res.message ? res.message : `Hasta luego ${name}.`,
        position: "bottom-center",
        duration: 2000,
        icon: <LogOutIcon />,
        onAutoClose: () => {
          navigate("/", { replace: true });
        },
      });
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex gap-4 p-1">
              <div className=" items-center space-x-2 flex flex-row gap-1 my-auto">
                <Toggle
                  pressed={theme == "dark"}
                  onPressedChange={(event) => {
                    setTheme(event ? "dark" : "light");
                  }}
                >
                  {theme == "dark" ? <MoonIcon /> : <SunIcon />}
                </Toggle>
                <Label htmlFor="dark-mode">
                  {theme == "dark" ? "Tema Oscuro" : "Tema Claro"}
                </Label>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Cerrar Sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
