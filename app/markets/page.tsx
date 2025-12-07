"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { EditMarketDialog } from "@/components/markets/edit-market-dialog";
import { MarketsTable } from "@/components/markets/markets-table";
import { MarketsEmptyState } from "@/components/markets/empty-state";
import { MarketsErrorState } from "@/components/markets/error-state";
import { useMarkets } from "@/hooks/use-markets";
import { Market } from "@/lib/types/markets";
import { exportMarketsToCSV } from "@/lib/utils/export";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

export default function MarketsPage() {
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useMarkets();

  const handleEdit = (market: Market) => {
    setEditingMarket(market);
    setEditDialogOpen(true);
  };

  const handleDownload = () => {
    if (data?.data && data.data.length > 0) {
      exportMarketsToCSV(data.data);
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
                Market Management
              </h1>
              <p className="mt-1 text-gray-600">
                Manage market information and locations
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
                Total Markets
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data?.length || 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Active Markets</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data?.filter((m) => m.is_active).length || 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">LGAs</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((m) => m.lga)).size
                  : 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Towns</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data
                  ? new Set(data.data.map((m) => m.town)).size
                  : 0}
              </p>
            </div>
          </div>

          {/* Markets Table */}
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border bg-white p-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#013370]" />
                <p className="text-sm text-gray-600">Loading markets...</p>
              </div>
            </div>
          ) : error ? (
            <MarketsErrorState error={error} onRetry={() => refetch()} />
          ) : !data?.data || data.data.length === 0 ? (
            <MarketsEmptyState />
          ) : (
            <MarketsTable markets={data.data} onEdit={handleEdit} />
          )}
        </div>
      </MaxWidthWrapper>

      {/* Edit Dialog */}
      {editingMarket && (
        <EditMarketDialog
          market={editingMarket}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </AppLayout>
  );
}
