"use client";

import { useState, useMemo, Fragment } from "react";
import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { useGenerateCPIReport } from "@/hooks/use-reporting";
import { useStates } from "@/hooks/use-geo";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText, Download } from "lucide-react";
import {
  CPIReportData,
  CPIReportItem,
  CPIReportGroup,
  CPIMarketRelative,
} from "@/lib/types/reporting";

// Constants for weight configuration
const WEIGHT_SCOPE = "NATIONAL";
const WEIGHT_YEAR = 2025;

interface FormData {
  base_month: number;
  base_year: number;
  month: number;
  year: number;
  scope: string;
  state_id: string;
  senatorial_district_id: string;
}

export default function CPIReportPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [formData, setFormData] = useState<FormData>({
    base_month: 12,
    base_year: currentYear - 1,
    month: currentMonth,
    year: currentYear,
    scope: "ALL",
    state_id: "",
    senatorial_district_id: "",
  });

  const [reportData, setReportData] = useState<CPIReportData | null>(null);

  const { data: statesData } = useStates();
  const generateReport = useGenerateCPIReport();

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const scopeOptions = [
    { value: "ALL", label: "All" },
    { value: "STATE", label: "State" },
    { value: "SENATORIAL_DISTRICT", label: "Senatorial District" },
  ];

  // Get senatorial districts from selected state
  const selectedState = statesData?.data?.find((s) => s.id === formData.state_id);
  const senatorialDistricts = selectedState?.districts || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build payload based on scope
    const payload: any = {
      base_month: formData.base_month,
      base_year: formData.base_year,
      month: formData.month,
      year: formData.year,
      scope: formData.scope,
      weight_scope: WEIGHT_SCOPE,
      weight_year: WEIGHT_YEAR,
    };

    // Add location IDs based on scope
    if (formData.scope === "STATE" && formData.state_id) {
      payload.state_id = formData.state_id;
    } else if (formData.scope === "SENATORIAL_DISTRICT" && formData.senatorial_district_id) {
      payload.senatorial_district_id = formData.senatorial_district_id;
    }

    try {
      const result = await generateReport.mutateAsync(payload);
      setReportData(result.data);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleScopeChange = (value: string) => {
    setFormData({
      ...formData,
      scope: value,
      // Reset location fields when scope changes
      state_id: value === "ALL" ? "" : formData.state_id,
      senatorial_district_id: value !== "SENATORIAL_DISTRICT" ? "" : formData.senatorial_district_id,
    });
  };

  const handleStateChange = (value: string) => {
    setFormData({
      ...formData,
      state_id: value === "none" ? "" : value,
      senatorial_district_id: "", // Reset senatorial district when state changes
    });
  };

  // Get unique markets from all items
  const uniqueMarkets = useMemo(() => {
    if (!reportData?.items?.length) return [];
    const marketMap = new Map<string, { id: string; name: string }>();
    reportData.items.forEach((item) => {
      item.market_relatives?.forEach((mr) => {
        if (!marketMap.has(mr.market_id)) {
          marketMap.set(mr.market_id, {
            id: mr.market_id,
            name: mr.market_name,
          });
        }
      });
    });
    return Array.from(marketMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [reportData]);

  // Get month name helper
  const getMonthName = (month: number): string => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month - 1] || "";
  };

  // Format number for display
  const formatNumber = (value: number | undefined, decimals: number = 2): string => {
    if (value === undefined || value === null) return "-";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Get price for a specific market from item
  const getMarketPrice = (
    item: CPIReportItem,
    marketId: string,
    type: "base" | "current" | "relative"
  ): number | undefined => {
    const marketRelative = item.market_relatives?.find(
      (mr) => mr.market_id === marketId
    );
    if (!marketRelative) return undefined;
    switch (type) {
      case "base":
        return marketRelative.base_price;
      case "current":
        return marketRelative.curr_price;
      case "relative":
        return marketRelative.relative;
    }
  };

  // Group items by group and class
  const groupedItems = useMemo(() => {
    if (!reportData?.items?.length) return [];
    const groups: {
      group: string;
      groupWeight: number;
      classes: {
        className: string;
        classWeight: number;
        items: CPIReportItem[];
      }[];
    }[] = [];

    const groupMap = new Map<
      string,
      Map<string, CPIReportItem[]>
    >();

    reportData.items.forEach((item) => {
      if (!groupMap.has(item.group)) {
        groupMap.set(item.group, new Map());
      }
      const classMap = groupMap.get(item.group)!;
      if (!classMap.has(item.class)) {
        classMap.set(item.class, []);
      }
      classMap.get(item.class)!.push(item);
    });

    groupMap.forEach((classMap, groupName) => {
      const groupData = reportData.groups?.find((g) => g.group === groupName);
      const classes: {
        className: string;
        classWeight: number;
        items: CPIReportItem[];
      }[] = [];

      classMap.forEach((items, className) => {
        const classData = groupData?.classes?.find((c) => c.class === className);
        classes.push({
          className,
          classWeight: classData?.class_weight || 0,
          items: items.sort((a, b) => a.item.localeCompare(b.item)),
        });
      });

      groups.push({
        group: groupName,
        groupWeight: groupData?.group_weight || 0,
        classes: classes.sort((a, b) => a.className.localeCompare(b.className)),
      });
    });

    return groups.sort((a, b) => a.group.localeCompare(b.group));
  }, [reportData]);

  // Export to CSV
  const handleExport = () => {
    if (!reportData) return;

    const headers = [
      "Category",
      "Class",
      "Weight",
      "Item Name",
      ...uniqueMarkets.map((m) => `${m.name} (Base Price)`),
      ...uniqueMarkets.map((m) => `${m.name} (Current Price)`),
      ...uniqueMarkets.map((m) => `${m.name} (Relative)`),
      "Jevons Index",
    ];

    const rows: string[][] = [];

    groupedItems.forEach((group) => {
      group.classes.forEach((cls) => {
        cls.items.forEach((item, idx) => {
          const row = [
            idx === 0 ? group.group : "",
            idx === 0 ? cls.className : "",
            idx === 0 ? cls.classWeight.toString() : "",
            item.item,
            ...uniqueMarkets.map((m) =>
              formatNumber(getMarketPrice(item, m.id, "base"))
            ),
            ...uniqueMarkets.map((m) =>
              formatNumber(getMarketPrice(item, m.id, "current"))
            ),
            ...uniqueMarkets.map((m) =>
              formatNumber(getMarketPrice(item, m.id, "relative"), 4)
            ),
            formatNumber(item.jevons_item, 4),
          ];
          rows.push(row);
        });
      });
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `CPI_Report_${reportData.base_month}_${reportData.base_year}_to_${reportData.month}_${reportData.year}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <MaxWidthWrapper>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CPI Report</h1>
            <p className="mt-1 text-gray-600">
              Generate Consumer Price Index reports with custom parameters
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#013370]" />
                <h2 className="text-lg font-medium text-gray-900">
                  Report Parameters
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Base Period Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Base Period
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Month
                    </label>
                    <Select
                      value={formData.base_month.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, base_month: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem
                            key={month.value}
                            value={month.value.toString()}
                          >
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Year
                    </label>
                    <Select
                      value={formData.base_year.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, base_year: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Current Period Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Current Period
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month
                    </label>
                    <Select
                      value={formData.month.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, month: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem
                            key={month.value}
                            value={month.value.toString()}
                          >
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <Select
                      value={formData.year.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, year: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Scope Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Report Scope
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scope
                    </label>
                    <Select
                      value={formData.scope}
                      onValueChange={handleScopeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                      <SelectContent>
                        {scopeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location Section (conditional) */}
              {formData.scope !== "ALL" && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <Select
                        value={formData.state_id || "none"}
                        onValueChange={handleStateChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select a state</SelectItem>
                          {statesData?.data?.map((state) => (
                            <SelectItem key={state.id} value={state.id}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.scope === "SENATORIAL_DISTRICT" && formData.state_id && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Senatorial District
                        </label>
                        <Select
                          value={formData.senatorial_district_id || "none"}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              senatorial_district_id: value === "none" ? "" : value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select senatorial district" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              Select a senatorial district
                            </SelectItem>
                            {senatorialDistricts.map((district) => (
                              <SelectItem key={district.id} value={district.id}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={generateReport.isPending}
                  className="bg-[#013370] hover:bg-[#012a5c]"
                >
                  {generateReport.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Report Results */}
          {reportData && (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-6 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#013370]" />
                    <h2 className="text-lg font-medium text-gray-900">
                      CPI Report Results
                    </h2>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Base Period:</span>{" "}
                      <span className="font-medium">
                        {getMonthName(reportData.base_month)} {reportData.base_year}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Period:</span>{" "}
                      <span className="font-medium">
                        {getMonthName(reportData.month)} {reportData.year}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Weight Scope:</span>{" "}
                      <span className="font-medium">{reportData.weight_scope}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Scope:</span>{" "}
                      <span className="font-medium">{reportData.scope}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    Item Price Relatives
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Price data by item across markets
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 sticky left-0 bg-gray-50 min-w-[200px]">
                          Category / Class
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-900 min-w-[80px]">
                          Weight
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 min-w-[200px]">
                          Item Name
                        </th>
                        {/* Base Period Prices Header Group */}
                        <th
                          colSpan={uniqueMarkets.length}
                          className="px-4 py-2 text-center font-semibold text-gray-900 border-l bg-blue-50"
                        >
                          {getMonthName(reportData.base_month)} {reportData.base_year} (Base Prices)
                        </th>
                        {/* Current Period Prices Header Group */}
                        <th
                          colSpan={uniqueMarkets.length}
                          className="px-4 py-2 text-center font-semibold text-gray-900 border-l bg-green-50"
                        >
                          {getMonthName(reportData.month)} {reportData.year} (Current Prices)
                        </th>
                        {/* Price Relatives Header Group */}
                        <th
                          colSpan={uniqueMarkets.length}
                          className="px-4 py-2 text-center font-semibold text-gray-900 border-l bg-yellow-50"
                        >
                          Price Relatives
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-900 border-l bg-purple-50 min-w-[100px]">
                          Jevons Index
                        </th>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-2 sticky left-0 bg-gray-50"></th>
                        <th className="px-4 py-2"></th>
                        <th className="px-4 py-2"></th>
                        {/* Base Period Market Names */}
                        {uniqueMarkets.map((market) => (
                          <th
                            key={`base-${market.id}`}
                            className="px-3 py-2 text-right font-medium text-gray-700 text-xs border-l bg-blue-50 min-w-[100px] whitespace-nowrap"
                            title={market.name}
                          >
                            {market.name.length > 15
                              ? market.name.substring(0, 12) + "..."
                              : market.name}
                          </th>
                        ))}
                        {/* Current Period Market Names */}
                        {uniqueMarkets.map((market) => (
                          <th
                            key={`curr-${market.id}`}
                            className="px-3 py-2 text-right font-medium text-gray-700 text-xs border-l bg-green-50 min-w-[100px] whitespace-nowrap"
                            title={market.name}
                          >
                            {market.name.length > 15
                              ? market.name.substring(0, 12) + "..."
                              : market.name}
                          </th>
                        ))}
                        {/* Relative Market Names */}
                        {uniqueMarkets.map((market) => (
                          <th
                            key={`rel-${market.id}`}
                            className="px-3 py-2 text-right font-medium text-gray-700 text-xs border-l bg-yellow-50 min-w-[100px] whitespace-nowrap"
                            title={market.name}
                          >
                            {market.name.length > 15
                              ? market.name.substring(0, 12) + "..."
                              : market.name}
                          </th>
                        ))}
                        <th className="px-4 py-2 border-l bg-purple-50"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedItems.map((group) => (
                        <Fragment key={`group-${group.group}`}>
                          {/* Group Header Row */}
                          <tr className="bg-[#013370] text-white">
                            <td
                              colSpan={3 + uniqueMarkets.length * 3 + 1}
                              className="px-4 py-3 font-semibold"
                            >
                              {group.group}
                              <span className="ml-2 text-sm font-normal opacity-80">
                                (Weight: {formatNumber(group.groupWeight)})
                              </span>
                            </td>
                          </tr>
                          {group.classes.map((cls) => (
                            <Fragment key={`class-${group.group}-${cls.className}`}>
                              {/* Class Header Row */}
                              <tr className="bg-gray-100">
                                <td className="px-4 py-2 pl-8 font-medium text-gray-800 sticky left-0 bg-gray-100">
                                  {cls.className}
                                </td>
                                <td className="px-4 py-2 text-right text-gray-700">
                                  {formatNumber(cls.classWeight)}
                                </td>
                                <td
                                  colSpan={1 + uniqueMarkets.length * 3 + 1}
                                  className="px-4 py-2"
                                ></td>
                              </tr>
                              {/* Item Rows */}
                              {cls.items.map((item) => (
                                <tr
                                  key={item.item_id}
                                  className="border-b hover:bg-gray-50"
                                >
                                  <td className="px-4 py-2 pl-12 sticky left-0 bg-white"></td>
                                  <td className="px-4 py-2"></td>
                                  <td className="px-4 py-2 text-gray-900">
                                    {item.item}
                                  </td>
                                  {/* Base Prices */}
                                  {uniqueMarkets.map((market) => (
                                    <td
                                      key={`base-${item.item_id}-${market.id}`}
                                      className="px-3 py-2 text-right text-gray-700 border-l bg-blue-50/30"
                                    >
                                      {formatNumber(
                                        getMarketPrice(item, market.id, "base")
                                      )}
                                    </td>
                                  ))}
                                  {/* Current Prices */}
                                  {uniqueMarkets.map((market) => (
                                    <td
                                      key={`curr-${item.item_id}-${market.id}`}
                                      className="px-3 py-2 text-right text-gray-700 border-l bg-green-50/30"
                                    >
                                      {formatNumber(
                                        getMarketPrice(item, market.id, "current")
                                      )}
                                    </td>
                                  ))}
                                  {/* Relatives */}
                                  {uniqueMarkets.map((market) => (
                                    <td
                                      key={`rel-${item.item_id}-${market.id}`}
                                      className="px-3 py-2 text-right text-gray-700 border-l bg-yellow-50/30"
                                    >
                                      {formatNumber(
                                        getMarketPrice(item, market.id, "relative"),
                                        4
                                      )}
                                    </td>
                                  ))}
                                  {/* Jevons Index */}
                                  <td className="px-4 py-2 text-right font-medium text-gray-900 border-l bg-purple-50/30">
                                    {formatNumber(item.jevons_item, 4)}
                                  </td>
                                </tr>
                              ))}
                            </Fragment>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Group Summary Table */}
              {reportData.groups && reportData.groups.length > 0 && (
                <div className="rounded-lg border bg-white shadow-sm">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                      Group Summary Indices
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Aggregated CPI indices by group
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Group
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-900">
                            Weight
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-900">
                            Weight (Frac)
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-900">
                            Jevons Index
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-900">
                            Young Index
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.groups.map((group) => (
                          <Fragment key={group.group}>
                            <tr className="border-b bg-[#013370]/5 font-medium">
                              <td className="px-4 py-3 text-gray-900">
                                {group.group}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-700">
                                {formatNumber(group.group_weight)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-700">
                                {formatNumber(group.group_weight_frac, 4)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                                {formatNumber(group.jevons_group, 4)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                                {formatNumber(group.young_group, 4)}
                              </td>
                            </tr>
                            {/* Class breakdown */}
                            {group.classes?.map((cls) => (
                              <tr
                                key={`${group.group}-${cls.class}`}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="px-4 py-2 pl-8 text-gray-700">
                                  {cls.class}
                                </td>
                                <td className="px-4 py-2 text-right text-gray-600">
                                  {formatNumber(cls.class_weight)}
                                </td>
                                <td className="px-4 py-2 text-right text-gray-600">
                                  {formatNumber(cls.class_weight_frac, 4)}
                                </td>
                                <td className="px-4 py-2 text-right text-gray-700">
                                  {formatNumber(cls.jevons_class, 4)}
                                </td>
                                <td className="px-4 py-2 text-right text-gray-400">
                                  -
                                </td>
                              </tr>
                            ))}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </AppLayout>
  );
}
