"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AttendanceRecord } from "./schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleX, Loader } from "lucide-react";
import { DataTableRowActions } from "./data-table-row-actions";

// Konfigurasi approval
type ApprovalStatus = "approved" | "rejected" | "waiting" | "pending";

const approvalConfig = (
  status: AttendanceRecord["approval"],
) => {
  const statusConfig = {
    approved: {
      label: "Approved",
      className: "bg-green-100 text-green-600",
      icon: CheckCircle2,
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-600",
      icon: CircleX,
    },
    waiting: {
      label: "Waiting",
      className: "bg-gray-100 text-gray-500",
      icon: Loader,
    },
    pending: {
      label: "Pending",
      className: "bg-gray-100 text-gray-500",
      icon: Loader,
    },
  } as const;


  // Handle null approval status
  if (status === null) {
    return (
      <div className="flex w-[100px] items-center">
        <span>-</span>
      </div>
    );
  }

  // Show status badge for approved/rejected
  const config = statusConfig[status as ApprovalStatus];
  if (config) {
    return (
      <Badge variant="secondary" className={config.className}>
        <config.icon className="h-4 w-4 mr-1" />
        {config.label}
      </Badge>
    );
  }

  return (
    <div className="flex w-[100px] items-center">
      <span>-</span>
    </div>
  );
};

export const employeeColumns: ColumnDef<AttendanceRecord>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = date.toLocaleDateString("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <div className="w-[140px]">{formatted}</div>;
    },
  },
  {
    accessorKey: "clock_in_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Clock In" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">{row.getValue("clock_in_time") ?? "-"}</div>
    ),
  },
  {
    accessorKey: "clock_out_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Clock Out" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">{row.getValue("clock_out_time") ?? "-"}</div>
    ),
  },
  {
    accessorKey: "work_hours",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Work Hours" />
    ),
    cell: ({ row }) => {
      const duration = row.getValue("work_hours") as string;
      return <div className="w-[120px]">{duration || "-"}</div>;
    },
  },

  {
    accessorKey: "attendance_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attendance Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("attendance_type") as string;
      const typeConfig: Record<string, { label: string; className: string }> = {
        "On Time": { label: "On Time", className: "bg-gray-100 text-gray-950" },
        "Late": { label: "Late", className: "bg-gray-100 text-gray-950" },
        "Sick Leave": { label: "Sick Leave", className: "bg-amber-100 text-amber-500" },
        "Absent": { label: "Absent", className: "bg-amber-100 text-amber-500" },
        "Annual Leave": { label: "Annual Leave", className: "bg-amber-100 text-amber-500" },
      };

      const config = typeConfig[type] || {
        label: type,
        className: "bg-gray-100 text-gray-800",
      };

      return (
        <Badge variant="secondary" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "approval",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approval" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">{approvalConfig(row.original.approval)}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />
    }
  }
];