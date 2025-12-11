"use client";

import { useState } from "react";
import { HouseholdItem } from "@/lib/types/household-items";
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

interface HouseholdItemsTableProps {
  items: HouseholdItem[];
}

export function HouseholdItemsTable({ items }: HouseholdItemsTableProps) {
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
    if (selectedRows.size === items.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(items.map((item) => item.id)));
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <p className="text-gray-600">No household items found</p>
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
                checked={selectedRows.size === items.length}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="px-4">Group</TableHead>
            <TableHead className="px-4">Item</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="pl-6">
                <Checkbox
                  checked={selectedRows.has(item.id)}
                  onCheckedChange={() => toggleRow(item.id)}
                  aria-label={`Select ${item.item}`}
                />
              </TableCell>
              <TableCell className="px-4">
                <Badge className="bg-purple-100 text-purple-900 hover:bg-purple-100 border-0">
                  {item.group}
                </Badge>
              </TableCell>
              <TableCell className="font-medium px-4">{item.item}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
