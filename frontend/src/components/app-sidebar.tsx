import * as React from "react";
import {
  GalleryVerticalEnd,
  HelpCircle,
  InfoIcon,
  PlusIcon,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./user-nav";
import { useUserStore } from "@/stores/user-store";

const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/home",
    },
    {
      title: "Rastreadores",
      url: "/home/crawlers",
    },
    {
      title: "Historial",
      url: "/home/history",
    },
    {
      title: "Notificaciones",
      url: "/home/notifications",
    },
  ],
  navSecondary: [
    {
      title: "Configuracion",
      url: "settings",
      icon: <Settings />,
    },
    {
      title: "Ayuda",
      url: "help",
      icon: <HelpCircle />,
    },
    {
      title: "Mas Información",
      url: "about",
      icon: <InfoIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore((state) => state.user);
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{user?.name}</span>
                  <span className="">{user?.email}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem className="flex items-center gap-2">
              <Link to="new-crawler" className="w-full">
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear "
                >
                  <PlusIcon />
                  <span>Nuevo Rastreador</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarGroup>
        <SidebarFooter>
          <NavUser user={{ name: "renato", email: "idk", avatar: "" }} />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
