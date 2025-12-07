"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketsErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function MarketsErrorState({ error, onRetry }: MarketsErrorStateProps) {
  return (
    <div className="rounded-lg border bg-white p-12 text-center">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-red-50 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to Load Markets
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          {error.message || "An error occurred while loading the data."}
        </p>
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-[#013370] text-[#013370] hover:bg-[#013370] hover:text-white"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
