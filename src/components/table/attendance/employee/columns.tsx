"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AttendanceAdmin } from "./schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  CircleX,
  Loader,
} from "lucide-react";

const approvalConfig = (approval?: AttendanceAdmin["approval"]) => {
  const statusConfig = {
    approve: {
      label: "Approve",
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
  } as const;

  const config = approval ? statusConfig[approval] : null;

  if (!config)
    return (
      <div className="flex w-[100px] items-center text-muted-foreground">-</div>
    );

  // Employee hanya lihat badge tanpa tombol
  return (
    <Badge variant="secondary" className={config.className}>
      <config.icon className="h-4 w-4 mr-1" />
      {config.label}
    </Badge>
  );
};

export const employeeColumns: ColumnDef<AttendanceAdmin>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{formattedDate}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "clockIn",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Clock In" />,
    cell: ({ row }) => (
      <div className="flex w-[100px] items-center">
        <span>{row.getValue("clockIn") ?? "-"}</span>
      </div>
    ),
  },
  {
    accessorKey: "clockOut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Clock Out" />,
    cell: ({ row }) => (
      <div className="flex w-[100px] items-center">
        <span>{row.getValue("clockOut") ?? "-"}</span>
      </div>
    ),
  },
  {
    accessorKey: "workHours",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Work Hours" />,
    cell: ({ row }) => (
      <div className="flex w-[100px] items-center">
        <span>
          {row.original.workHours
            ? `${row.original.workHours.hours}h ${row.original.workHours.minutes}m`
            : "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "attendanceType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attendance Type" />
    ),
    cell: ({ row }) => {
      const typeConfig = {
        ontime: { label: "On Time", className: "bg-primary-100 text-primary-500" },
        late: { label: "Late", className: "bg-amber-100 text-amber-500" },
        "sick leave": { label: "Sick Leave", className: "bg-gray-100 text-gray-950" },
        absent: { label: "Absent", className: "bg-gray-100 text-gray-950" },
        "annual leave": { label: "Annual Leave", className: "bg-gray-100 text-gray-950" },
      } as const;
      const config = typeConfig[row.original.attendanceType];
      return (
        <div className="flex w-[100px] items-center">
          <div className="capitalize">{config.label}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "approval",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Approval" />,
    cell: ({ row }) => {
      const status = row.original.approval;
      return (
        <div className="flex w-[140px] items-center">{approvalConfig(status)}</div>
      );
    },
  },
];
