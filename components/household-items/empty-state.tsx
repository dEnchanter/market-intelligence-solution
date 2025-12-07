import { Package } from "lucide-react";

export function HouseholdItemsEmptyState() {
  return (
    <div className="rounded-lg border bg-white p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-4">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Household Items
        </h3>
        <p className="text-gray-600 max-w-md">
          There are no household items available at the moment.
        </p>
      </div>
    </div>
  );
}
