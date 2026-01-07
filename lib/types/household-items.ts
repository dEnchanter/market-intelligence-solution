export interface HouseholdItem {
  id: string;
  group: string;
  item: string;
  created_at: string;
  updated_at: string;
  IsActive: boolean;
}

export interface GetHouseholdItemsResponse {
  data: HouseholdItem[];
  message: string;
  success: boolean;
}

export interface CreateHouseholdItemRequest {
  group: string;
  item: string;
}

export interface CreateHouseholdItemResponse {
  data: HouseholdItem;
  message: string;
  success: boolean;
}

export interface UpdateHouseholdItemRequest {
  group?: string;
  item?: string;
}

export interface UpdateHouseholdItemResponse {
  data: HouseholdItem;
  message: string;
  success: boolean;
}

export interface DeleteHouseholdItemResponse {
  data: string;
  message: string;
  success: boolean;
}
