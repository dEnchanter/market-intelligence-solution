"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateExpenditure } from "@/hooks/use-household-expenditures";
import { useHouseholds } from "@/hooks/use-households";
import { useConsumptionItems } from "@/hooks/use-consumption-items";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const expenditureSchema = z.object({
  household_id: z.string().min(1, "Household is required"),
  item_id: z.string().min(1, "Consumption item is required"),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Amount must be a positive number"),
  month: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 1 && num <= 12;
  }, "Month must be between 1 and 12"),
  year: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 2000 && num <= 2100;
  }, "Please enter a valid year"),
  latitude: z.string().refine((val) => !isNaN(parseFloat(val)), "Must be a valid number"),
  longitude: z.string().refine((val) => !isNaN(parseFloat(val)), "Must be a valid number"),
});

type ExpenditureFormValues = z.infer<typeof expenditureSchema>;

export function AddExpenditureDialog() {
  const [open, setOpen] = useState(false);
  const createExpenditure = useCreateExpenditure();
  const { data: householdsData, isLoading: isLoadingHouseholds } = useHouseholds();
  const { data: itemsData, isLoading: isLoadingItems } = useConsumptionItems();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 0-indexed
  const currentYear = currentDate.getFullYear();

  const form = useForm<ExpenditureFormValues>({
    resolver: zodResolver(expenditureSchema),
    defaultValues: {
      household_id: "",
      item_id: "",
      amount: "",
      month: currentMonth.toString(),
      year: currentYear.toString(),
      latitude: "",
      longitude: "",
    },
  });

  // Auto-fill location when household is selected
  const selectedHouseholdId = form.watch("household_id");
  const selectedHousehold = householdsData?.data?.find(
    (h) => h.id === selectedHouseholdId
  );

  // Update location when household changes
  useState(() => {
    if (selectedHousehold?.location) {
      form.setValue("latitude", selectedHousehold.location.latitude.toString());
      form.setValue("longitude", selectedHousehold.location.longitude.toString());
    }
  });

  const onSubmit = (data: ExpenditureFormValues) => {
    createExpenditure.mutate(
      {
        household_id: data.household_id,
        item_id: data.item_id,
        amount: parseFloat(data.amount.replace(/,/g, "")),
        month: parseInt(data.month),
        year: parseInt(data.year),
        location: {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#013370] hover:bg-[#012a5c]">
          <Plus className="mr-2 h-4 w-4" />
          Record Expenditure
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Household Expenditure</DialogTitle>
          <DialogDescription>
            Record a consumption expenditure for a household.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Household Selection */}
            <FormField
              control={form.control}
              name="household_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Household</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const household = householdsData?.data?.find(h => h.id === value);
                      if (household?.location) {
                        form.setValue("latitude", household.location.latitude.toString());
                        form.setValue("longitude", household.location.longitude.toString());
                      }
                    }}
                    defaultValue={field.value}
                    disabled={isLoadingHouseholds}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select household" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingHouseholds ? (
                        <SelectItem value="loading" disabled>
                          Loading households...
                        </SelectItem>
                      ) : (
                        householdsData?.data?.map((household) => (
                          <SelectItem key={household.id} value={household.id!}>
                            {household.household_name} ({household.contact_name})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Consumption Item Selection */}
            <FormField
              control={form.control}
              name="item_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumption Item</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingItems}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select consumption item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingItems ? (
                        <SelectItem value="loading" disabled>
                          Loading items...
                        </SelectItem>
                      ) : (
                        itemsData?.data?.map((item) => (
                          <SelectItem key={item.id} value={item.id!}>
                            {item.item}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Spent (₦)</FormLabel>
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

            {/* Month and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter year"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Auto-filled from household"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Auto-filled from household"
                        {...field}
                      />
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
                onClick={() => setOpen(false)}
                disabled={createExpenditure.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createExpenditure.isPending}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                {createExpenditure.isPending ? "Recording..." : "Record Expenditure"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
