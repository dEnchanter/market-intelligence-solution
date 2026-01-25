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

// CPI Report request payload
export interface CPIReportRequest {
  base_month: number;
  base_year: number;
  month: number;
  year: number;
  scope: string;
  weight_scope: string;
  weight_year: number;
  state_id?: string;
  senatorial_district_id?: string;
}

// CPI Report market relative
export interface CPIMarketRelative {
  market_id: string;
  market_name: string;
  base_price: number;
  curr_price: number;
  relative: number;
}

// CPI Report item
export interface CPIReportItem {
  item_id: string;
  group: string;
  class: string;
  item: string;
  market_relatives: CPIMarketRelative[];
  jevons_item: number;
}

// CPI Report class
export interface CPIReportClass {
  group: string;
  class: string;
  class_weight: number;
  class_weight_frac: number;
  jevons_class: number;
}

// CPI Report group
export interface CPIReportGroup {
  group: string;
  group_weight: number;
  group_weight_frac: number;
  jevons_group: number;
  young_group: number;
  classes: CPIReportClass[] | null;
}

// CPI Report data
export interface CPIReportData {
  base_year: number;
  base_month: number;
  year: number;
  month: number;
  weight_year: number;
  weight_scope: string;
  scope: string;
  items: CPIReportItem[];
  groups: CPIReportGroup[];
  laspeyres: number;
  cpi: number;
}

// CPI Report response
export type GetCPIReportResponse = ReportingApiResponse<CPIReportData>;
