import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  MarketHouseholdReportFilters,
  MyMarketHouseholdReportFilters,
  GetMarketHouseholdReportResponse,
  GetMyMarketHouseholdReportResponse,
} from "../types/reporting";

export const reportingApi = {
  // Get market household report with filters
  getMarketHouseholdReport: async (
    filters: MarketHouseholdReportFilters
  ): Promise<GetMarketHouseholdReportResponse> => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();

      if (filters.added_by_id) {
        queryParams.append("added_by_id", filters.added_by_id);
      }

      if (filters.month !== undefined) {
        queryParams.append("month", filters.month.toString());
      }

      if (filters.year !== undefined) {
        queryParams.append("year", filters.year.toString());
      }

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.REPORTING.MARKET_HOUSEHOLD)}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch market household report"
        );
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get my market household report with optional filters
  getMyMarketHouseholdReport: async (
    filters?: MyMarketHouseholdReportFilters
  ): Promise<GetMyMarketHouseholdReportResponse> => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();

      if (filters) {
        if (filters.month !== undefined) {
          queryParams.append("month", filters.month.toString());
        }

        if (filters.year !== undefined) {
          queryParams.append("year", filters.year.toString());
        }
      }

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.REPORTING.MY_MARKET_HOUSEHOLD)}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch my market household report"
        );
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
