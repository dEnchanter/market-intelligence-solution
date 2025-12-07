export interface HouseholdItem {
  id: string;
  item: string;
  description: string;
  group: string;
  class: string;
  subclass: string;
  durability: string;
  unit_of_measure: string;
  created_at: string;
  updated_at: string;
}

export interface GetHouseholdItemsResponse {
  data: HouseholdItem[];
  message: string;
  success: boolean;
}
