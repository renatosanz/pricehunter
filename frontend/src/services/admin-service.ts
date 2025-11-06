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
  role: "user" | "admin";
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

interface NewUserByAdmin {
  success: boolean;
  message?: string;
}

export const createUser = (userdata: {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_validate: string;
  role: string;
}) => {
  return axios
    .post<NewUserByAdmin>(
      `${environment.url_api}/admin/create-user`,
      { ...userdata },
      {
        withCredentials: true,
      }
    )
    .then((res): NewUserByAdmin => {
      return res.data;
    })
    .catch((err) => {
      console.log("Error al crear usuario por admin.", err);
      return;
    });
};

interface DeleteUserData {
  success: boolean;
  message?: string;
}

export const deleteUser = (id: number) => {
  return axios
    .delete<DeleteUserData>(`${environment.url_api}/admin/delete-user/${id}`, {
      withCredentials: true,
    })
    .then((res): DeleteUserData => {
      return res.data;
    })
    .catch((err) => {
      console.log("Error al eliminiar usuario por admin.", err);
      return;
    });
};

interface EditUserResponse {
  success: boolean;
  message?: string;
  update: {
    name: string;
    role: "admin" | "user";
    phone: string;
    email: string;
  };
}

export const editUser = (
  userdata: {
    name: string;
    role: string;
    phone: string;
    email: string;
  },
  id: number
) => {
  const { name, email, phone, role } = userdata;
  return axios
    .patch<EditUserResponse>(
      `${environment.url_api}/admin/edit-user/${id}`,
      {
        name,
        email,
        phone,
        role,
      },
      {
        withCredentials: true,
      }
    )
    .then((res): EditUserResponse => {
      return res.data;
    })
    .catch((err) => {
      console.log("Error al editar usuario por admin.", err);
      return;
    });
};
