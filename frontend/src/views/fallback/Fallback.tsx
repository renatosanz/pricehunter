import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export default function FallbackPage() {
  return (
    <div className="w-[100dvw] h-[100dvh] flex items-center gap-4">
      <div className="m-auto">
        <Spinner className="size-8" />
      </div>
    </div>
  );
}
