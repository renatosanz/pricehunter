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
import { Link, useLocation } from "react-router-dom";
import { NavSecondary } from "./secondary-sidebar";
import { NavUser } from "./user-sidebar";
import { useUserStore } from "@/stores/user-store";

const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/home",
    },
    {
      title: "Rastreadores",
      url: "/home/trackers",
    },
    {
      title: "Historial",
      url: "/home/history",
    },
  ],
  navSecondary: [
    {
      title: "Configuracion",
      url: "settings",
      icon: <Settings />,
    },
  ],
  adminNav: [
    {
      title: "Panel de Admin",
      url: "/home/admin",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore((state) => state.user);
  const location = useLocation();
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
              <Link to="new-tracker" className="w-full">
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
                  <Link
                    to={item.url}
                    className={`font-medium ${
                      item.url === location.pathname ? "bg-primary/30" : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {user.role === "admin" &&
              data.adminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`font-medium ${
                        item.url === location.pathname ? "bg-primary/30" : ""
                      }`}
                    >
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarGroup>
        <SidebarFooter>
          <NavUser user={{ ...user, avatar: "" }} />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
