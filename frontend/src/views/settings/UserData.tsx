import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserI } from "@/stores/user-store";
import { Pencil, Mail, Phone, User, Shield, Camera } from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";

export default function UserData({ user }: { user: UserI }) {
  const getRoleVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "moderator": return "default";
      default: return "secondary";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Administrador";
      case "moderator": return "Moderador";
      default: return "Usuario";
    }
  };

  return (
    <Card className="w-full w-full mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil de Usuario
          </span>
          {user.role !== "user" && (
            <Badge variant={getRoleVariant(user.role)} className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {getRoleLabel(user.role)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1"
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-background shadow-lg"
                alt={`Avatar de ${user.name}`}
              />
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <EditProfileModal user={user}>
              <Button className="gap-2 w-full">
                <Pencil className="h-4 w-4" />
                Editar Perfil
              </Button>
            </EditProfileModal>
          </div>

          {/* User Info Section */}
          <div className="flex-1 space-y-6">
            {/* Name Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Nombre Completo</h3>
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="text-lg font-semibold">{user.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Correo Electrónico
                </h3>
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-lg font-medium break-all">{user.email}</p>
                </div>
              </div>

              {/* Phone Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </h3>
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-lg font-medium">{user.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

