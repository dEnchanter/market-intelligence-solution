"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Pencil } from "lucide-react";
import { useUpdateExpenditure } from "@/hooks/use-household-expenditures";
import { HouseholdExpenditure } from "@/lib/types/household-expenditures";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
});

type FormData = z.infer<typeof formSchema>;

interface EditExpenditureDialogProps {
  expenditure: HouseholdExpenditure;
}

export function EditExpenditureDialog({
  expenditure,
}: EditExpenditureDialogProps) {
  const [open, setOpen] = useState(false);
  const updateExpenditure = useUpdateExpenditure();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: expenditure.amount.toLocaleString("en-US"),
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      await updateExpenditure.mutateAsync({
        id: expenditure.id,
        data: {
          amount: parseFloat(values.amount.replace(/,/g, "")),
        },
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Expenditure</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Item Name</FormLabel>
              <Input
                type="text"
                value={expenditure.item?.item || "N/A"}
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (NGN)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, "");
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                          field.onChange(formatted);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateExpenditure.isPending}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                {updateExpenditure.isPending ? "Updating..." : "Update Amount"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
