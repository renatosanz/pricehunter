import ContentLayout from "@/layouts/ContentLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateNewUserModal from "./CreateNewUserModal";
import AnalyticsBar from "./AnalyticsBar";
import UserManagementZone from "./UserManagementZone";


export default function AdminDashboardView() {
  return (
    <ContentLayout title="Panel de Administrador">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Usuarios
            </h1>
            <p className="text-muted-foreground">
              Administra y gestiona los usuarios del sistema
            </p>
          </div>
          <CreateNewUserModal>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Usuario
            </Button>
          </CreateNewUserModal>
        </div>

        <AnalyticsBar />
        <UserManagementZone />
      </div>
    </ContentLayout>
  );
}
