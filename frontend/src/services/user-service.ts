import { environment } from "@/env";
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
      user: { name: string; email: string };
    }
  | undefined
> => {
  try {
    const response = await axios.get(`${environment.url_api}/user/session`, {
      withCredentials: true,
    });

    if (response.data.success) {
      Cookies.set("isLogged", "true");
    } else {
      Cookies.remove("isLogged");
    }

    return response.data;
  } catch (error) {
    console.error("Error al verificar la sesion.");
    return undefined;
  }
};