"use client";

import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { useStatsSummary } from "@/hooks/use-stats";
import { useDistricts } from "@/hooks/use-districts";
import { useMarketHouseholdReport, useMyMarketHouseholdReport } from "@/hooks/use-reporting";
import { Loader2, Building2, Store, List, Home, Users, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const { data, isLoading, error } = useStatsSummary();
  const { data: districtsData, isLoading: districtsLoading } = useDistricts();

  // Reporting endpoints
  const { data: marketHouseholdData, isLoading: marketHouseholdLoading, error: marketHouseholdError } = useMarketHouseholdReport();
  const { data: myMarketHouseholdData, isLoading: myMarketHouseholdLoading, error: myMarketHouseholdError } = useMyMarketHouseholdReport();

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
                <div className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
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
                </div>

                {/* Markets */}
                <div className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
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
                </div>

                {/* Item Groups */}
                <div className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
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
                </div>

                {/* Items */}
                <div className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
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
                </div>

                {/* Households */}
                <div className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
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
                </div>

                {/* Household Items */}
                <div className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
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
                </div>

                {/* Field Users */}
                <div className="rounded-lg border bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
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
                </div>
              </div>

              {/* Filters Section */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 md:gap-4 rounded-lg border bg-white p-3 md:p-4 shadow-sm">
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px] md:w-[200px]">
                    <SelectValue placeholder={districtsLoading ? "Loading districts..." : "Select District"} />
                  </SelectTrigger>
                  <SelectContent>
                    {districtsLoading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : districtsData?.data && Array.isArray(districtsData.data) && districtsData.data.length > 0 ? (
                      districtsData.data.map((district) => (
                        <SelectItem key={district.id} value={district.id || ""}>
                          {district.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>No districts available</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full sm:w-[140px] md:w-[150px]">
                    <SelectValue placeholder="November" />
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

                <Select>
                  <SelectTrigger className="w-full sm:w-[110px] md:w-[120px]">
                    <SelectValue placeholder="2025" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="flex-1 sm:flex-initial bg-[#013370] hover:bg-[#012a5c]">Filter</Button>
              </div>
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </AppLayout>
  );
}
