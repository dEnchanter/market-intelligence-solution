// Stats summary data structure
export interface StatsSummaryData {
  total_districts: number;
  total_markets: number;
  total_item_groups: number;
  total_items: number;
  total_households: number;
  total_field_role_users: number;
  total_household_items: number;
}

// Generic API response
export interface StatsApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Response types
export type GetStatsSummaryResponse = StatsApiResponse<StatsSummaryData>;
