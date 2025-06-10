"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

// Define the interface for the data shape
interface AttendanceData {
  id: string | number;
  date: string | number; // Adjust type based on your data (string or number)
  // Add other properties if needed, e.g., name, date, etc.
}

interface DataTableRowActionsProps<TData extends AttendanceData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends AttendanceData>({
  row,
}: DataTableRowActionsProps<TData>) {
  console.log("Row data:", row.original);
  return (
    <div className="flex justify-end gap-2">
      <Link href={`/dashboard/attendance/${row.original.date}`}>
        <Button variant="ghost" size="icon">
          <EyeIcon className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      </Link>
    </div>
  );
}