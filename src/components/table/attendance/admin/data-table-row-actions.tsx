"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

// Define the interface for the data shape
interface AttendanceData {
  id: string | number; // Adjust type based on your data (string or number)
  // Add other properties if needed, e.g., name, date, etc.
}

interface DataTableRowActionsProps<TData extends AttendanceData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends AttendanceData>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="flex justify-end gap-2">
      <Link href={ row.getValue("attendance_type") === "On Time" || row.getValue("attendance_type") === "Late" ? `/dashboard/attendance/${row.original.id}?checkClock=true` : `/dashboard/attendance/${row.original.id}`}>
        <Button variant="ghost" size="icon">
          <EyeIcon className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      </Link>
    </div>
  );
}