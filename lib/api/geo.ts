import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  GeoUploadRequest,
  GetLGAsResponse,
  GetStatesResponse,
  UploadGeoDataResponse,
} from "../types/geo";

export const geoApi = {
  // Get LGAs for a specific district
  getDistrictLGAs: async (districtId: string): Promise<GetLGAsResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.GEO.DISTRICT_LGAS(districtId)),
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch LGAs");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Get all states
  getStates: async (): Promise<GetStatesResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.GEO.STATES),
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch states");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Upload geo data (states, districts, LGAs)
  uploadGeoData: async (
    payload: GeoUploadRequest
  ): Promise<UploadGeoDataResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.GEO.UPLOAD),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload geo data");
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
