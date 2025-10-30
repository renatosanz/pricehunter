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
    .then((res): AdminDashboardData => res.data)
    .catch((err) => {
      console.log("Error al obtener datos de dashboard.", err);
      return undefined;
    });
};

export interface UserDataTable {
  success: boolean;
  users: User[];
  pagination: Pagination;
}

export interface User {
  id: number;
  role: string;
  name: string;
  email: string;
  phone: string;
  lastLogin: string;
  isLogged: boolean;
  isBanned: any;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const getUserDataTable = (
  page_size: number,
  page: number,
  searchTerm: string
) => {
  return axios
    .get<UserDataTable>(
      `${environment.url_api}/admin/users-data/?page_size=${page_size}&page=${page}&search=${searchTerm}`,
      {
        withCredentials: true,
      }
    )
    .then((res): UserDataTable => {
      return res.data;
    })
    .catch((err) => {
      console.log("Error al obtener tabla de usuarios.", err);
      return {
        success: true,
        users: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
          pageSize: 0,
        },
      };
    });
};
