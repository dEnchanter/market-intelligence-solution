import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import { GetStatsSummaryResponse } from "../types/stats";

export const statsApi = {
  // Get stats summary
  getSummary: async (): Promise<GetStatsSummaryResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.STATS.SUMMARY),
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch stats summary");
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
