import { environment } from "@/env";
import type { Tracker } from "@/views/trackers/allTrackers/columns";
import axios from "axios";

export const createNewTracker = async (newTrackerData: {
  name: string;
  link: string;
  traceInterval: number;
}): Promise<
  | {
      success: boolean;
      tracker: {
        name: string;
        id: number;
      };
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

export const getAllTrackers = async (): Promise<Tracker[] | undefined> => {
  try {
    const response = await axios.get(`${environment.url_api}/tracker/all`, {
      withCredentials: true,
    });

    if (!response.data.success) {
      return undefined;
    }
    return response.data.trackers;
  } catch (error) {
    console.error("Error al obtener todos los rastreadores.");
    return undefined;
  }
};

export const getTrackerDetails = async (
  id: number
): Promise<{ tracker: Tracker; success: boolean } | undefined> => {
  try {
    const response = await axios.get(`${environment.url_api}/tracker/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los rastreadores.");
    return undefined;
  }
};
