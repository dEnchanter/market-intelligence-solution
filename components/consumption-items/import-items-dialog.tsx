"use client";

import { useState } from "react";
import { useImportConsumptionItems } from "@/hooks/use-consumption-items";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { ConsumptionItem } from "@/lib/types/consumption-items";

export function ImportItemsDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<ConsumptionItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const importItems = useImportConsumptionItems();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    // Read and parse CSV file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsedItems = parseCSV(text);
        setItems(parsedItems);
      } catch (err) {
        setError("Failed to parse CSV file. Please check the format.");
        setItems([]);
      }
    };
    reader.readAsText(selectedFile);
  };

  const parseCSV = (text: string): ConsumptionItem[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error("CSV file is empty or invalid");
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const items: ConsumptionItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const item: any = {};

      headers.forEach((header, index) => {
        // Map CSV headers to object properties
        const key = header.replace(/\s+/g, "_");
        item[key] = values[index] || "";
      });

      items.push({
        id: item.id || `temp-${i}`,
        item: item.item || "",
        description: item.description || "",
        group: item.group || "",
        class: item.class || "",
        subclass: item.subclass || "",
        durability: item.durability || "",
        unit_of_measure: item.unit_of_measure || "",
      });
    }

    return items;
  };

  const handleImport = () => {
    if (items.length === 0) {
      setError("No items to import");
      return;
    }

    importItems.mutate(
      { items },
      {
        onSuccess: () => {
          setOpen(false);
          setFile(null);
          setItems([]);
          setError(null);
        },
      }
    );
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const headers = [
      "id",
      "item",
      "description",
      "group",
      "class",
      "subclass",
      "durability",
      "unit_of_measure",
    ];

    const sampleData = [
      [
        "1",
        "Rice",
        "Local rice",
        "Food",
        "Grains",
        "Rice",
        "Non-durable",
        "kg",
      ],
      [
        "2",
        "Beans",
        "Brown beans",
        "Food",
        "Legumes",
        "Beans",
        "Non-durable",
        "kg",
      ],
    ];

    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) => row.join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "consumption_items_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#013370] hover:bg-[#012a5c]">
          <Upload className="mr-2 h-4 w-4" />
          Import Items
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Consumption Items</DialogTitle>
          <DialogDescription>
            Upload a CSV file with consumption items data. The file should
            include columns: id, item, description, group, class, subclass,
            durability, unit_of_measure.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template Button */}
          <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Need a template?
                </h4>
                <p className="text-xs text-blue-700">
                  Download our CSV template with sample data to get started
                  quickly.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>

          {/* File Input */}
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select CSV File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-[#013370] file:text-white
                hover:file:bg-[#012a5c]
                cursor-pointer"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Preview */}
          {items.length > 0 && (
            <div className="rounded-md bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                <strong>{items.length}</strong> items ready to import
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setFile(null);
                setItems([]);
                setError(null);
              }}
              disabled={importItems.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleImport}
              disabled={importItems.isPending || items.length === 0}
              className="bg-[#013370] hover:bg-[#012a5c]"
            >
              {importItems.isPending ? "Importing..." : "Import Items"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
