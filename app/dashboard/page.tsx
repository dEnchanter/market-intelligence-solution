"use client";

import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { useStatsSummary } from "@/hooks/use-stats";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error } = useStatsSummary();

  return (
    <AppLayout>
      <MaxWidthWrapper>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to Market Intelligence Solution</p>
          </div>

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                <p className="mt-2 text-3xl font-bold text-[#013370]">
                  {data?.data?.total_users || 0}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600">Total Markets</h3>
                <p className="mt-2 text-3xl font-bold text-[#013370]">
                  {data?.data?.total_markets || 0}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600">Total Households</h3>
                <p className="mt-2 text-3xl font-bold text-[#013370]">
                  {data?.data?.total_households || 0}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600">Total Market Prices</h3>
                <p className="mt-2 text-3xl font-bold text-[#013370]">
                  {data?.data?.total_market_prices || 0}
                </p>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-gray-900">New market added</p>
                  <p className="text-sm text-gray-600">Ikeja Market, Lagos</p>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-gray-900">Price update</p>
                  <p className="text-sm text-gray-600">Rice - ₦45,000/bag</p>
                </div>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">New user registered</p>
                  <p className="text-sm text-gray-600">Jane Doe - Field Agent</p>
                </div>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </AppLayout>
  );
}
