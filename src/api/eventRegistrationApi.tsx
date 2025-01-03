import { apiClient, handleApiError } from "./apiClientBase";
import {
  API_ENDPOINTS,
  generateDynamicEndpoint,
} from "../constants/apiEndpoints";

export interface EventRegistrationResponse {
  registrationId: number;
  eventId: number;
  eventTitle: string;
  userId: number;
  registrationDate: string;
}

export const eventRegistrationApi = {
  // Lấy tất cả đăng ký sự kiện
  getAll: async (): Promise<EventRegistrationResponse[]> => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.EVENT_REGISTRATION.GET_ALL
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Lấy danh sách đăng ký theo event ID
  getByEventId: async (
    eventId: string
  ): Promise<EventRegistrationResponse[]> => {
    try {
      const endpoint = generateDynamicEndpoint(
        API_ENDPOINTS.EVENT_REGISTRATION.GET_BY_EVENT,
        eventId
      );
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Toggle đăng ký sự kiện (đăng ký/hủy đăng ký)
  toggleRegistration: async (eventId: string): Promise<string> => {
    try {
      const endpoint = generateDynamicEndpoint(
        API_ENDPOINTS.EVENT_REGISTRATION.GET_ALL,
        eventId
      );
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
