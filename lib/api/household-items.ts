import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  GetHouseholdItemsResponse,
  CreateHouseholdItemRequest,
  CreateHouseholdItemResponse,
  UpdateHouseholdItemRequest,
  UpdateHouseholdItemResponse,
  DeleteHouseholdItemResponse,
} from "../types/household-items";

export const householdItemsApi = {
  // Get all household items
  getAll: async (): Promise<GetHouseholdItemsResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLD_ITEMS.BASE),
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch household items");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Create household item
  create: async (
    payload: CreateHouseholdItemRequest
  ): Promise<CreateHouseholdItemResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLD_ITEMS.CREATE),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Create failed");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Update household item
  update: async (
    id: string,
    payload: UpdateHouseholdItemRequest
  ): Promise<UpdateHouseholdItemResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLD_ITEMS.UPDATE(id)),
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Delete household item
  delete: async (id: string): Promise<DeleteHouseholdItemResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLD_ITEMS.DELETE(id)),
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
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
