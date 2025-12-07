// Generic API response
export interface StatsApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Response types
export type GetStatsSummaryResponse = StatsApiResponse<any>; // Summary structure not specified
