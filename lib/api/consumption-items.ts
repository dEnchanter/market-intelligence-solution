import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  ImportConsumptionItemsRequest,
  ImportConsumptionItemsResponse,
  GetConsumptionItemsResponse,
  ConsumptionItemsFilters,
  UpdateConsumptionItemRequest,
  UpdateConsumptionItemResponse,
} from "../types/consumption-items";

export const consumptionItemsApi = {
  // Import consumption items
  import: async (
    payload: ImportConsumptionItemsRequest
  ): Promise<ImportConsumptionItemsResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.CONSUMPTION_ITEMS.IMPORT),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Import failed");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get consumption items with filters
  getItems: async (
    filters?: ConsumptionItemsFilters
  ): Promise<GetConsumptionItemsResponse> => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value);
          }
        });
      }

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.CONSUMPTION_ITEMS.LIST)}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch consumption items");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Update consumption item
  update: async (
    id: string,
    payload: UpdateConsumptionItemRequest
  ): Promise<UpdateConsumptionItemResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.CONSUMPTION_ITEMS.UPDATE(id)),
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
