"use client";

import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { HouseholdsTable } from "@/components/households/households-table";
import { HouseholdsEmptyState } from "@/components/households/empty-state";
import { HouseholdsErrorState } from "@/components/households/error-state";
import { useHouseholds } from "@/hooks/use-households";
import { exportHouseholdsToCSV } from "@/lib/utils/export";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

export default function HouseholdsPage() {
  const { data, isLoading, error, refetch } = useHouseholds();

  const handleDownload = () => {
    if (data?.data && data.data.length > 0) {
      exportHouseholdsToCSV(data.data);
    }
  };

  return (
    <AppLayout>
      <MaxWidthWrapper>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Household Management
              </h1>
              <p className="mt-1 text-gray-600">
                Manage household information and locations
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

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">
                Total Households
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data?.length || 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">LGAs</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((h) => h.lga)).size
                  : 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Towns</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((h) => h.town)).size
                  : 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Districts</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((h) => h.district_id)).size
                  : 0}
              </p>
            </div>
          </div>

          {/* Households Table */}
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border bg-white p-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#013370]" />
                <p className="text-sm text-gray-600">Loading households...</p>
              </div>
            </div>
          ) : error ? (
            <HouseholdsErrorState error={error} onRetry={() => refetch()} />
          ) : !data?.data || data.data.length === 0 ? (
            <HouseholdsEmptyState />
          ) : (
            <HouseholdsTable households={data.data} />
          )}
        </div>
      </MaxWidthWrapper>
    </AppLayout>
  );
}
