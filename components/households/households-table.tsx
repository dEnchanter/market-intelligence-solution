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
import { Household } from "@/lib/types/households";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface HouseholdsTableProps {
  households: Household[];
}

export function HouseholdsTable({ households }: HouseholdsTableProps) {
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
    if (selectedRows.size === households.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(households.map((h) => h.id!)));
    }
  };

  if (households.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">No households found</p>
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
                checked={selectedRows.size === households.length}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="px-4">Household Name</TableHead>
            <TableHead className="px-4">Contact Info</TableHead>
            <TableHead className="px-4">LGA</TableHead>
            <TableHead className="px-4">Town</TableHead>
            <TableHead className="px-4 pr-6">Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {households.map((household) => (
            <TableRow key={household.id}>
              <TableCell className="pl-6">
                <Checkbox
                  checked={selectedRows.has(household.id!)}
                  onCheckedChange={() => toggleRow(household.id!)}
                  aria-label={`Select ${household.household_name}`}
                />
              </TableCell>
              <TableCell className="font-medium px-4">
                {household.household_name}
              </TableCell>
              <TableCell className="px-4">
                {household.contact_name}
                <p className="text-xs text-gray-500 mt-0.5">
                  {household.contact_phone}
                </p>
              </TableCell>
              <TableCell className="px-4">
                <Badge
                  variant="outline"
                  className="font-normal border-[#013370]/30 text-[#013370] bg-[#013370]/5"
                >
                  {household.lga}
                </Badge>
              </TableCell>
              <TableCell className="px-4">
                <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-100 border-0">
                  {household.town}
                </Badge>
              </TableCell>
              <TableCell className="px-4 pr-6 max-w-xs truncate">
                {household.address}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
