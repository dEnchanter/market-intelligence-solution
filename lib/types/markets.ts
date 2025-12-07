// Location coordinates
export interface Location {
  latitude: number;
  longitude: number;
}

// Added by user
export interface AddedBy {
  id: string;
  name: string;
}

// Market
export interface Market {
  id: string;
  name: string;
  district_id: string;
  location: Location;
  type: string;
  added_by?: AddedBy;
  town: string;
  lga: string;
  is_active: boolean;
  created_at: string;
}

// Create market request
export interface CreateMarketRequest {
  district_id: string;
  lga: string;
  location: Location;
  name: string;
  town: string;
  type: string;
}

// Update market request
export interface UpdateMarketRequest {
  name: string;
  town: string;
  type: string;
}

// Update market status request
export interface UpdateMarketStatusRequest {
  is_active: boolean;
}

// Nearby markets filters
export interface NearbyMarketsFilters {
  lat: number;
  lng: number;
  distance: number;
}

// Generic API response
export interface MarketApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Response types
export type CreateMarketResponse = MarketApiResponse<Market>;
export type UpdateMarketResponse = MarketApiResponse<Market>;
export type UpdateMarketStatusResponse = MarketApiResponse<Market>;
export type GetNearbyMarketsResponse = MarketApiResponse<Market[]>;
export type GetMarketsResponse = MarketApiResponse<Market[]>;
