import { getAllTrackers } from "@/services/tracker-service";
import type { Tracker } from "@/views/trackers/allTrackers/columns";
import { useEffect, useState } from "react";

/**
 * Hook para obtiener el listado de todos los trackers
 * @returns { Tracker[] }
 */
export default function useFetchAllTrackers(): {
  trackersData: Tracker[];
  fetchTrackerList: () => void;
} {
  const [trackersData, setTrackersData] = useState<Tracker[]>([]);
  const fetchTrackerList = () => {
    getAllTrackers().then((res) => {
      if (res?.success) {
        setTrackersData(res.trackers);
      }
    });
  };
  useEffect(() => {
    fetchTrackerList();
  }, []);
  return { trackersData, fetchTrackerList };
}
