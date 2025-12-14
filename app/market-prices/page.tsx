"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { AddMarketPriceDialog } from "@/components/market-prices/add-market-price-dialog";
import { MarketPricesTable } from "@/components/market-prices/market-prices-table";
import { MarketPricesEmptyState } from "@/components/market-prices/empty-state";
import { MarketPricesErrorState } from "@/components/market-prices/error-state";
import { useMarketPrices } from "@/hooks/use-market-prices";
import { useMarkets } from "@/hooks/use-markets";
import { useConsumptionItems } from "@/hooks/use-consumption-items";
import { MarketPriceListFilters } from "@/lib/types/market-prices";
import { exportMarketPricesToCSV } from "@/lib/utils/export";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Loader2, Filter, Download, ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketPricesPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [showFilters, setShowFilters] = useState(false);
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [filters, setFilters] = useState<MarketPriceListFilters>({});
  const [tempFilters, setTempFilters] = useState<MarketPriceListFilters>({});

  const { data, isLoading, error, refetch } = useMarketPrices(filters);
  const { data: marketsData } = useMarkets();
  const { data: itemsData } = useConsumptionItems();

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

  const handleApplyFilters = () => {
    setFilters(tempFilters);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    setFilters({});
  };

  const handleDownload = () => {
    if (data?.data && data.data.length > 0) {
      exportMarketPricesToCSV(data.data);
    }
  };

  const selectedMarket = marketsData?.data?.find(
    (m) => m.id === tempFilters.market_id
  );

  const selectedItem = itemsData?.data?.find(
    (i) => i.id === tempFilters.item_id
  );

  return (
    <AppLayout>
      <MaxWidthWrapper>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Market Prices
              </h1>
              <p className="mt-1 text-gray-600">
                Track and manage market price data
              </p>
            </div>
            <Button
              onClick={handleDownload}
              disabled={!data?.data || data.data.length === 0 || isLoading}
              className="bg-[#013370] hover:bg-[#012a5c]"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>

          {/* Filters */}
          <div className="rounded-lg border bg-white shadow-sm">
            <div
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#013370]" />
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                {Object.keys(filters).length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#013370] text-white rounded-full">
                    {Object.keys(filters).length}
                  </span>
                )}
              </div>
              {showFilters ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {showFilters && (
              <div className="px-6 pb-6 space-y-4 border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Market
                    </label>
                    <Select
                      value={tempFilters.market_id || "all"}
                      onValueChange={(value) =>
                        setTempFilters({
                          ...tempFilters,
                          market_id: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All markets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All markets</SelectItem>
                        {marketsData?.data?.map((market) => (
                          <SelectItem key={market.id} value={market.id!}>
                            {market.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consumption Item
                    </label>
                    <Popover
                      open={itemSearchOpen}
                      onOpenChange={setItemSearchOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                          title={selectedItem ? selectedItem.item : "All items"}
                        >
                          <span className="truncate">
                            {selectedItem ? selectedItem.item : "All items"}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search items..." />
                          <CommandList>
                            <CommandEmpty>No items found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value="all"
                                onSelect={() => {
                                  setTempFilters({
                                    ...tempFilters,
                                    item_id: undefined,
                                  });
                                  setItemSearchOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    !tempFilters.item_id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                All items
                              </CommandItem>
                              {itemsData?.data?.map((item) => (
                                <CommandItem
                                  key={item.id}
                                  value={item.item}
                                  onSelect={() => {
                                    setTempFilters({
                                      ...tempFilters,
                                      item_id: item.id,
                                    });
                                    setItemSearchOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      tempFilters.item_id === item.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <p>{item.item}</p>
                                    <p className="text-xs text-gray-500">
                                      {item.group}
                                    </p>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month
                    </label>
                    <Select
                      value={tempFilters.month?.toString() || "all"}
                      onValueChange={(value) =>
                        setTempFilters({
                          ...tempFilters,
                          month: value === "all" ? undefined : parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All months" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All months</SelectItem>
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
                      value={tempFilters.year?.toString() || "all"}
                      onValueChange={(value) =>
                        setTempFilters({
                          ...tempFilters,
                          year: value === "all" ? undefined : parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All years</SelectItem>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleApplyFilters}
                    className="bg-[#013370] hover:bg-[#012a5c]"
                  >
                    Apply Filters
                  </Button>
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">
                Total Entries
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data?.length || 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Markets</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((p: any) => p.market_id)).size
                  : 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Items Tracked</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((p: any) => p.item_id)).size
                  : 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Avg Price</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data && data.data.length > 0
                  ? new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      maximumFractionDigits: 0,
                    }).format(
                      data.data.reduce((sum: number, p: any) => sum + p.price, 0) /
                        data.data.length
                    )
                  : "₦0"}
              </p>
            </div>
          </div>

          {/* Market Prices Table */}
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border bg-white p-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#013370]" />
                <p className="text-sm text-gray-600">Loading market prices...</p>
              </div>
            </div>
          ) : error ? (
            <MarketPricesErrorState error={error} onRetry={() => refetch()} />
          ) : !data?.data || data.data.length === 0 ? (
            <MarketPricesEmptyState />
          ) : (
            <MarketPricesTable prices={data.data} />
          )}
        </div>
      </MaxWidthWrapper>
    </AppLayout>
  );
}
