"use client";

import { useState } from "react";
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

interface ExpendituresTableProps {
  expenditures: HouseholdExpenditure[];
}

export function ExpendituresTable({ expenditures }: ExpendituresTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

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
            <TableHead className="px-4">Item</TableHead>
            <TableHead className="px-4">Amount</TableHead>
            <TableHead className="px-4">Period</TableHead>
            <TableHead className="px-4 pr-6">Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenditures.map((expenditure) => {
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
                <TableCell className="px-4">
                  <Badge
                    variant="outline"
                    className="font-normal border-[#013370]/30 text-[#013370] bg-[#013370]/5"
                  >
                    {expenditure.item?.item || expenditure.item_id}
                  </Badge>
                  {expenditure.item?.group && (
                    <p className="text-xs text-gray-500 mt-1">
                      {expenditure.item.group}
                    </p>
                  )}
                </TableCell>
                <TableCell className="px-4 font-semibold text-green-700">
                  ₦{expenditure.amount.toLocaleString()}
                </TableCell>
                <TableCell className="px-4">
                  <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-100 border-0">
                    {getMonthName(expenditure.month)} {expenditure.year}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 pr-6 text-sm text-gray-600">
                  {expenditure.location.latitude.toFixed(4)}°,{" "}
                  {expenditure.location.longitude.toFixed(4)}°
                  {expenditure.added_by && (
                    <p className="text-xs text-gray-500 mt-1">
                      By: {expenditure.added_by.name}
                    </p>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
