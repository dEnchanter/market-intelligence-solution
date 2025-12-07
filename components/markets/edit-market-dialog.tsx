"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useUpdateMarket } from "@/hooks/use-markets";
import { Market } from "@/lib/types/markets";

const formSchema = z.object({
  name: z.string().min(1, "Market name is required"),
  type: z.string().min(1, "Market type is required"),
  town: z.string().min(1, "Town is required"),
});

type FormData = z.infer<typeof formSchema>;

interface EditMarketDialogProps {
  market: Market | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMarketDialog({
  market,
  open,
  onOpenChange,
}: EditMarketDialogProps) {
  const updateMarket = useUpdateMarket();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      town: "",
    },
  });

  useEffect(() => {
    if (market) {
      form.reset({
        name: market.name,
        type: market.type,
        town: market.town,
      });
    }
  }, [market, form]);

  const onSubmit = async (values: FormData) => {
    if (!market?.id) return;

    try {
      await updateMarket.mutateAsync({
        id: market.id,
        data: values,
      });
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Market</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter market name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter market type" {...field} />
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

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMarket.isPending}
                className="bg-[#013370] hover:bg-[#012a5c]"
              >
                {updateMarket.isPending ? "Updating..." : "Update Market"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
