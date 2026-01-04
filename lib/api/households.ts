import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  CreateHouseholdRequest,
  CreateHouseholdResponse,
  GetHouseholdsResponse,
  NearbyHouseholdsFilters,
  GetNearbyHouseholdsResponse,
  UpdateHouseholdRequest,
  UpdateHouseholdResponse,
} from "../types/households";

export const householdsApi = {
  // Get all households
  getAll: async (): Promise<GetHouseholdsResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLDS.BASE),
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch households");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Create a household
  create: async (
    payload: CreateHouseholdRequest
  ): Promise<CreateHouseholdResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLDS.BASE),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create household");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get nearby households
  getNearby: async (
    filters: NearbyHouseholdsFilters
  ): Promise<GetNearbyHouseholdsResponse> => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      queryParams.append("lat", filters.lat.toString());
      queryParams.append("lng", filters.lng.toString());
      queryParams.append("distance", filters.distance.toString());

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLDS.NEARBY)}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch nearby households");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Update household
  update: async (
    id: string,
    payload: UpdateHouseholdRequest
  ): Promise<UpdateHouseholdResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLDS.UPDATE(id)),
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
