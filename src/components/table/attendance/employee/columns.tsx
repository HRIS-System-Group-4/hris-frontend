"use client";

import { ColumnDef } from "@tanstack/react-table";
<<<<<<< Updated upstream
import { AttendanceAdmin } from "./schema";
=======
import { AttendanceEmployee } from "./schema"
>>>>>>> Stashed changes
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  CircleX,
  Loader,
} from "lucide-react";

<<<<<<< Updated upstream
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
=======
const approvalConfig = (approval?: AttendanceEmployee["approval"]) => {
    const statusConfig = {
        "approve": { label: "Approved", className: "bg-green-100 text-green-600", icon: CheckCircle2 },
        "rejected": { label: "Rejected", className: "bg-red-100 text-red-600", icon: CircleX },
        "waiting": { label: "Waiting", className: "bg-amber-100 text-amber-500", icon: Loader },
    } as const

    const config = approval ? statusConfig[approval] : null

    if (!config) return (
        <div>
            <div className="flex w-[100px] items-center">
                -
            </div>
        </div>
    );

>>>>>>> Stashed changes

  if (!config)
    return (
      <div className="flex w-[100px] items-center text-muted-foreground">-</div>
    );

<<<<<<< Updated upstream
  // Employee hanya lihat badge tanpa tombol
  return (
    <Badge variant="secondary" className={config.className}>
      <config.icon className="h-4 w-4 mr-1" />
      {config.label}
    </Badge>
  );
};
=======
export const columns: ColumnDef<AttendanceEmployee>[] = [
    // {
    //     accessorKey: "name",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Employee Name" />
    //     ),
    //     cell: ({ row }) => (
    //         <div className="flex items-center gap-2">
    //             <Avatar className="h-8 w-8">
    //                 <AvatarImage
    //                     src={row.original.employee.avatar || "/placeholder.svg"}
    //                     alt={`${row.original.employee.firstName} ${row.original.employee.lastName}`}
    //                 />
    //                 <AvatarFallback>
    //                     {row.original.employee.firstName[0]}
    //                     {row.original.employee.lastName[0]}
    //                 </AvatarFallback>
    //             </Avatar>
    //             <div>
    //                 <div className="font-medium">
    //                     {row.original.employee.firstName} {row.original.employee.lastName}
    //                 </div>
    //                 <div className="text-xs text-muted-foreground">{row.original.employee.email}</div>
    //             </div>
    //         </div>
    //     ),
    //     filterFn: (row, _columnId, filterValue) => {
    //         const firstName = row.original.employee.firstName.toLowerCase();
    //         const lastName = row.original.employee.lastName.toLowerCase();
    //         const fullName = `${firstName} ${lastName}`;
    //         return fullName.includes(filterValue.toLowerCase());
    //     },
    //     enableSorting: false,
    //     enableHiding: false
    // },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"));
            const formattedDate = date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize">{formattedDate}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            const rowDate = new Date(row.getValue(id));
            const [startDate, endDate] = value;
            return rowDate >= startDate && rowDate <= endDate;
        }
    },
    {
        accessorKey: "clockIn",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Clock In" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize"> {row.getValue("clockIn") ?? "-"}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "clockOut",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Clock Out" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize"> {row.getValue("clockOut") ?? "-"}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "workHours",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Work Hours" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className=""> {row.original.workHours ? `${row.original.workHours.hours}h ${row.original.workHours.minutes}m` : "-"}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "attendanceType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Attendance Type" />
        ),
        cell: ({ row }) => {
            const typeConfig = {
                "ontime": { label: "On Time", className: "bg-primary-100 text-primary-500" },
                "late": { label: "Late", className: "bg-amber-100 text-amber-500" },
                "sick leave": { label: "Sick Leave", className: "bg-gray-100 text-gray-950" },
                "absent": { label: "Absent", className: "bg-gray-100 text-gray-950" },
                "annual leave": { label: "Annual Leave", className: "bg-gray-100 text-gray-950" },
            } as const
            const config = typeConfig[row.original.attendanceType]
            return (
                <div className="flex w-[100px] items-center">
                    {/* <Badge variant={"secondary"} className={config.className}>
                        {config.label}</Badge> */}
                    <div className="capitalize">{config.label}</div>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "approval",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Approval" />
        ),
        cell: ({ row }) => {
            const status = row.original.approval
            const statusConfig = {
                "approve": { label: "Approve", className: "bg-green-100 text-green-500", icon: Check },
                "rejected": { label: "Rejected", className: "bg-red-100 text-red-500", icon: X },
                "waiting": { label: "Waiting", className: "bg-gray-100 text-gray-500", icon: Loader },
            } as const
>>>>>>> Stashed changes

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
