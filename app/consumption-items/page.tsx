"use client";

import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { ConsumptionItemsTable } from "@/components/consumption-items/consumption-items-table";
import { ConsumptionItemsEmptyState } from "@/components/consumption-items/empty-state";
import { ConsumptionItemsErrorState } from "@/components/consumption-items/error-state";
import { useConsumptionItems } from "@/hooks/use-consumption-items";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConsumptionItemsPage() {
  const { data, isLoading, error, refetch } = useConsumptionItems();

  const handleDownload = () => {
    if (!data?.data || data.data.length === 0) return;

    // Convert data to CSV format
    const headers = [
      "Item",
      "Description",
      "Group",
      "Class",
      "Subclass",
      "Durability",
      "Unit of Measure",
    ];

    const csvContent = [
      headers.join(","),
      ...data.data.map((item) =>
        [
          `"${item.item}"`,
          `"${item.description || ""}"`,
          `"${item.group}"`,
          `"${item.class}"`,
          `"${item.subclass}"`,
          `"${item.durability}"`,
          `"${item.unit_of_measure}"`,
        ].join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `consumption-items-${new Date().toISOString().split("T")[0]}.csv`
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Consumption Items
              </h1>
              <p className="mt-1 text-gray-600">
                Manage consumption items for market intelligence tracking
              </p>
            </div>
            <Button
              onClick={handleDownload}
              disabled={!data?.data || data.data.length === 0}
              className="bg-[#013370] hover:bg-[#013370]/90"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
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
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Classes</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((item) => item.class)).size
                  : 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Subclasses</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((item) => item.subclass)).size
                  : 0}
              </p>
            </div>
          </div>

          {/* Consumption Items Table */}
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border bg-white p-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#013370]" />
                <p className="text-sm text-gray-600">Loading items...</p>
              </div>
            </div>
          ) : error ? (
            <ConsumptionItemsErrorState error={error} onRetry={() => refetch()} />
          ) : !data?.data || data.data.length === 0 ? (
            <ConsumptionItemsEmptyState />
          ) : (
            <ConsumptionItemsTable items={data.data} />
          )}
        </div>
      </MaxWidthWrapper>
    </AppLayout>
  );
}
