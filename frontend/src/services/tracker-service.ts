import { environment } from "@/env";
import type {
  PriceHistory,
  Tracker,
} from "@/views/trackers/allTrackers/columns";
import axios from "axios";

interface NewTracker {
  name: string;
  link: string;
  traceInterval: number;
  sms_enabled: boolean;
  email_enabled: boolean;
  target_price: number;
}

export const createNewTracker = async (
  newTrackerData: NewTracker
): Promise<
  | {
      success: boolean;
      tracker: Tracker;
      message?: string;
    }
  | undefined
> => {
  try {
    const response = await axios.post(
      `${environment.url_api}/tracker`,
      newTrackerData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al crear el rastreador.");
    return undefined;
  }
};

export const getAllTrackers = async (): Promise<
  { trackers: Tracker[]; success: boolean; message?: string } | undefined
> => {
  try {
    const response = await axios.get(`${environment.url_api}/tracker/all`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los rastreadores.");
    return undefined;
  }
};

export const getTrackerDetails = async (
  id: number
): Promise<
  | {
      tracker: Tracker;
      price_history: PriceHistory;
      message?: string;
      success: boolean;
    }
  | undefined
> => {
  try {
    const response = await axios.get(`${environment.url_api}/tracker/${id}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener detalles del rastreador.");
    return undefined;
  }
};

export const deleteTracker = async (
  id: number
): Promise<{ message?: string; success: boolean } | undefined> => {
  try {
    const response = await axios.delete(
      `${environment.url_api}/tracker/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar rastreador.");
    return undefined;
  }
};

export const getHistory = async (): Promise<
  { message?: string; success: boolean; trackers: Tracker[] } | undefined
> => {
  try {
    const response = await axios.get(`${environment.url_api}/tracker/history`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el historial de rastreadores.");
    return undefined;
  }
};

export interface RestoreTracker {
  success: boolean;
  message?: string;
}

export const restoreTrackerByID = (
  id: number
): Promise<RestoreTracker | undefined> => {
  return axios
    .post<RestoreTracker>(
      `${environment.url_api}/tracker/restore`,
      { id },
      {
        withCredentials: true,
      }
    )
    .then((res): RestoreTracker => res.data)
    .catch(() => {
      console.log("Error al obtener datos de dashboard.");
      return undefined;
    });
};

export interface EditTrackerResponse {
  success: boolean;
  message?: string;
  update: {
    email_enabled: boolean;
    sms_enabled: boolean;
    name: string;
    traceInterval: number;
    target_price: number;
  };
}

export const patchEditTracker = (
  newtrackerData: Tracker
): Promise<EditTrackerResponse | undefined> => {
  const { email_enabled, id, sms_enabled, name, traceInterval, target_price } =
    newtrackerData;
  return axios
    .patch<EditTrackerResponse>(
      `${environment.url_api}/tracker/${id}`,
      { email_enabled, sms_enabled, name, traceInterval, target_price },
      {
        withCredentials: true,
      }
    )
    .then((res): EditTrackerResponse => res.data)
    .catch(() => {
      console.log("Error al obtener datos de dashboard.");
      return undefined;
    });
};
