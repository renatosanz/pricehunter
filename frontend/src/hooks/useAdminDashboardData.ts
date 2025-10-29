import {
  getAdminDashboardData,
  type AdminDashboardData,
} from "@/services/admin-service";
import { useEffect, useState } from "react";

export default function useAdminDashboardData() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = () => {
    setIsLoading(true);
    getAdminDashboardData()
      .then((data) => {
        setDashboardData(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    refreshData();
  }, []);
  return { dashboardData, refreshData, isLoading };
}
