export interface HouseholdItem {
  id: string;
  group: string;
  item: string;
  created_at: string;
  updated_at: string;
}

export interface GetHouseholdItemsResponse {
  data: HouseholdItem[];
  message: string;
  success: boolean;
}
