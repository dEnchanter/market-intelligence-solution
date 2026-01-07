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
import { ConsumptionItem } from "@/lib/types/consumption-items";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { EditConsumptionItemDialog } from "./edit-consumption-item-dialog";
import { useDeleteConsumptionItem } from "@/hooks/use-consumption-items";
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

interface ConsumptionItemsTableProps {
  items: ConsumptionItem[];
}

export function ConsumptionItemsTable({ items }: ConsumptionItemsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState<ConsumptionItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ConsumptionItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const itemsPerPage = 10;

  const deleteConsumptionItem = useDeleteConsumptionItem();

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

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
    if (selectedRows.size === currentItems.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentItems.map((item) => item.id)));
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleEdit = (item: ConsumptionItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (item: ConsumptionItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      deleteConsumptionItem.mutate(deletingItem.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeletingItem(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">No consumption items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 pl-6">
                <Checkbox
                  checked={selectedRows.size === currentItems.length && currentItems.length > 0}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="px-4">Item</TableHead>
              <TableHead className="px-4">Group</TableHead>
              <TableHead className="px-4">Class</TableHead>
              <TableHead className="px-4">Subclass</TableHead>
              <TableHead className="px-4">Unit of Measure</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="px-4 pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="pl-6">
                <Checkbox
                  checked={selectedRows.has(item.id)}
                  onCheckedChange={() => toggleRow(item.id)}
                  aria-label={`Select ${item.item}`}
                />
              </TableCell>
              <TableCell className="font-medium px-4">
                <div>
                  <div>{item.item}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-4">
                <Badge
                  variant="outline"
                  className="font-normal border-[#013370]/30 text-[#013370] bg-[#013370]/5"
                >
                  {item.group}
                </Badge>
              </TableCell>
              <TableCell className="px-4">
                <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-100 border-0">
                  {item.class}
                </Badge>
              </TableCell>
              <TableCell className="px-4">
                <Badge className="bg-indigo-100 text-indigo-900 hover:bg-indigo-100 border-0">
                  {item.subclass}
                </Badge>
              </TableCell>
              <TableCell className="px-4">
                <Badge className="bg-purple-100 text-purple-900 hover:bg-purple-100 border-0">
                  {item.unit_of_measure}
                </Badge>
              </TableCell>
              <TableCell className="px-4">
                {item.IsActive ? (
                  <Badge className="bg-green-100 text-green-900 hover:bg-green-100 border-0">
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-900 hover:bg-gray-100 border-0">
                    Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell className="px-4 pr-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {/* Pagination Controls */}
    <div className="flex items-center justify-between rounded-lg border bg-white px-6 py-4">
      <div className="text-sm text-gray-600">
        Showing {startIndex + 1} to {Math.min(endIndex, items.length)} of{" "}
        {items.length} items
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>

    {editingItem && (
      <EditConsumptionItemDialog
        item={editingItem}
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    )}

    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the consumption item &quot;{deletingItem?.item}&quot;.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelDelete}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteConsumptionItem.isPending}
          >
            {deleteConsumptionItem.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
  );
}
