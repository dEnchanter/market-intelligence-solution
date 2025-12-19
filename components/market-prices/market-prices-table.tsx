"use client";

import { useState, useMemo } from "react";
import { MarketPrice } from "@/lib/types/market-prices";
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
import { Pagination } from "@/components/ui/pagination";
import { EditMarketPriceDialog } from "./edit-market-price-dialog";

interface MarketPricesTableProps {
  prices: MarketPrice[];
}

export function MarketPricesTable({ prices }: MarketPricesTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    if (selectedRows.size === prices.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(prices.map((p) => p.id!)));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getMonthName = (month: number) => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[month - 1] || month;
  };

  // Calculate paginated data
  const paginatedPrices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return prices.slice(startIndex, endIndex);
  }, [prices, currentPage, itemsPerPage]);

  // Reset to page 1 when prices change (e.g., after filtering)
  useMemo(() => {
    setCurrentPage(1);
  }, [prices.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (!prices || prices.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <p className="text-gray-600">No market prices found</p>
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
                checked={selectedRows.size === prices.length}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="px-4">Item</TableHead>
            <TableHead className="px-4">Market</TableHead>
            <TableHead className="px-4">Price</TableHead>
            <TableHead className="px-4">Period</TableHead>
            <TableHead className="px-4">Capture Date</TableHead>
            <TableHead className="px-4">Location</TableHead>
            <TableHead className="pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPrices.map((price) => (
            <TableRow key={price.id}>
              <TableCell className="pl-6">
                <Checkbox
                  checked={selectedRows.has(price.id!)}
                  onCheckedChange={() => toggleRow(price.id!)}
                  aria-label={`Select price entry ${price.id}`}
                />
              </TableCell>
              <TableCell className="font-medium px-4">
                {price.item?.item || price.item_id}
                {price.item?.group && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {price.item.group}
                  </p>
                )}
              </TableCell>
              <TableCell className="px-4">
                <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-100 border-0">
                  {price.market?.name || price.market_id}
                </Badge>
                {price.market?.type && (
                  <p className="text-xs text-gray-500 mt-1">
                    {price.market.type}
                  </p>
                )}
              </TableCell>
              <TableCell className="px-4 font-semibold text-[#013370]">
                {formatCurrency(price.price)}
              </TableCell>
              <TableCell className="px-4">
                <Badge className="bg-purple-100 text-purple-900 hover:bg-purple-100 border-0">
                  {getMonthName(price.month)} {price.year}
                </Badge>
              </TableCell>
              <TableCell className="px-4">
                {formatDate(price.capture_date)}
              </TableCell>
              <TableCell className="px-4 text-sm text-gray-600">
                {price.location.latitude.toFixed(4)}°, {price.location.longitude.toFixed(4)}°
              </TableCell>
              <TableCell className="pr-8">
                <EditMarketPriceDialog marketPrice={price} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalItems={prices.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
