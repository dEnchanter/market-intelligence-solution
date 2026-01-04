"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateConsumptionItem } from "@/hooks/use-consumption-items";
import { ConsumptionItem } from "@/lib/types/consumption-items";
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

const updateConsumptionItemSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  description: z.string().optional().or(z.literal("")),
  unit_of_measure: z.string().min(1, "Unit of measure is required"),
});

type UpdateConsumptionItemFormValues = z.infer<typeof updateConsumptionItemSchema>;

interface EditConsumptionItemDialogProps {
  item: ConsumptionItem;
  open: boolean;
  onClose: () => void;
}

export function EditConsumptionItemDialog({
  item,
  open,
  onClose,
}: EditConsumptionItemDialogProps) {
  const updateItem = useUpdateConsumptionItem();

  const form = useForm<UpdateConsumptionItemFormValues>({
    resolver: zodResolver(updateConsumptionItemSchema),
    defaultValues: {
      item: item.item || "",
      description: item.description || "",
      unit_of_measure: item.unit_of_measure || "",
    },
  });

  // Reset form when item changes
  useEffect(() => {
    form.reset({
      item: item.item || "",
      description: item.description || "",
      unit_of_measure: item.unit_of_measure || "",
    });
  }, [item, form]);

  const onSubmit = (data: UpdateConsumptionItemFormValues) => {
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
          <DialogTitle>Edit Consumption Item</DialogTitle>
          <DialogDescription>
            Update the consumption item details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter item description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit_of_measure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measure</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., kg, liters, pieces" {...field} />
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
