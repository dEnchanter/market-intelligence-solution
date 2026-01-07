"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useImportConsumptionItems } from "@/hooks/use-consumption-items";
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

const createConsumptionItemSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  group: z.string().min(1, "Group is required"),
  class: z.string().min(1, "Class is required"),
  subclass: z.string().min(1, "Subclass is required"),
  durability: z.string().min(1, "Durability is required"),
  unit_of_measure: z.string().min(1, "Unit of measure is required"),
});

type CreateConsumptionItemFormValues = z.infer<typeof createConsumptionItemSchema>;

interface AddConsumptionItemDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddConsumptionItemDialog({
  open,
  onClose,
}: AddConsumptionItemDialogProps) {
  const importItems = useImportConsumptionItems();

  const form = useForm<CreateConsumptionItemFormValues>({
    resolver: zodResolver(createConsumptionItemSchema),
    defaultValues: {
      item: "",
      description: "",
      group: "",
      class: "",
      subclass: "",
      durability: "",
      unit_of_measure: "",
    },
  });

  const onSubmit = (data: CreateConsumptionItemFormValues) => {
    // Create a single item and submit via the import endpoint
    const newItem = {
      id: `temp-${Date.now()}`,
      item: data.item,
      description: data.description || "",
      group: data.group,
      class: data.class,
      subclass: data.subclass,
      durability: data.durability,
      unit_of_measure: data.unit_of_measure,
      IsActive: true,
    };

    importItems.mutate(
      { items: [newItem] },
      {
        onSuccess: () => {
          onClose();
          form.reset();
        },
      }
    );
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Consumption Item</DialogTitle>
          <DialogDescription>
            Create a new consumption item below.
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
                    <Input placeholder="e.g., Rice" {...field} />
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
                    <Input placeholder="e.g., Local rice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Food" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Grains" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subclass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subclass</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Rice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durability</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Non-durable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="unit_of_measure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measure</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={importItems.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={importItems.isPending}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                {importItems.isPending ? "Creating..." : "Create Item"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
