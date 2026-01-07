"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { HouseholdItemsTable } from "@/components/household-items/household-items-table";
import { HouseholdItemsEmptyState } from "@/components/household-items/empty-state";
import { HouseholdItemsErrorState } from "@/components/household-items/error-state";
import { AddHouseholdItemDialog } from "@/components/household-items/add-household-item-dialog";
import { useHouseholdItems } from "@/hooks/use-household-items";
import { exportHouseholdItemsToCSV } from "@/lib/utils/export";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Plus } from "lucide-react";

export default function HouseholdItemsPage() {
  const { data, isLoading, error, refetch } = useHouseholdItems();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleDownload = () => {
    if (data?.data && data.data.length > 0) {
      exportHouseholdItemsToCSV(data.data);
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
                Household Items
              </h1>
              <p className="mt-1 text-gray-600">
                Manage household items for expenditure tracking
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
              <Button
                onClick={handleDownload}
                disabled={!data?.data || data.data.length === 0 || isLoading}
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">
                Total Items
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data?.length || 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Groups</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((item) => item.group)).size
                  : 0}
              </p>
            </div>
          </div>

          {/* Household Items Table */}
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border bg-white p-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#013370]" />
                <p className="text-sm text-gray-600">Loading household items...</p>
              </div>
            </div>
          ) : error ? (
            <HouseholdItemsErrorState error={error} onRetry={() => refetch()} />
          ) : !data?.data || data.data.length === 0 ? (
            <HouseholdItemsEmptyState />
          ) : (
            <HouseholdItemsTable items={data.data} />
          )}
        </div>
      </MaxWidthWrapper>

      <AddHouseholdItemDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </AppLayout>
  );
}
