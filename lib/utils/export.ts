import { Household } from "../types/households";
import { HouseholdExpenditure } from "../types/household-expenditures";
import { HouseholdItem } from "../types/household-items";
import { MarketPrice } from "../types/market-prices";
import { Market } from "../types/markets";

/**
 * Convert households data to CSV format
 */
export function convertHouseholdsToCSV(households: Household[]): string {
  if (households.length === 0) {
    return "";
  }

  // CSV Headers
  const headers = [
    "Household Name",
    "Contact Name",
    "Contact Phone",
    "LGA",
    "Town",
    "Address",
    "District ID",
    "Latitude",
    "Longitude",
    "Added By",
    "Created At",
  ];

  // CSV Rows
  const rows = households.map((household) => [
    household.household_name,
    household.contact_name,
    household.contact_phone,
    household.lga,
    household.town,
    household.address,
    household.district_id,
    household.location.latitude.toString(),
    household.location.longitude.toString(),
    household.added_by?.name || "",
    new Date(household.created_at).toLocaleString(),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return csvContent;
}

/**
 * Convert household expenditures data to CSV format
 */
export function convertExpendituresToCSV(
  expenditures: HouseholdExpenditure[]
): string {
  if (expenditures.length === 0) {
    return "";
  }

  // CSV Headers
  const headers = [
    "Household Name",
    "Contact Name",
    "Item Name",
    "Item Group",
    "Amount",
    "Month",
    "Year",
    "Town",
    "LGA",
    "Latitude",
    "Longitude",
    "Added By",
    "Created At",
  ];

  // CSV Rows
  const rows = expenditures.map((exp) => [
    exp.household?.household_name || exp.household_id,
    exp.household?.contact_name || "",
    exp.item?.item || exp.item_id,
    exp.item?.group || "",
    exp.amount.toString(),
    exp.month.toString(),
    exp.year.toString(),
    exp.household?.town || "",
    exp.household?.lga || "",
    exp.location.latitude.toString(),
    exp.location.longitude.toString(),
    exp.added_by?.name || "",
    new Date(exp.created_at).toLocaleString(),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return csvContent;
}

/**
 * Download data as CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export households to CSV and trigger download
 */
export function exportHouseholdsToCSV(households: Household[]): void {
  const csv = convertHouseholdsToCSV(households);
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `households_${timestamp}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export household expenditures to CSV and trigger download
 */
export function exportExpendituresToCSV(
  expenditures: HouseholdExpenditure[]
): void {
  const csv = convertExpendituresToCSV(expenditures);
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `household_expenditures_${timestamp}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Convert market prices data to CSV format
 */
export function convertMarketPricesToCSV(prices: MarketPrice[]): string {
  if (prices.length === 0) {
    return "";
  }

  // CSV Headers
  const headers = [
    "Market Name",
    "Market Type",
    "Item Name",
    "Item Group",
    "Unit of Measure",
    "Price",
    "Month",
    "Year",
    "Capture Date",
    "Town",
    "LGA",
    "Latitude",
    "Longitude",
    "Added By",
    "Created At",
  ];

  // CSV Rows
  const rows = prices.map((price) => [
    price.market?.name || price.market_id,
    price.market?.type || "",
    price.item?.item || price.item_id,
    price.item?.group || "",
    price.item?.unit_of_measure || "",
    price.price.toString(),
    price.month.toString(),
    price.year.toString(),
    price.capture_date,
    price.market?.town || "",
    price.market?.lga || "",
    price.location.latitude.toString(),
    price.location.longitude.toString(),
    price.added_by?.name || "",
    new Date(price.created_at).toLocaleString(),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return csvContent;
}

/**
 * Export market prices to CSV and trigger download
 */
export function exportMarketPricesToCSV(prices: MarketPrice[]): void {
  const csv = convertMarketPricesToCSV(prices);
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `market_prices_${timestamp}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Convert markets data to CSV format
 */
export function convertMarketsToCSV(markets: Market[]): string {
  if (markets.length === 0) {
    return "";
  }

  // CSV Headers
  const headers = [
    "Market Name",
    "Type",
    "Town",
    "LGA",
    "District ID",
    "Latitude",
    "Longitude",
    "Status",
    "Added By",
    "Created At",
  ];

  // CSV Rows
  const rows = markets.map((market) => [
    market.name,
    market.type,
    market.town,
    market.lga,
    market.district_id,
    market.location.latitude.toString(),
    market.location.longitude.toString(),
    market.is_active ? "Active" : "Inactive",
    market.added_by?.name || "",
    new Date(market.created_at).toLocaleString(),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return csvContent;
}

/**
 * Export markets to CSV and trigger download
 */
export function exportMarketsToCSV(markets: Market[]): void {
  const csv = convertMarketsToCSV(markets);
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `markets_${timestamp}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Convert household items data to CSV format
 */
export function convertHouseholdItemsToCSV(items: HouseholdItem[]): string {
  if (items.length === 0) {
    return "";
  }

  // CSV Headers
  const headers = [
    "Item",
    "Description",
    "Group",
    "Class",
    "Subclass",
    "Durability",
    "Unit of Measure",
    "Created At",
    "Updated At",
  ];

  // CSV Rows
  const rows = items.map((item) => [
    item.item,
    item.description,
    item.group,
    item.class,
    item.subclass,
    item.durability,
    item.unit_of_measure,
    new Date(item.created_at).toLocaleString(),
    new Date(item.updated_at).toLocaleString(),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return csvContent;
}

/**
 * Export household items to CSV and trigger download
 */
export function exportHouseholdItemsToCSV(items: HouseholdItem[]): void {
  const csv = convertHouseholdItemsToCSV(items);
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `household_items_${timestamp}.csv`;
  downloadCSV(csv, filename);
}
