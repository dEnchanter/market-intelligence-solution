// Market household report filters
export interface MarketHouseholdReportFilters {
  added_by_id?: string;
  month?: number;
  year?: number;
}

// My market household report filters
export interface MyMarketHouseholdReportFilters {
  month?: number;
  year?: number;
}

// Generic API response
export interface ReportingApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Response types
export type GetMarketHouseholdReportResponse = ReportingApiResponse<any>; // Report structure not specified
export type GetMyMarketHouseholdReportResponse = ReportingApiResponse<any>; // Report structure not specified
