import ContentLayout from "@/layouts/ContentLayout";
import { useEffect, useState } from "react";
import type { Tracker } from "../trackers/allTrackers/columns";
import { getHistory } from "@/services/tracker-service";
import { ArrowUpLeftSquare, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const [history, sethistory] = useState<Tracker[]>();
  useEffect(() => {
    getHistory().then((res) => sethistory(res?.trackers));
  }, [sethistory]);

  return (
    <ContentLayout title="Historial">
      <h1 className="text-xlscroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
        Historial
      </h1>
      <div className="bg-muted/50 gap-3 grid grid-cols-1 lg:grid-cols-3 xl:md:grid-cols-4 p-3 rounded-xl md:min-h-min">
        {history?.map((t) => (
          <HistoryItemCard key={t.id} tracker={t} />
        ))}
      </div>
    </ContentLayout>
  );
}

function HistoryItemCard({ tracker }: { tracker: Tracker }) {
  const minToLabel = (minutes: number) => {
    switch (minutes) {
      case 30:
        return "Cada 30 min";
      case 60:
        return "Cada 1 hr";
      case 180:
        return "Cada 2 hr";
      case 300:
        return "Cada 5 hr";
      case 1440:
        return "Cada 24 hr";
      default:
        break;
    }
  };
  return (
    <div className="bg-muted/80 w-full p-3 flex flex-row rounded-2xl gap-2 justify-between">
      <div className="flex flex-col gap-2">
        <h3 className="overflow-hidden text-ellipsis">{tracker.name}</h3>
        <p className="text-sm bg-ring rounded-xl px-2 max-w-fit">
          $ {tracker.target_price} MXM
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm bg-ring rounded-xl px-2 max-w-fit">
          {minToLabel(tracker.traceInterval)}
        </p>
        <div className="w-full flex gap-2 justify-end ">
          <a href={tracker.link} target="_blank">
            <Button size={"sm"}>
              <Link />
            </Button>
          </a>
          <Button className="bg-green-500 hover:bg-green-600" size={"sm"}>
            <ArrowUpLeftSquare />
          </Button>
        </div>
      </div>
    </div>
  );
}
