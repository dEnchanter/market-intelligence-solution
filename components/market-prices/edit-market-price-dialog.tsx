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
import { useUpdateMarketPrice } from "@/hooks/use-market-prices";
import { MarketPrice } from "@/lib/types/market-prices";

const formSchema = z.object({
  price: z.string().min(1, "Price is required"),
  volume: z.string().min(1, "Volume is required"),
});

type FormData = z.infer<typeof formSchema>;

interface EditMarketPriceDialogProps {
  marketPrice: MarketPrice;
}

export function EditMarketPriceDialog({
  marketPrice,
}: EditMarketPriceDialogProps) {
  const [open, setOpen] = useState(false);
  const updatePrice = useUpdateMarketPrice();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: marketPrice.price.toLocaleString("en-US"),
      volume: "1",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      await updatePrice.mutateAsync({
        id: marketPrice.id,
        data: {
          price: parseFloat(values.price.replace(/,/g, "")),
          volume: parseFloat(values.volume),
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
          <DialogTitle>Edit Market Price</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (NGN)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter price"
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

            <FormField
              control={form.control}
              name="volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volume</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter volume"
                      {...field}
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
                disabled={updatePrice.isPending}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                {updatePrice.isPending ? "Updating..." : "Update Price"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
