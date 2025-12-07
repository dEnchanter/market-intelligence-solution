import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error | unknown;
  onRetry?: () => void;
}

export function DistrictsErrorState({ error, onRetry }: ErrorStateProps) {
  const errorMessage =
    error instanceof Error ? error.message : "Failed to load districts";

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-red-900">
        Something went wrong
      </h3>
      <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-4 border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
