"use client";

import { AppLayout } from "@/components/app-layout";
import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { AddUserDialog } from "@/components/users/add-user-dialog";
import { UsersTable } from "@/components/users/users-table";
import { useUsers } from "@/hooks/use-users";
import { Loader2 } from "lucide-react";

export default function UsersPage() {
  const { data, isLoading, error } = useUsers();

  return (
    <AppLayout>
      <MaxWidthWrapper>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-gray-600">
                Manage user accounts and permissions
              </p>
            </div>
            <AddUserDialog />
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
              <p className="mt-2 text-3xl font-bold text-[#013370]">
                {data?.data?.length || 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {data?.data?.filter((user) => user.IsActive).length || 0}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Inactive Users</h3>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {data?.data?.filter((user) => !user.IsActive).length || 0}
              </p>
            </div>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border bg-white p-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#013370]" />
                <p className="text-sm text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-red-600">
                {error instanceof Error ? error.message : "Failed to load users"}
              </p>
            </div>
          ) : (
            <UsersTable users={data?.data || []} />
          )}
        </div>
      </MaxWidthWrapper>
    </AppLayout>
  );
}
