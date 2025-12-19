"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HouseholdExpenditure } from "@/lib/types/household-expenditures";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import { EditExpenditureDialog } from "./edit-expenditure-dialog";

interface ExpendituresTableProps {
  expenditures: HouseholdExpenditure[];
}

export function ExpendituresTable({ expenditures }: ExpendituresTableProps) {
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
    if (selectedRows.size === expenditures.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(expenditures.map((e) => e.id!)));
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1] || month;
  };

  // Calculate paginated data
  const paginatedExpenditures = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return expenditures.slice(startIndex, endIndex);
  }, [expenditures, currentPage, itemsPerPage]);

  // Reset to page 1 when expenditures change (e.g., after filtering)
  useMemo(() => {
    setCurrentPage(1);
  }, [expenditures.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (expenditures.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">No expenditures found</p>
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
                checked={selectedRows.size === expenditures.length}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="px-4">Household</TableHead>
            <TableHead className="px-4 max-w-xs">Item</TableHead>
            <TableHead className="px-4">Amount</TableHead>
            <TableHead className="px-4">Period</TableHead>
            <TableHead className="px-4">Location</TableHead>
            <TableHead className="px-4 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedExpenditures.map((expenditure) => {
            return (
              <TableRow key={expenditure.id}>
                <TableCell className="pl-6">
                  <Checkbox
                    checked={selectedRows.has(expenditure.id)}
                    onCheckedChange={() => toggleRow(expenditure.id)}
                    aria-label={`Select expenditure ${expenditure.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium px-4">
                  {expenditure.household?.household_name || expenditure.household_id}
                  {expenditure.household && (
                    <p className="text-xs text-gray-500">
                      {expenditure.household.contact_name}
                    </p>
                  )}
                </TableCell>
                <TableCell className="px-4 max-w-xs">
                  <div className="max-w-[250px] flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <Badge
                        variant="outline"
                        className="font-normal border-[#013370]/30 text-[#013370] bg-[#013370]/5 whitespace-nowrap overflow-hidden text-ellipsis inline-block max-w-full"
                      >
                        {expenditure.item?.item || expenditure.item_id}
                      </Badge>
                      {expenditure.item?.group && (
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-full">
                          {expenditure.item.group}
                        </p>
                      )}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex-shrink-0 text-gray-400 hover:text-[#013370] transition-colors mt-0.5">
                          <Info className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="start">
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Item</p>
                            <p className="text-sm font-medium text-gray-900">
                              {expenditure.item?.item || expenditure.item_id}
                            </p>
                          </div>
                          {expenditure.item?.group && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Category</p>
                              <p className="text-sm text-gray-700">{expenditure.item.group}</p>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
                <TableCell className="px-4 font-semibold text-green-700">
                  ₦{expenditure.amount.toLocaleString()}
                </TableCell>
                <TableCell className="px-4">
                  <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-100 border-0">
                    {getMonthName(expenditure.month)} {expenditure.year}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 text-sm text-gray-600">
                  {expenditure.location.latitude.toFixed(4)}°,{" "}
                  {expenditure.location.longitude.toFixed(4)}°
                  {expenditure.added_by && (
                    <p className="text-xs text-gray-500 mt-1">
                      By: {expenditure.added_by.name}
                    </p>
                  )}
                </TableCell>
                <TableCell className="px-4 pr-6">
                  <EditExpenditureDialog expenditure={expenditure} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalItems={expenditures.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
