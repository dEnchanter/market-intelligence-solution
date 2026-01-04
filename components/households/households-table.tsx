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
import { Household } from "@/lib/types/households";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditHouseholdDialog } from "./edit-household-dialog";

interface HouseholdsTableProps {
  households: Household[];
}

export function HouseholdsTable({ households }: HouseholdsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  // Calculate paginated data
  const paginatedHouseholds = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return households.slice(startIndex, endIndex);
  }, [households, currentPage, itemsPerPage]);

  // Reset to page 1 when households change
  useMemo(() => {
    setCurrentPage(1);
  }, [households.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleEdit = (household: Household) => {
    setEditingHousehold(household);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingHousehold(null);
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
            <TableHead className="px-4">Address</TableHead>
            <TableHead className="px-4 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedHouseholds.map((household) => (
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
              <TableCell className="px-4 max-w-xs truncate">
                {household.address}
              </TableCell>
              <TableCell className="px-4 pr-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(household)}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalItems={households.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {editingHousehold && (
        <EditHouseholdDialog
          household={editingHousehold}
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
        />
      )}
    </div>
  );
}
