"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateHouseholdItem } from "@/hooks/use-household-items";
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

const createHouseholdItemSchema = z.object({
  group: z.string().min(1, "Group is required"),
  item: z.string().min(1, "Item name is required"),
});

type CreateHouseholdItemFormValues = z.infer<typeof createHouseholdItemSchema>;

interface AddHouseholdItemDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddHouseholdItemDialog({
  open,
  onClose,
}: AddHouseholdItemDialogProps) {
  const createItem = useCreateHouseholdItem();

  const form = useForm<CreateHouseholdItemFormValues>({
    resolver: zodResolver(createHouseholdItemSchema),
    defaultValues: {
      group: "",
      item: "",
    },
  });

  const onSubmit = (data: CreateHouseholdItemFormValues) => {
    createItem.mutate(data, {
      onSuccess: () => {
        onClose();
        form.reset();
      },
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Household Item</DialogTitle>
          <DialogDescription>
            Create a new household item below.
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
                onClick={handleClose}
                disabled={createItem.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createItem.isPending}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                {createItem.isPending ? "Creating..." : "Create Item"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
