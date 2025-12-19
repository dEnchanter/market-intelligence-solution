import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  CreateExpenditureRequest,
  CreateExpenditureResponse,
  UpdateExpenditureRequest,
  UpdateExpenditureResponse,
  ExpenditureListFilters,
  GetExpenditureListResponse,
  ExpenditureStatsFilters,
  GetExpenditureStatsResponse,
} from "../types/household-expenditures";

export const householdExpendituresApi = {
  // Get list of household expenditures with optional filters
  getList: async (
    filters?: ExpenditureListFilters
  ): Promise<GetExpenditureListResponse> => {
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

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLD_EXPENDITURES.BASE)}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch expenditures");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Create a household expenditure
  create: async (
    payload: CreateExpenditureRequest
  ): Promise<CreateExpenditureResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLD_EXPENDITURES.BASE),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create expenditure");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get expenditure stats with optional filters
  getStats: async (
    filters?: ExpenditureStatsFilters
  ): Promise<GetExpenditureStatsResponse> => {
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

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLD_EXPENDITURES.STATS)}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch expenditure stats");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Update expenditure price
  update: async (
    id: string,
    payload: UpdateExpenditureRequest
  ): Promise<UpdateExpenditureResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.HOUSEHOLD_EXPENDITURES.UPDATE_PRICE(id)),
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update expenditure");
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
