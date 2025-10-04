import ContentLayout from "@/layouts/ContentLayout";
import { getTrackerDetails } from "@/services/tracker-service";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Tracker } from "../allTrackers/columns";
import { PriceTrackingChart } from "./PriceTrackingChart";

export default function DetailsTracker() {
  const { id } = useParams();
  const [details, setDetails] = useState<Tracker>();
  useEffect(() => {
    if (id) {
      getTrackerDetails(parseInt(id)).then((res) => {
        console.log("rastreador:", res);
        setDetails(res);
      });
    }
    return () => {};
  }, []);

  return (
    <ContentLayout title={"Detalles del Rastreador"}>
      <h2 className="text-xlscroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
        {details?.name}
      </h2>
      <div className="max-h-full overflow-y-scroll overflow-x-hidden w-full gap-4 flex flex-col-reverse lg:flex-row">
        <div className="min-w-[75%] gap-4 flex flex-col">
          <div className="bg-muted/50 min-h-[45dvh] w-full rounded-xl lg:flex-2 lg:h-full">
            <PriceTrackingChart />
          </div>
          <div className="bg-muted/50 min-h-[45dvh] w-full rounded-xl lg:flex-1 lg:h-full"></div>
        </div>
        <div className="bg-muted/50 w-full h-[45dvh] flex-1 rounded-xl lg:min-w-[25%] lg:h-full"></div>
      </div>
    </ContentLayout>
  );
}
