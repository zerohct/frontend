import { EventType } from "types/eventTypes";
import { API_ENDPOINTS, generateDynamicEndpoint } from "../constants/apiEndpoints";
import { ApiResponse } from "types/ApiResponse";
import apiClient from "./api";
import { handleApiResponse } from "constants/HandleResponse";

// Centralized error handling function
const handleApiError = (error: any): never => {
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "An unexpected error occurred";

  console.error("API Error Details:", {
    message: errorMessage,
    status: error.response?.status,
    data: error.response?.data,
  });

  throw new Error(errorMessage);
};

// Get all event types
export const getAllEventTypes = async (): Promise<ApiResponse<EventType[]>> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EVENT_TYPES.GET_ALL);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get event type by ID
export const getEventTypeById = async (id: string): Promise<ApiResponse<EventType>> => {
  try {
    const endpoint = generateDynamicEndpoint(API_ENDPOINTS.EVENT_TYPES.GET_ID, id);
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Create new event type
export const createEventType = async (name: string): Promise<ApiResponse<EventType>> => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.EVENT_TYPES.CREATE,
      { name },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return handleApiResponse(response.data);
  } catch (error) {
    return handleApiError(error);
  }
};

// Update event type
export const updateEventType = async (
  id: string,
  name: string
): Promise<ApiResponse<EventType>> => {
  try {
    const endpoint = generateDynamicEndpoint(API_ENDPOINTS.EVENT_TYPES.UPDATE, id);
    const response = await apiClient.post(
      endpoint,
      { name },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return handleApiResponse(response.data);
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete event type
export const deleteEventType = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const endpoint = generateDynamicEndpoint(API_ENDPOINTS.EVENT_TYPES.DELETE, id);
    const response = await apiClient.delete(endpoint);
    return handleApiResponse(response.data);
  } catch (error) {
    return handleApiError(error);
  }
};