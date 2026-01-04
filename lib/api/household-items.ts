import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  GetHouseholdItemsResponse,
  UpdateHouseholdItemRequest,
  UpdateHouseholdItemResponse,
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
};
