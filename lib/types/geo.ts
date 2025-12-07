// LGA (Local Government Area) type for geo endpoints
export interface GeoLGA {
  id: string;
  sd_id: string; // senatorial district ID
  state_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// District type for geo endpoints
export interface GeoDistrict {
  id: string;
  state_id: string;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
  lgas?: GeoLGA[];
}

// State type for geo endpoints
export interface GeoState {
  id: string;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
  districts: GeoDistrict[];
}

// Upload payload for geo data
export interface GeoUploadRequest {
  states: GeoState[];
}

// Generic API response
export interface GeoApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Response types for specific endpoints
export type GetLGAsResponse = GeoApiResponse<GeoLGA[]>;
export type GetStatesResponse = GeoApiResponse<GeoState[]>;
export type UploadGeoDataResponse = GeoApiResponse<string>;
