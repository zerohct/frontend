import { apiClient, handleApiError } from "./apiClientBase";
import {
  API_ENDPOINTS,
  generateDynamicEndpoint,
} from "../constants/apiEndpoints";

// Define the types for company data
export interface Company {
  companyId: number;
  name: string;
  description: string;
  image?: string;
}

export interface CompanyRequest {
  name: string;
  description: string;
  image?: File;
}

export const companyApi = {
  // Create a new company
  create: async (companyData: CompanyRequest): Promise<Company> => {
    try {
      // Create FormData object to handle multipart/form-data
      const formData = new FormData();
      Object.entries(companyData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await apiClient.post(
        API_ENDPOINTS.COMPANY.CREATE,
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

  // Get all companies
  getAll: async (): Promise<Company[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COMPANY.GET_ALL);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get a company by ID
  getById: async (id: number): Promise<Company> => {
    try {
      const endpoint = generateDynamicEndpoint(
        API_ENDPOINTS.COMPANY.GET_ID,
        String(id)
      );
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update a company
  update: async (id: number, companyData: CompanyRequest): Promise<Company> => {
    try {
      // Create FormData for multipart/form-data handling
      const formData = new FormData();
      Object.entries(companyData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const endpoint = generateDynamicEndpoint(
        API_ENDPOINTS.COMPANY.UPDATE,
        String(id)
      );
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

  // Delete a company
  delete: async (id: number): Promise<void> => {
    try {
      const endpoint = generateDynamicEndpoint(
        API_ENDPOINTS.COMPANY.DELETE,
        String(id)
      );
      await apiClient.delete(endpoint);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
