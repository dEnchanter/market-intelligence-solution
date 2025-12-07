"use client";

import { Store } from "lucide-react";

export function MarketsEmptyState() {
  return (
    <div className="rounded-lg border bg-white p-12 text-center">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-blue-50 p-3 mb-4">
          <Store className="h-6 w-6 text-[#013370]" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Markets</h3>
        <p className="text-gray-600 mb-6 max-w-md">
          No markets found in this location. Try adjusting your search area or add a new market.
        </p>
      </div>
    </div>
  );
}
