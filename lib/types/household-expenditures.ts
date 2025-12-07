// Location coordinates
export interface Location {
  latitude: number;
  longitude: number;
}

// Nested household in expenditure response
export interface ExpenditureHousehold {
  id: string;
  household_name: string;
  contact_name: string;
  contact_phone: string;
  town: string;
  lga: string;
  district_id: string;
  location: Location;
  address: string;
  added_by: {
    id: string;
    name: string;
  };
  created_at: string;
}

// Nested item in expenditure response
export interface ExpenditureItem {
  id: string;
  group: string;
  item: string;
  created_at: string;
  updated_at: string;
}

// Added by user
export interface AddedBy {
  id: string;
  name: string;
}

// Household expenditure
export interface HouseholdExpenditure {
  id: string;
  household_id: string;
  household?: ExpenditureHousehold;
  item_id: string;
  item?: ExpenditureItem;
  month: number;
  year: number;
  amount: number;
  location: Location;
  added_by?: AddedBy;
  created_at: string;
}

// Create expenditure request
export interface CreateExpenditureRequest {
  amount: number;
  household_id: string;
  item_id: string;
  location: Location;
  month: number;
  year: number;
}

// List filters
export interface ExpenditureListFilters {
  household_id?: string;
  item_id?: string;
  month?: number;
  year?: number;
  district_id?: string;
  town?: string;
  added_by_id?: string;
}

// Stats filters
export interface ExpenditureStatsFilters {
  household_id?: string;
  month?: number;
  year?: number;
}

// Generic API response
export interface ExpenditureApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Response types
export type CreateExpenditureResponse = ExpenditureApiResponse<HouseholdExpenditure>;
export type GetExpenditureListResponse = ExpenditureApiResponse<HouseholdExpenditure[]>;
export type GetExpenditureStatsResponse = ExpenditureApiResponse<any>; // Stats structure not specified, using any
