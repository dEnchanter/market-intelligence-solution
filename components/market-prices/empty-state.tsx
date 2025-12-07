"use client";

import { TrendingUp } from "lucide-react";

export function MarketPricesEmptyState() {
  return (
    <div className="rounded-lg border bg-white p-12 text-center">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-blue-50 p-3 mb-4">
          <TrendingUp className="h-6 w-6 text-[#013370]" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Market Prices
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          No market price data found. Add price entries to start tracking market trends.
        </p>
      </div>
    </div>
  );
}
