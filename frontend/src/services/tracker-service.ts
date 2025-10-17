import { environment } from "@/env";
import type { Tracker } from "@/views/trackers/allTrackers/columns";
import axios from "axios";

export const createNewTracker = async (newTrackerData: {
  name: string;
  link: string;
  traceInterval: number;
  sms_enabled: boolean;
  email_enabled: boolean;
}): Promise<
  | {
      success: boolean;
      tracker: Tracker;
      message?: string;
    }
  | undefined
> => {
  try {
    const response = await axios.post(
      `${environment.url_api}/tracker/new`,
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
  { tracker: Tracker; message?: string; success: boolean } | undefined
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
