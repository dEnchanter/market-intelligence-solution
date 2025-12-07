"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateHousehold } from "@/hooks/use-households";
import { useDistricts } from "@/hooks/use-districts";
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

const householdSchema = z.object({
  household_name: z.string().min(2, "Household name must be at least 2 characters"),
  contact_name: z.string().min(2, "Contact name must be at least 2 characters"),
  contact_phone: z.string().min(10, "Phone number must be at least 10 digits"),
  district_id: z.string().min(1, "District is required"),
  lga: z.string().min(1, "LGA is required"),
  town: z.string().min(1, "Town is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  latitude: z.string().refine((val) => !isNaN(parseFloat(val)), "Must be a valid number"),
  longitude: z.string().refine((val) => !isNaN(parseFloat(val)), "Must be a valid number"),
});

type HouseholdFormValues = z.infer<typeof householdSchema>;

export function AddHouseholdDialog() {
  const [open, setOpen] = useState(false);
  const createHousehold = useCreateHousehold();
  const { data: districtsData, isLoading: isLoadingDistricts } = useDistricts();

  const form = useForm<HouseholdFormValues>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      household_name: "",
      contact_name: "",
      contact_phone: "",
      district_id: "",
      lga: "",
      town: "",
      address: "",
      latitude: "",
      longitude: "",
    },
  });

  const selectedDistrictId = form.watch("district_id");
  const selectedDistrict = districtsData?.data?.find(
    (d) => d.id === selectedDistrictId
  );

  const onSubmit = (data: HouseholdFormValues) => {
    createHousehold.mutate(
      {
        household_name: data.household_name,
        contact_name: data.contact_name,
        contact_phone: data.contact_phone,
        district_id: data.district_id,
        lga: data.lga,
        town: data.town,
        address: data.address,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#013370] hover:bg-[#012a5c]">
          <Plus className="mr-2 h-4 w-4" />
          Add Household
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Household</DialogTitle>
          <DialogDescription>
            Create a new household record with contact and location information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Household Name */}
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

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* District Selection */}
            <FormField
              control={form.control}
              name="district_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingDistricts}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingDistricts ? (
                        <SelectItem value="loading" disabled>
                          Loading districts...
                        </SelectItem>
                      ) : (
                        districtsData?.data?.filter(district => district.id).map((district) => (
                          <SelectItem key={district.id!} value={district.id!}>
                            {district.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LGA and Town */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LGA</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedDistrict}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select LGA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedDistrict?.lga?.map((lga) => (
                          <SelectItem key={lga.id} value={lga.name}>
                            {lga.name}
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

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        placeholder="Enter latitude"
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
                        placeholder="Enter longitude"
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
                disabled={createHousehold.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createHousehold.isPending}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                {createHousehold.isPending ? "Creating..." : "Create Household"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
