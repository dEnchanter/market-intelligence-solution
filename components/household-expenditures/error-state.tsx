import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpendituresErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function ExpendituresErrorState({
  error,
  onRetry,
}: ExpendituresErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-red-100 p-6 mb-4">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load expenditures
        </h3>
        <p className="text-gray-600 max-w-sm mb-4">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button
          onClick={onRetry}
          className="bg-[#013370] hover:bg-[#012a5c]"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
