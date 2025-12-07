"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateDistrict } from "@/hooks/use-districts";
import { useStates, useDistrictLGAs } from "@/hooks/use-geo";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

const districtSchema = z.object({
  name: z.string().min(2, "District name must be at least 2 characters"),
  stateCode: z.string().min(1, "State is required"),
  senatorialDistrictId: z.string().min(1, "Senatorial district is required"),
  lgaIds: z.array(z.string()).min(1, "At least one LGA must be selected"),
});

type DistrictFormValues = z.infer<typeof districtSchema>;

export function AddDistrictDialog() {
  const [open, setOpen] = useState(false);
  const createDistrict = useCreateDistrict();
  const { data: statesData, isLoading: isLoadingStates } = useStates();

  const form = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      name: "",
      stateCode: "",
      senatorialDistrictId: "",
      lgaIds: [],
    },
  });

  const selectedStateCode = form.watch("stateCode");
  const selectedSenatorialDistrictId = form.watch("senatorialDistrictId");
  const selectedLgaIds = form.watch("lgaIds");

  // Get selected state
  const selectedState = useMemo(() => {
    if (!statesData?.data || !selectedStateCode) return null;
    return statesData.data.find((state) => state.code === selectedStateCode);
  }, [statesData, selectedStateCode]);

  // Get available senatorial districts from selected state
  const availableSenatorialDistricts = useMemo(() => {
    if (!selectedState) return [];
    return selectedState.districts;
  }, [selectedState]);

  // Get selected senatorial district
  const selectedSenatorialDistrict = useMemo(() => {
    if (!availableSenatorialDistricts || !selectedSenatorialDistrictId) return null;
    return availableSenatorialDistricts.find((d) => d.id === selectedSenatorialDistrictId);
  }, [availableSenatorialDistricts, selectedSenatorialDistrictId]);

  // Fetch LGAs for the selected senatorial district
  const { data: lgasData, isLoading: isLoadingLGAs } = useDistrictLGAs(
    selectedSenatorialDistrictId,
    !!selectedSenatorialDistrictId
  );

  // Auto-fill district name when senatorial district is selected
  useEffect(() => {
    if (selectedSenatorialDistrict) {
      form.setValue("name", selectedSenatorialDistrict.name);
    }
  }, [selectedSenatorialDistrict, form]);

  const onSubmit = (data: DistrictFormValues) => {
    if (!selectedState || !lgasData?.data) return;

    // Build State object
    const stateObj = {
      id: selectedState.id,
      name: selectedState.name,
    };

    // Build LGA array from selected LGAs
    const lgaArray = data.lgaIds
      .map((lgaId) => {
        const lga = lgasData.data.find((l) => l.id === lgaId);
        if (!lga) return null;
        return {
          id: lga.id,
          name: lga.name,
        };
      })
      .filter((lga) => lga !== null);

    createDistrict.mutate(
      {
        name: data.name,
        state: stateObj,
        lga: lgaArray,
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  const handleStateChange = (value: string) => {
    form.setValue("stateCode", value);
    form.setValue("senatorialDistrictId", ""); // Reset senatorial district when state changes
    form.setValue("lgaIds", []); // Reset LGAs when state changes
  };

  const handleSenatorialDistrictChange = (value: string) => {
    form.setValue("senatorialDistrictId", value);
    form.setValue("lgaIds", []); // Reset LGAs when senatorial district changes
  };

  const toggleLGA = (lgaId: string) => {
    const currentLGAs = form.getValues("lgaIds");
    if (currentLGAs.includes(lgaId)) {
      form.setValue(
        "lgaIds",
        currentLGAs.filter((id) => id !== lgaId)
      );
    } else {
      form.setValue("lgaIds", [...currentLGAs, lgaId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#013370] hover:bg-[#012a5c]">
          <Plus className="mr-2 h-4 w-4" />
          Add District
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New District</DialogTitle>
          <DialogDescription>
            Create a new district by selecting a state, senatorial district, and LGAs.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* State Selection */}
            <FormField
              control={form.control}
              name="stateCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={handleStateChange}
                    value={field.value}
                    disabled={isLoadingStates}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingStates ? (
                        <SelectItem value="loading" disabled>
                          Loading states...
                        </SelectItem>
                      ) : (
                        statesData?.data?.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Senatorial District Selection */}
            {selectedState && availableSenatorialDistricts.length > 0 && (
              <FormField
                control={form.control}
                name="senatorialDistrictId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senatorial District</FormLabel>
                    <Select
                      onValueChange={handleSenatorialDistrictChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select senatorial district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSenatorialDistricts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* District Name (auto-filled) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-filled from senatorial district" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LGA Selection */}
            {selectedSenatorialDistrictId && lgasData?.data && lgasData.data.length > 0 && (
              <FormField
                control={form.control}
                name="lgaIds"
                render={() => (
                  <FormItem>
                    <FormLabel>Select LGAs</FormLabel>
                    {isLoadingLGAs ? (
                      <div className="rounded-md border p-4 text-center text-sm text-gray-500">
                        Loading LGAs...
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto rounded-md border p-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {lgasData.data.map((lga) => (
                            <div
                              key={lga.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={lga.id}
                                checked={selectedLgaIds.includes(lga.id)}
                                onCheckedChange={() => toggleLGA(lga.id)}
                              />
                              <label
                                htmlFor={lga.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {lga.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createDistrict.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createDistrict.isPending}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                {createDistrict.isPending ? "Creating..." : "Create District"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
