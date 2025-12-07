"use client";

import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { AddDistrictDialog } from "@/components/districts/add-district-dialog";
import { DistrictsTable } from "@/components/districts/districts-table";
import { DistrictsEmptyState } from "@/components/districts/empty-state";
import { DistrictsErrorState } from "@/components/districts/error-state";
import { useDistricts } from "@/hooks/use-districts";
import { Loader2 } from "lucide-react";

export default function DistrictsPage() {
  const { data, isLoading, error, refetch } = useDistricts();

  return (
    <AppLayout>
      <MaxWidthWrapper>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                District Management
              </h1>
              <p className="mt-1 text-gray-600">
                Manage districts, states, and local government areas
              </p>
            </div>
            <AddDistrictDialog />
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">
                Total Districts
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data?.length || 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">States</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((d) => d.state.id)).size
                  : 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Total LGAs</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? data.data.reduce((sum, d) => sum + d.lga.length, 0)
                  : 0}
              </p>
            </div>
          </div>

          {/* Districts Table */}
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border bg-white p-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#013370]" />
                <p className="text-sm text-gray-600">Loading districts...</p>
              </div>
            </div>
          ) : error ? (
            <DistrictsErrorState error={error} onRetry={() => refetch()} />
          ) : !data?.data || data.data.length === 0 ? (
            <DistrictsEmptyState />
          ) : (
            <DistrictsTable districts={data.data} />
          )}
        </div>
      </MaxWidthWrapper>
    </AppLayout>
  );
}
