"use client";

import { useState, useMemo } from "react";
import { Market } from "@/lib/types/markets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Ban, CheckCircle } from "lucide-react";
import { useUpdateMarketStatus } from "@/hooks/use-markets";

interface MarketsTableProps {
  markets: Market[];
  onEdit?: (market: Market) => void;
}

export function MarketsTable({ markets, onEdit }: MarketsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [marketToToggle, setMarketToToggle] = useState<Market | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const updateStatusMutation = useUpdateMarketStatus();

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAll = () => {
    if (selectedRows.size === markets.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(markets.map((m) => m.id!)));
    }
  };

  const handleToggleStatus = (market: Market) => {
    setMarketToToggle(market);
    setConfirmDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (!marketToToggle?.id) return;

    updateStatusMutation.mutate({
      id: marketToToggle.id,
      data: { is_active: !marketToToggle.is_active },
    });

    setConfirmDialogOpen(false);
    setMarketToToggle(null);
  };

  // Calculate paginated data
  const paginatedMarkets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return markets.slice(startIndex, endIndex);
  }, [markets, currentPage, itemsPerPage]);

  // Reset to page 1 when markets change
  useMemo(() => {
    setCurrentPage(1);
  }, [markets.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (!markets || markets.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <p className="text-gray-600">No markets found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 pl-6">
              <Checkbox
                checked={selectedRows.size === markets.length}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="px-4">Market Name</TableHead>
            <TableHead className="px-4">Type</TableHead>
            <TableHead className="px-4">Town</TableHead>
            <TableHead className="px-4">LGA</TableHead>
            <TableHead className="px-4">Location</TableHead>
            <TableHead className="px-4">Status</TableHead>
            <TableHead className="w-16 pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMarkets.map((market) => (
            <TableRow key={market.id}>
              <TableCell className="pl-6">
                <Checkbox
                  checked={selectedRows.has(market.id!)}
                  onCheckedChange={() => toggleRow(market.id!)}
                  aria-label={`Select ${market.name}`}
                />
              </TableCell>
              <TableCell className="font-medium px-4">{market.name}</TableCell>
              <TableCell className="px-4">
                <Badge className="bg-purple-100 text-purple-900 hover:bg-purple-100 border-0">
                  {market.type}
                </Badge>
              </TableCell>
              <TableCell className="px-4">{market.town}</TableCell>
              <TableCell className="px-4">
                <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-100 border-0">
                  {market.lga}
                </Badge>
              </TableCell>
              <TableCell className="px-4 text-sm text-gray-600">
                {market.location.latitude.toFixed(4)}°, {market.location.longitude.toFixed(4)}°
              </TableCell>
              <TableCell className="px-4">
                <Badge
                  className={
                    market.is_active
                      ? "bg-green-100 text-green-900 hover:bg-green-100 border-0"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-100 border-0"
                  }
                >
                  {market.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="pr-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(market)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(market)}>
                      {market.is_active ? (
                        <>
                          <Ban className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalItems={markets.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {marketToToggle?.is_active ? "Deactivate Market" : "Activate Market"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {marketToToggle?.is_active
                ? `Are you sure you want to deactivate "${marketToToggle?.name}"? This market will no longer be available for data collection.`
                : `Are you sure you want to activate "${marketToToggle?.name}"? This market will be available for data collection.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
