import { environment } from "@/env";
import axios from "axios";

export interface AdminDashboardData {
  success: boolean;
  usersCount: number;
  adminsCount: number;
  bannedUsers: number;
  activeUsers: number;
}

export const getAdminDashboardData = (): Promise<
  AdminDashboardData | undefined
> => {
  return axios
    .get<AdminDashboardData>(`${environment.url_api}/admin/dashboard`, {
      withCredentials: true,
    })
    .then((res): AdminDashboardData => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log("Error al obtener datos de dashboard.", err);
      return undefined;
    });
};
