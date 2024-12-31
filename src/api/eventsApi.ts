import { Event, EventType, Semester, AcademicYear } from "types/eventTypes";
import {
  API_ENDPOINTS,
  generateDynamicEndpoint,
} from "../constants/apiEndpoints";
import { ApiResponse } from "types/ApiResponse";
// Import the custom API client
import apiClient from "./api";
import { handleApiResponse } from "constants/HandleResponse";
import { showToast } from "utils/toast";

interface DropdownDataResponse {
  statusCode: number;
  message: string;
  data: {
    semesters: Semester[];
    academicYears: AcademicYear[];
    eventTypes: EventType[];
  };
}

// Centralized error handling function
const handleApiError = (error: any): never => {
  // Extract meaningful error message
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "An unexpected error occurred";

  // Log the full error for debugging
  console.error("API Error Details:", {
    message: errorMessage,
    status: error.response?.status,
    data: error.response?.data,
  });

  // Throw a standardized error
  throw new Error(errorMessage);
};

export const fetchDropdownData = async (): Promise<
  DropdownDataResponse["data"]
> => {
  try {
    const response = await apiClient.get<DropdownDataResponse>(
      API_ENDPOINTS.DROPDOWN.DROPDOWN,
    );
    const dropdownData = (
      response.data as { data: DropdownDataResponse["data"] }
    ).data;
    return dropdownData;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createEvent = async (
  eventData: Event & { event_type_id: string },
): Promise<ApiResponse<Event>> => {
  const formData = new FormData();

  // Append all event data fields to FormData
  Object.keys(eventData).forEach((key) => {
    const value = eventData[key as keyof Event];
    if (value !== null && value !== undefined) {
      // Special handling for base64 image
      if (key === "image") {
        console.log("Image base64 being appended:", value); // Add this log
        formData.append("image", eventData.image);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  try {
    const response = await apiClient.post(
      API_ENDPOINTS.EVENTS.CREATE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return handleApiResponse(response.data);
  } catch (error) {
    return handleApiError(error);
  }
};
export const getEvents = async (): Promise<ApiResponse<Event[]>> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EVENTS.GET_ALL);

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getEventById = async (id: string): Promise<ApiResponse<Event>> => {
  try {
    const endpoint = generateDynamicEndpoint(API_ENDPOINTS.EVENTS.GET_ID, id);
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateEvent = async (
  id: string,
  eventData: Event,
): Promise<ApiResponse<Event>> => {
  const formData = new FormData();

  // Append all event data fields to FormData
  Object.keys(eventData).forEach((key) => {
    const value = eventData[key as keyof Event];
    if (value !== null && value !== undefined) {
      // Xử lý riêng trường hợp 'image'
      if (key === "image") {
        if (typeof eventData.image === "string" && eventData.image.startsWith("data:")) {
          // Nếu là base64
          formData.append("image", eventData.image);
        } else if (eventData.image as any instanceof File) {
          // Nếu là file
          formData.append("image", eventData.image);
        } else {
          console.warn("Image format is not valid");
        }
      } else {
        // Xử lý các trường khác
        formData.append(key, String(value));
      }
    }
  });

  try {
    const endpoint = generateDynamicEndpoint(API_ENDPOINTS.EVENTS.UPDATE, id);
    const response = await apiClient.post(
      endpoint,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return handleApiResponse(response.data);
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteEvent = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const endpoint = generateDynamicEndpoint(API_ENDPOINTS.EVENTS.DELETE, id);
    const response = await apiClient.delete(endpoint);
    return handleApiResponse(response.data);
  } catch (error) {
    return handleApiError(error);
  }
};

export const toggleRegistration = async (
  event_id: string,
): Promise<ApiResponse<{ is_registered: boolean }>> => {
  try {
    const response = await apiClient.post(
      `${API_ENDPOINTS.EVENTS.TOGGLE_REGISTRATION}?event_id=${event_id}`,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAllRegistrations = async (): Promise<ApiResponse<Event[]>> => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.EVENTS.GET_ALL_REGISTRATION,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAllRegistrationUsers = async (
  eventId: string,
): Promise<ApiResponse<Event[]>> => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.EVENTS.REGISTRATION_USER}?eventId=${eventId}`,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Thêm hàm getRegistrationStatus
export const getRegistrationStatus = async (
  event_id: string,
): Promise<ApiResponse<{ is_registered: boolean }>> => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.EVENTS.REGISTRATION_STATUS}?eventId=${event_id}`,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
export const uploadEventImage = async (
  file: File,
): Promise<{ data: { base64Image: string } }> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await apiClient.post(
      API_ENDPOINTS.EVENTS.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    // Log để kiểm tra phản hồi từ API
    console.log("Upload Image Response:", response);

    // Đảm bảo dữ liệu trả về từ API có chứa base64Image
    return response.data; // Phản hồi sẽ chứa { base64Image: "..." }
  } catch (error) {
    console.error("Image upload failed", error);
    throw new Error("Tải ảnh thất bại");
  }
};
