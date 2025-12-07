import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  CreateDistrictRequest,
  UpdateDistrictRequest,
  District,
  ApiResponse,
} from "../types/districts";

export const districtsApi = {
  // Create a new district
  create: async (
    payload: CreateDistrictRequest
  ): Promise<ApiResponse<District>> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.DISTRICTS.BASE),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create district");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get all districts
  getAll: async (): Promise<ApiResponse<District[]>> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.DISTRICTS.BASE),
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch districts");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get district by ID
  getById: async (id: string): Promise<ApiResponse<District>> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.DISTRICTS.BY_ID(id)),
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch district");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Update district by ID
  update: async (
    id: string,
    payload: UpdateDistrictRequest
  ): Promise<ApiResponse<District>> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.DISTRICTS.BY_ID(id)),
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update district");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },
};
