import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  CreateMarketRequest,
  CreateMarketResponse,
  UpdateMarketRequest,
  UpdateMarketResponse,
  UpdateMarketStatusRequest,
  UpdateMarketStatusResponse,
  NearbyMarketsFilters,
  GetNearbyMarketsResponse,
  GetMarketsResponse,
} from "../types/markets";

export const marketsApi = {
  // Create a market
  create: async (
    payload: CreateMarketRequest
  ): Promise<CreateMarketResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.MARKETS.BASE),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create market");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get all markets
  getAll: async (): Promise<GetMarketsResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.MARKETS.BASE),
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch markets");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get nearby markets
  getNearby: async (
    filters: NearbyMarketsFilters
  ): Promise<GetNearbyMarketsResponse> => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      queryParams.append("lat", filters.lat.toString());
      queryParams.append("lng", filters.lng.toString());
      queryParams.append("distance", filters.distance.toString());

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.MARKETS.NEARBY)}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch nearby markets");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Update market by ID
  update: async (
    id: string,
    payload: UpdateMarketRequest
  ): Promise<UpdateMarketResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.MARKETS.BY_ID(id)),
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update market");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Update market status
  updateStatus: async (
    id: string,
    payload: UpdateMarketStatusRequest
  ): Promise<UpdateMarketStatusResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.MARKETS.STATUS(id)),
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update market status");
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
