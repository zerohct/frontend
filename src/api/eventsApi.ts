// api/eventsApi.ts
import { apiClient, handleApiError } from "./apiClientBase";
import {
  API_ENDPOINTS,
  generateDynamicEndpoint,
} from "../constants/apiEndpoints";
import { Event, EventRequest } from "types/eventTypes";

export const eventApi = {
  create: async (eventData: EventRequest): Promise<Event> => {
    try {
      const formData = new FormData();
      Object.entries(eventData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await apiClient.post(
        API_ENDPOINTS.EVENTS.CREATE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAll: async (): Promise<Event[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EVENTS.GET_ALL);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getById: async (id: string): Promise<Event> => {
    try {
      const endpoint = generateDynamicEndpoint(API_ENDPOINTS.EVENTS.GET_ID, id);
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  update: async (id: string, eventData: EventRequest): Promise<Event> => {
    try {
      const formData = new FormData();
      Object.entries(eventData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      const endpoint = generateDynamicEndpoint(API_ENDPOINTS.EVENTS.UPDATE, id);
      const response = await apiClient.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const endpoint = generateDynamicEndpoint(API_ENDPOINTS.EVENTS.DELETE, id);
      await apiClient.delete(endpoint);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
