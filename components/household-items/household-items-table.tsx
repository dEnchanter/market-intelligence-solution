"use client";

import { useState, useMemo } from "react";
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
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { EditHouseholdItemDialog } from "./edit-household-item-dialog";
import { useDeleteHouseholdItem } from "@/hooks/use-household-items";
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

interface HouseholdItemsTableProps {
  items: HouseholdItem[];
}

export function HouseholdItemsTable({ items }: HouseholdItemsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingItem, setEditingItem] = useState<HouseholdItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<HouseholdItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteHouseholdItem = useDeleteHouseholdItem();

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

  // Calculate paginated data
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Reset to page 1 when items change
  useMemo(() => {
    setCurrentPage(1);
  }, [items.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleEdit = (item: HouseholdItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (item: HouseholdItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      deleteHouseholdItem.mutate(deletingItem.id, {
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
            <TableHead className="px-4">Status</TableHead>
            <TableHead className="px-4 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((item) => (
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
      <Pagination
        currentPage={currentPage}
        totalItems={items.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {editingItem && (
        <EditHouseholdItemDialog
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
              This will permanently delete the household item &quot;{deletingItem?.item}&quot;.
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
              disabled={deleteHouseholdItem.isPending}
            >
              {deleteHouseholdItem.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
