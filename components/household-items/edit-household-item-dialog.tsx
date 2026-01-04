"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateHouseholdItem } from "@/hooks/use-household-items";
import { HouseholdItem } from "@/lib/types/household-items";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const updateHouseholdItemSchema = z.object({
  group: z.string().min(1, "Group is required"),
  item: z.string().min(1, "Item name is required"),
});

type UpdateHouseholdItemFormValues = z.infer<typeof updateHouseholdItemSchema>;

interface EditHouseholdItemDialogProps {
  item: HouseholdItem;
  open: boolean;
  onClose: () => void;
}

export function EditHouseholdItemDialog({
  item,
  open,
  onClose,
}: EditHouseholdItemDialogProps) {
  const updateItem = useUpdateHouseholdItem();

  const form = useForm<UpdateHouseholdItemFormValues>({
    resolver: zodResolver(updateHouseholdItemSchema),
    defaultValues: {
      group: item.group || "",
      item: item.item || "",
    },
  });

  // Reset form when item changes
  useEffect(() => {
    form.reset({
      group: item.group || "",
      item: item.item || "",
    });
  }, [item, form]);

  const onSubmit = (data: UpdateHouseholdItemFormValues) => {
    if (!item.id) return;

    updateItem.mutate(
      { id: item.id, data },
      {
        onSuccess: () => {
          onClose();
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Household Item</DialogTitle>
          <DialogDescription>
            Update the household item details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateItem.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateItem.isPending}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                {updateItem.isPending ? "Updating..." : "Update Item"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
