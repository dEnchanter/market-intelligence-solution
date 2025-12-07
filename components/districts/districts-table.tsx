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
import { District } from "@/lib/types/districts";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateDistrictDialog } from "./update-district-dialog";
import { MoreHorizontal, Pencil } from "lucide-react";

interface DistrictsTableProps {
  districts: District[];
}

export function DistrictsTable({ districts }: DistrictsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

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
    if (selectedRows.size === districts.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(districts.map((d) => d.id)));
    }
  };

  const handleEdit = (district: District) => {
    setEditingDistrict(district);
    setUpdateDialogOpen(true);
  };

  if (districts.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">No districts found</p>
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
                checked={selectedRows.size === districts.length}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="px-4">District Name</TableHead>
            <TableHead className="px-4">State</TableHead>
            <TableHead className="px-4">LGAs</TableHead>
            <TableHead className="w-16 pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {districts.map((district) => (
            <TableRow key={district.id}>
              <TableCell className="pl-6">
                <Checkbox
                  checked={selectedRows.has(district.id)}
                  onCheckedChange={() => toggleRow(district.id)}
                  aria-label={`Select ${district.name}`}
                />
              </TableCell>
              <TableCell className="font-medium px-4">{district.name}</TableCell>
              <TableCell className="px-4">
                <Badge
                  variant="outline"
                  className="font-normal border-[#013370]/30 text-[#013370] bg-[#013370]/5"
                >
                  {district.state.name}
                </Badge>
              </TableCell>
              <TableCell className="px-4">
                <div className="flex flex-wrap gap-1">
                  {district.lga.slice(0, 3).map((lga, index) => {
                    const colors = [
                      "bg-blue-100 text-blue-900 hover:bg-blue-100",
                      "bg-indigo-100 text-indigo-900 hover:bg-indigo-100",
                      "bg-cyan-100 text-cyan-900 hover:bg-cyan-100",
                    ];
                    return (
                      <Badge
                        key={lga.id}
                        className={`text-xs ${colors[index % colors.length]} border-0`}
                      >
                        {lga.name}
                      </Badge>
                    );
                  })}
                  {district.lga.length > 3 && (
                    <Badge className="text-xs bg-slate-100 text-slate-900 hover:bg-slate-100 border-0">
                      +{district.lga.length - 3} more
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="pr-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(district)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingDistrict && (
        <UpdateDistrictDialog
          district={editingDistrict}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />
      )}
    </div>
  );
}
