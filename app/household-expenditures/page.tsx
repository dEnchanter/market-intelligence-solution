/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { ExpendituresTable } from "@/components/household-expenditures/expenditures-table";
import { ExpendituresEmptyState } from "@/components/household-expenditures/empty-state";
import { ExpendituresErrorState } from "@/components/household-expenditures/error-state";
import { useExpenditures } from "@/hooks/use-household-expenditures";
import { useHouseholds } from "@/hooks/use-households";
import { useHouseholdItems } from "@/hooks/use-household-items";
import { useDistricts } from "@/hooks/use-districts";
import { useUsers } from "@/hooks/use-users";
import { ExpenditureListFilters } from "@/lib/types/household-expenditures";
import { exportExpendituresToCSV } from "@/lib/utils/export";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, Filter, X, Download, ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HouseholdExpendituresPage() {
  const [filters, setFilters] = useState<ExpenditureListFilters>({});
  const [tempFilters, setTempFilters] = useState<ExpenditureListFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemSearchValue, setItemSearchValue] = useState("");

  const { data, isLoading, error, refetch } = useExpenditures(filters);
  const { data: householdsData } = useHouseholds();
  const { data: itemsData } = useHouseholdItems();
  const { data: districtsData } = useDistricts();
  const { data: usersData } = useUsers();

  // Helper function to abbreviate large numbers
  const abbreviateNumber = (value: number): string => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const applyFilters = () => {
    setFilters(tempFilters);
  };

  const clearFilters = () => {
    setTempFilters({});
    setFilters({});
    setItemSearchValue("");
  };

  const handleDownload = () => {
    if (data?.data && data.data.length > 0) {
      exportExpendituresToCSV(data.data);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Get selected item name for display
  const selectedItem = useMemo(() => {
    return itemsData?.data?.find(item => item.id === tempFilters.item_id);
  }, [itemsData, tempFilters.item_id]);

  // Filter users to only show Field profile type
  const fieldUsers = useMemo(() => {
    return usersData?.data?.filter((user: any) => user.ProfileType === "Field") || [];
  }, [usersData]);

  return (
    <AppLayout>
      <MaxWidthWrapper>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Household Expenditures
              </h1>
              <p className="mt-1 text-gray-600">
                Track and manage household consumption expenditures
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
              <div className="p-6 pt-0 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {/* Household Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Household
                    </label>
                    <Select
                      value={tempFilters.household_id || "all"}
                      onValueChange={(value) =>
                        setTempFilters({
                          ...tempFilters,
                          household_id: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All households" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All households</SelectItem>
                        {householdsData?.data?.map((household) => (
                          <SelectItem key={household.id} value={household.id}>
                            {household.household_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Item Filter with Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Household Item
                    </label>
                    <Popover open={itemSearchOpen} onOpenChange={setItemSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={itemSearchOpen}
                          className="w-full justify-between"
                          title={selectedItem ? selectedItem.item : "All items"}
                        >
                          <span className="truncate">
                            {selectedItem ? selectedItem.item : "All items"}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search items..."
                            value={itemSearchValue}
                            onValueChange={setItemSearchValue}
                          />
                          <CommandList>
                            <CommandEmpty>No item found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value="all"
                                onSelect={() => {
                                  setTempFilters({
                                    ...tempFilters,
                                    item_id: undefined,
                                  });
                                  setItemSearchValue("");
                                  setItemSearchOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    !tempFilters.item_id ? "opacity-100" : "opacity-0"
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
                                  {item.item}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Month Filter */}
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
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year Filter */}
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

                  {/* District Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <Select
                      value={tempFilters.district_id || "all"}
                      onValueChange={(value) =>
                        setTempFilters({
                          ...tempFilters,
                          district_id: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All districts</SelectItem>
                        {districtsData?.data?.map((district) => (
                          <SelectItem key={district.id || district.name} value={district.id || ""}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Town Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Town
                    </label>
                    <Input
                      placeholder="Enter town name"
                      value={tempFilters.town || ""}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          town: e.target.value || undefined,
                        })
                      }
                    />
                  </div>

                  {/* Field User Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field User
                    </label>
                    <Select
                      value={tempFilters.added_by_id || "all"}
                      onValueChange={(value) =>
                        setTempFilters({
                          ...tempFilters,
                          added_by_id: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All field users" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All field users</SelectItem>
                        {fieldUsers && Array.isArray(fieldUsers) && fieldUsers.length > 0 ? (
                          fieldUsers.map((user: any) => (
                            <SelectItem key={user.id} value={user.id || ""}>
                              {user.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            No field users available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <Select
                      value={tempFilters.type || "all"}
                      onValueChange={(value) =>
                        setTempFilters({
                          ...tempFilters,
                          type: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="rural">Rural</SelectItem>
                        <SelectItem value="urban">Urban</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Exclude Policy Items Filter */}
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="exclude-policy-items"
                        checked={tempFilters.exclude_policy_items || false}
                        onCheckedChange={(checked) =>
                          setTempFilters({
                            ...tempFilters,
                            exclude_policy_items: checked === true ? true : undefined,
                          })
                        }
                      />
                      <label
                        htmlFor="exclude-policy-items"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Exclude Policy Items
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={applyFilters}
                    className="bg-[#013370] hover:bg-[#012a5c]"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                  <Button onClick={clearFilters} variant="outline">
                    <X className="mr-2 h-4 w-4" />
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
                Total Expenditures
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data?.length || 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">
                Total Amount
              </h3>
              <p
                className="mt-2 text-3xl font-bold text-[#013370] cursor-help"
                title={`₦${data?.data?.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString() || 0}`}
              >
                ₦{abbreviateNumber(data?.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0)}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">
                Unique Households
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((e) => e.household_id)).size
                  : 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">
                Unique Items
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data ? new Set(data.data.map((e) => e.item_id)).size : 0}
              </p>
            </div>
          </div>

          {/* Expenditures Table */}
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border bg-white p-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#013370]" />
                <p className="text-sm text-gray-600">Loading expenditures...</p>
              </div>
            </div>
          ) : error ? (
            <ExpendituresErrorState error={error} onRetry={() => refetch()} />
          ) : !data?.data || data.data.length === 0 ? (
            <ExpendituresEmptyState />
          ) : (
            <ExpendituresTable expenditures={data.data} />
          )}
        </div>
      </MaxWidthWrapper>
    </AppLayout>
  );
}
