import {
  getDashboardData,
  type DashboardDataResponse,
} from "@/services/user-service";
import { useEffect, useState } from "react";

export default function useFetchDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardDataResponse>();
  const [newWeekTrackers, setNewWeekTrackers] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getLastWeekTrackers = (
    latestTrackers: {
      name: string;
      id: number;
      createdAt: string;
    }[]
  ) => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    setNewWeekTrackers(
      latestTrackers.filter((e) => new Date(e.createdAt) >= lastWeek).length
    );
  };

  const refreshData = () => {
    setIsLoading(true);
    getDashboardData()
      .then((data) => {
        setDashboardData(data);
        if (data?.latestTrackers) {
          getLastWeekTrackers(data.latestTrackers);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    refreshData();
  }, []);
  return { dashboardData, newWeekTrackers, refreshData, isLoading };
}
