import { getAllTrackers } from "@/services/tracker-service";
import type { Tracker } from "@/views/trackers/allTrackers/columns";
import { useEffect, useState } from "react";

/**
 * Hook para obtiener el listado de todos los trackers
 * @returns { Tracker[] | undefined }
 */
export default function useFetchAllTrackers(): Tracker[] | undefined {
  const [trackersData, setTrackersData] = useState<Tracker[] | undefined>([]);
  useEffect(() => {
    getAllTrackers().then((res) => {
      if (res?.success) {
        setTrackersData(res.trackers);
      } else {
        setTrackersData(undefined);
      }
    });
  }, []);
  return trackersData;
}
