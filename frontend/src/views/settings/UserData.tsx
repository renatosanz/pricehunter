import { Button } from "@/components/ui/button";
import type { UserI } from "@/stores/user-store";
import { Pencil } from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";

export default function UserData({ user }: { user: UserI }) {
  return (
    <div className="bg-muted/50 flex-1 rounded-xl min-h-min p-4 gap-2 flex flex-col md:flex-row">
      <div className="p-4">
        <img
          src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/d9/fa/1b/lost-valley.jpg?w=1200&h=-1&s=1"
          className="m-auto w-[40vw] md:w-[15vw] rounded-xl aspect-square object-cover"
        />
      </div>
      <div className="my-auto text-center md:text-left">
        <DataLabel label="Nombre:" value={user.name} />
        <DataLabel label="Email:" value={user.email} />
        <DataLabel label="Telefono:" value={user.phone} />
        {user.role != "user" && <DataLabel label="Role:" value={user.role} />}
        <EditProfileModal user={user}>
          <Button size={"sm"} className="mt-2">
            Editar <Pencil />
          </Button>
        </EditProfileModal>
      </div>
    </div>
  );
}

function DataLabel({ label, value }: { label: string; value: string }) {
  return (
    <h3 className="scroll-m-20 text-xl tracking-tight">
      <span className="font-bold">{label}</span> {value}
    </h3>
  );
}
