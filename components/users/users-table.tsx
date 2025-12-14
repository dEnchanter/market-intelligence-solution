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
import { User } from "@/lib/types/users";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, KeyRound } from "lucide-react";
import { EditUserDialog } from "./edit-user-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editUser, setEditUser] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
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
    if (selectedRows.size === users.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(users.map((u) => u.id).filter((id): id is string => id !== undefined)));
    }
  };

  // Calculate paginated data
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  }, [users, currentPage, itemsPerPage]);

  // Reset to page 1 when users change
  useMemo(() => {
    setCurrentPage(1);
  }, [users.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 pl-6">
                <Checkbox
                  checked={selectedRows.size === users.length}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="px-4">Name</TableHead>
              <TableHead className="px-4">Email</TableHead>
              <TableHead className="px-4">Phone</TableHead>
              <TableHead className="px-4">Profile Type</TableHead>
              <TableHead className="px-4">Address</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="pr-8 w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.filter(user => user.id).map((user) => (
              <TableRow key={user.id!}>
                <TableCell className="pl-6">
                  <Checkbox
                    checked={selectedRows.has(user.id!)}
                    onCheckedChange={() => toggleRow(user.id!)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium px-4">{user.name}</TableCell>
                <TableCell className="px-4">{user.email}</TableCell>
                <TableCell className="px-4">{user.phone}</TableCell>
                <TableCell className="px-4">
                  <Badge
                    variant="outline"
                    className="font-normal border-[#013370]/30 text-[#013370] bg-[#013370]/5"
                  >
                    {user.ProfileType}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 max-w-xs truncate">{user.address}</TableCell>
                <TableCell className="px-4">
                  {user.IsActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="pr-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setResetPasswordUser(user)}>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Reset Password
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
          totalItems={users.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Dialogs */}
      {editUser && (
        <EditUserDialog
          user={editUser}
          open={!!editUser}
          onClose={() => setEditUser(null)}
        />
      )}
      {resetPasswordUser && (
        <ResetPasswordDialog
          user={resetPasswordUser}
          open={!!resetPasswordUser}
          onClose={() => setResetPasswordUser(null)}
        />
      )}
    </>
  );
}
