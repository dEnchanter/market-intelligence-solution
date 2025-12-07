import { MapPin } from "lucide-react";

export function DistrictsEmptyState() {
  return (
    <div className="rounded-lg border bg-white p-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <MapPin className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        No districts found
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Get started by creating your first district
      </p>
    </div>
  );
}
