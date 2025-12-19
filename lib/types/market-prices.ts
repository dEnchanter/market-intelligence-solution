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

// Consumption item details
export interface PriceItem {
  id: string;
  group: string;
  class: string;
  subclass: string;
  item: string;
  description: string;
  durability: string;
  unit_of_measure: string;
  created_at: string;
  updated_at: string;
}

// Market details
export interface PriceMarket {
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

// Market price
export interface MarketPrice {
  id: string;
  item_id: string;
  item?: PriceItem;
  market_id: string;
  market?: PriceMarket;
  month: number;
  year: number;
  capture_date: string;
  location: Location;
  added_by?: AddedBy;
  price: number;
  created_at: string;
}

// Create market price request
export interface CreateMarketPriceRequest {
  capture_date: string;
  item_id: string;
  location: Location;
  market_id: string;
  month: number;
  price: number;
  year: number;
}

// Update market price request
export interface UpdateMarketPriceRequest {
  price: number;
  volume: number;
}

// Market price stats filters
export interface MarketPriceStatsFilters {
  market_id?: string;
  month?: number;
  year?: number;
}

// Market price list filters
export interface MarketPriceListFilters {
  market_id?: string;
  item_id?: string;
  month?: number;
  year?: number;
}

// Generic API response
export interface MarketPriceApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Response types
export type CreateMarketPriceResponse = MarketPriceApiResponse<MarketPrice>;
export type UpdateMarketPriceResponse = MarketPriceApiResponse<MarketPrice>;
export type GetMarketPriceStatsResponse = MarketPriceApiResponse<any>; // Stats structure not specified
export type GetMarketPriceListResponse = MarketPriceApiResponse<MarketPrice[]>;
