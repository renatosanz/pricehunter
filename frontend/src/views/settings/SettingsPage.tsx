import ContentLayout from "@/layouts/ContentLayout";
import { useUserStore } from "@/stores/user-store";
import UserData from "./UserData";

export default function SettingsPage() {
  const { user } = useUserStore();

  return (
    <ContentLayout title="Configuración">
      <h1 className="text-xlscroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
        Configuración
      </h1>
      <UserData user={user} />
      <div className="bg-muted/50 flex-3 rounded-xl min-h-min p-4"></div>
    </ContentLayout>
  );
}
