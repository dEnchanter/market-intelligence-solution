"use client";

import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { useStatsSummary } from "@/hooks/use-stats";
import { useUsers } from "@/hooks/use-users";
import { useMarketHouseholdReport } from "@/hooks/use-reporting";
import { Loader2, Building2, Store, List, Home, Users, Package, ShoppingCart, UserCircle, Inbox, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function DashboardPage() {
  const { data, isLoading, error } = useStatsSummary();
  const { data: usersData, isLoading: usersLoading } = useUsers();

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
  const currentYear = currentDate.getFullYear();

  // Filter states - default to current month and year
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Reporting endpoints - only fetch when filters are applied
  const { data: marketHouseholdData, isLoading: marketHouseholdLoading, error: marketHouseholdError } = useMarketHouseholdReport(
    selectedUserId || undefined,
    selectedMonth,
    selectedYear
  );

  // Filter users to only show Field profile type
  const fieldUsers = usersData?.data?.filter((user: any) => user.ProfileType === "Field") || [];

  return (
    <AppLayout>
      <MaxWidthWrapper>
        <div className="space-y-4 md:space-y-6">
          {/* Stats Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border bg-white p-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#013370]" />
                <p className="text-sm text-gray-600">Loading statistics...</p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border bg-white p-12 text-center">
              <p className="text-gray-600">Failed to load statistics</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
                {/* Districts */}
                <Link href="/districts" className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2.5 md:p-3">
                      <Building2 className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Districts</p>
                      <p className="text-xl md:text-2xl font-bold text-[#013370]">
                        {data?.data?.total_districts || 0}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Markets */}
                <Link href="/markets" className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2.5 md:p-3">
                      <Store className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Markets</p>
                      <p className="text-xl md:text-2xl font-bold text-[#013370]">
                        {data?.data?.total_markets || 0}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Item Groups */}
                <Link href="/consumption-items" className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2.5 md:p-3">
                      <List className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Item Groups</p>
                      <p className="text-xl md:text-2xl font-bold text-[#013370]">
                        {data?.data?.total_item_groups || 0}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Items */}
                <Link href="/consumption-items" className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-teal-100 p-2.5 md:p-3">
                      <Package className="h-5 w-5 md:h-6 md:w-6 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Items</p>
                      <p className="text-xl md:text-2xl font-bold text-[#013370]">
                        {data?.data?.total_items || 0}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Households */}
                <Link href="/households" className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-100 p-2.5 md:p-3">
                      <Home className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Households</p>
                      <p className="text-xl md:text-2xl font-bold text-[#013370]">
                        {data?.data?.total_households || 0}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Household Items */}
                <Link href="/household-items" className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-pink-100 p-2.5 md:p-3">
                      <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-pink-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Household Items</p>
                      <p className="text-xl md:text-2xl font-bold text-[#013370]">
                        {data?.data?.total_household_items || 0}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Field Users */}
                <Link href="/users" className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2.5 md:p-3">
                      <Users className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Field Users</p>
                      <p className="text-xl md:text-2xl font-bold text-[#013370]">
                        {data?.data?.total_field_role_users || 0}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Filters Section */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 md:gap-4 rounded-lg border bg-white p-3 md:p-4 shadow-sm">
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="w-full sm:w-[180px] md:w-[200px]">
                    <SelectValue placeholder={usersLoading ? "Loading users..." : "Select Field User"} />
                  </SelectTrigger>
                  <SelectContent>
                    {usersLoading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : fieldUsers && Array.isArray(fieldUsers) && fieldUsers.length > 0 ? (
                      fieldUsers.map((user: any) => (
                        <SelectItem key={user.id} value={user.id || ""}>
                          {user.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>No field users available</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Select value={selectedMonth?.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger className="w-full sm:w-[140px] md:w-[150px]">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedYear?.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-full sm:w-[110px] md:w-[120px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Market Household Report Cards */}
              {marketHouseholdLoading ? (
                <div className="flex items-center justify-center rounded-lg border bg-white p-12">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-[#013370]" />
                    <p className="text-sm text-gray-600">Loading report...</p>
                  </div>
                </div>
              ) : marketHouseholdError ? (
                // Error state - check if it's because no user was selected
                !selectedUserId ? (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-full bg-blue-100 p-3">
                        <UserCircle className="h-10 w-10 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-blue-900">Select a Field User</p>
                        <p className="text-sm text-blue-700">
                          Please select a field user from the dropdown above to view the market household report.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-full bg-red-100 p-3">
                        <AlertCircle className="h-10 w-10 text-red-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-red-900">Failed to Load Report</p>
                        <p className="text-sm text-red-700">
                          There was an error loading the market household report. Please try again or contact support if the issue persists.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              ) : marketHouseholdData?.data && Array.isArray(marketHouseholdData.data) && marketHouseholdData.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketHouseholdData.data.map((item: any, index: number) => {
                    const totalItems = (item.market?.total_item_added || 0) + (item.market?.total_item_not_added || 0);
                    const totalHouseholds = (item.household?.total_household_added || 0) + (item.household?.total_household_not_added || 0);

                    return (
                      <div key={item.market?.market_id || index} className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="space-y-3">
                          {/* Location Header */}
                          <div className="border-b pb-2">
                            <h3 className="font-semibold text-[#013370]">
                              {item.location?.town || 'N/A'} | {item.location?.lga || 'N/A'}
                            </h3>
                          </div>

                          {/* Market Info */}
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Market Name</p>
                              <p className="text-base font-semibold text-gray-900">{item.market?.name || 'N/A'}</p>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-600">Items captured</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {item.market?.total_item_added || 0}/{totalItems}
                              </p>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-600">Total Price</p>
                              <p className="text-sm font-semibold text-gray-900">
                                ₦{(item.market?.total_cost_added || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>

                            <div className="flex justify-between items-center border-t pt-2">
                              <p className="text-sm text-gray-600">Household</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {item.household?.total_household_added || 0}/{totalHouseholds}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Empty state - data loaded successfully but array is empty
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-gray-100 p-3">
                      <Inbox className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-gray-900">No Data Available</p>
                      <p className="text-sm text-gray-600">
                        No market household reports found for the selected filters. Try adjusting your selection.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </AppLayout>
  );
}
