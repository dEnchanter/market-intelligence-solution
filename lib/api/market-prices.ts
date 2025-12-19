import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  CreateMarketPriceRequest,
  CreateMarketPriceResponse,
  UpdateMarketPriceRequest,
  UpdateMarketPriceResponse,
  MarketPriceStatsFilters,
  GetMarketPriceStatsResponse,
  MarketPriceListFilters,
  GetMarketPriceListResponse,
} from "../types/market-prices";

export const marketPricesApi = {
  // Create a market price entry
  create: async (
    payload: CreateMarketPriceRequest
  ): Promise<CreateMarketPriceResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.MARKET_PRICES.BASE),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create market price");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Update a market price entry
  update: async (
    id: string,
    payload: UpdateMarketPriceRequest
  ): Promise<UpdateMarketPriceResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.MARKET_PRICES.UPDATE_PRICE(id)),
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update market price");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get market price stats with optional filters
  getStats: async (
    filters?: MarketPriceStatsFilters
  ): Promise<GetMarketPriceStatsResponse> => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.MARKET_PRICES.STATS)}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch market price stats");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get market price list with optional filters
  getList: async (
    filters?: MarketPriceListFilters
  ): Promise<GetMarketPriceListResponse> => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.MARKET_PRICES.BASE)}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch market prices");
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
