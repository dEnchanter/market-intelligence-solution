"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateHousehold } from "@/hooks/use-households";
import { Household } from "@/lib/types/households";
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

const updateHouseholdSchema = z.object({
  household_name: z.string().min(1, "Household name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_phone: z.string().min(1, "Contact phone is required"),
  town: z.string().min(1, "Town is required"),
});

type UpdateHouseholdFormValues = z.infer<typeof updateHouseholdSchema>;

interface EditHouseholdDialogProps {
  household: Household;
  open: boolean;
  onClose: () => void;
}

export function EditHouseholdDialog({
  household,
  open,
  onClose,
}: EditHouseholdDialogProps) {
  const updateHousehold = useUpdateHousehold();

  const form = useForm<UpdateHouseholdFormValues>({
    resolver: zodResolver(updateHouseholdSchema),
    defaultValues: {
      household_name: household.household_name || "",
      contact_name: household.contact_name || "",
      contact_phone: household.contact_phone || "",
      town: household.town || "",
    },
  });

  // Reset form when household changes
  useEffect(() => {
    form.reset({
      household_name: household.household_name || "",
      contact_name: household.contact_name || "",
      contact_phone: household.contact_phone || "",
      town: household.town || "",
    });
  }, [household, form]);

  const onSubmit = (data: UpdateHouseholdFormValues) => {
    if (!household.id) return;

    updateHousehold.mutate(
      { id: household.id, data },
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
          <DialogTitle>Edit Household</DialogTitle>
          <DialogDescription>
            Update the household details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="household_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Household Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter household name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="town"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Town</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter town" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateHousehold.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateHousehold.isPending}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                {updateHousehold.isPending ? "Updating..." : "Update Household"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
