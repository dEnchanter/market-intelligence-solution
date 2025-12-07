import { Receipt } from "lucide-react";

export function ExpendituresEmptyState() {
  return (
    <div className="rounded-lg border bg-white p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-4">
          <Receipt className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No expenditures found
        </h3>
        <p className="text-gray-600 max-w-sm">
          No household expenditures match your current filters. Try adjusting
          your search criteria or add a new expenditure record.
        </p>
      </div>
    </div>
  );
}
