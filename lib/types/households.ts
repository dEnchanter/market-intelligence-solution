// Location coordinates (reusing from household-expenditures)
export interface Location {
  latitude: number;
  longitude: number;
}

// Added by user
export interface AddedBy {
  id: string;
  name: string;
}

// Household
export interface Household {
  id: string;
  household_name: string;
  contact_name: string;
  contact_phone: string;
  town: string;
  lga: string;
  district_id: string;
  location: Location;
  address: string;
  added_by?: AddedBy;
  created_at: string;
}

// Create household request
export interface CreateHouseholdRequest {
  address: string;
  contact_name: string;
  contact_phone: string;
  district_id: string;
  household_name: string;
  lga: string;
  location: Location;
  town: string;
}

// Nearby households filters
export interface NearbyHouseholdsFilters {
  lat: number;
  lng: number;
  distance: number;
}

// Generic API response
export interface HouseholdApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Update household request
export interface UpdateHouseholdRequest {
  contact_name?: string;
  contact_phone?: string;
  household_name?: string;
  town?: string;
}

// Response types
export type CreateHouseholdResponse = HouseholdApiResponse<Household>;
export type GetHouseholdsResponse = HouseholdApiResponse<Household[]>;
export type GetNearbyHouseholdsResponse = HouseholdApiResponse<Household[]>;
export type UpdateHouseholdResponse = HouseholdApiResponse<Household>;
