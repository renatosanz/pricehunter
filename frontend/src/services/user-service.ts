import { environment } from "@/env";
import type { UserI } from "@/stores/user-store";
import axios from "axios";
import Cookies from "js-cookie";

export const isUserLogged = () => {
  return Cookies.get("isLogged") ? true : false;
};

export async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await axios.post(
      `${environment.url_api}/user/login`,
      data,
      { withCredentials: true }
    );

    if (response.data.success) {
      Cookies.set("isLogged", "true");
    }

    // login efectivo o erroneo
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesion.");
    return false;
  }
}

export async function logoutUser(): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const response = await axios.get(`${environment.url_api}/user/logout`, {
      withCredentials: true,
    });

    if (response.data.success) {
      Cookies.remove("isLogged");
    }

    // logout efectivo o erroneo
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesion.");
    return { success: false };
  }
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(
      `${environment.url_api}/user/register`,
      data,
      { withCredentials: true }
    );

    // registro efectivo o erroneo
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesion.");
    return false;
  }
}

export const verifyUserSession = async (): Promise<
  | {
      success: boolean;
      user: UserI;
    }
  | undefined
> => {
  try {
    const response = await axios.get(`${environment.url_api}/user/session`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al verificar la sesion.");
    return undefined;
  }
};

export const updateUser = async (data: {
  name: string;
  phone: string;
  email: string;
}): Promise<
  | {
      success: boolean;
      user: UserI;
    }
  | undefined
> => {
  try {
    const response = await axios.patch(`${environment.url_api}/user/`, data, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error al verificar la sesion.");
    return undefined;
  }
};

export interface DashboardData {
  success: boolean;
  trackersCount: number;
  nofificationCount: number;
  latestTrackers: {
    name: string;
    id: number;
    createdAt: string;
  }[];
}

export const getDashboardData = (): Promise<DashboardData | undefined> => {
  return axios
    .get<DashboardData>(`${environment.url_api}/user/dashboard`, {
      withCredentials: true,
    })
    .then((res): DashboardData => res.data)
    .catch(() => {
      console.log("Error al obtener datos de dashboard.");
      return undefined;
    });
};
