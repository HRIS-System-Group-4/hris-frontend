"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AttendanceAdmin } from "./schema"
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { TrendingUp, TrendingDown, Check, Cross, Loader, X, CheckCircle2, CircleX, EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const approvalConfig = (approval?: AttendanceAdmin["approval"]) => {
    const statusConfig = {
        "approve": { label: "Approve", className: "bg-green-100 text-green-600", icon: CheckCircle2 },
        "rejected": { label: "Rejected", className: "bg-red-100 text-red-600", icon: CircleX },
        "waiting": { label: "Waiting", className: "bg-gray-100 text-gray-500", icon: Loader },
    } as const

    const config = approval ? statusConfig[approval] : null

    if (!config) return (
        <div>
            <div className="flex w-[100px] items-center">
                -
            </div>
        </div>
    );

    if (approval === "waiting") return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size={"sm"} className="bg-green-600 text-white hover:bg-green-700 hover:text-white">
                <Check className="h-4 w-4" />
                Approve
            </Button>
            <Button variant="ghost" size={"icon"} className="bg-neutral-100 text-red-600 hover:bg-neutral-200 hover:text-red-600">
                <X className="h-4 w-4" />
            </Button>
            {/* <Button size={"sm"} asChild className="shadow-none hover:bg-primary" variant={"ghost"}>
                <Badge variant={"secondary"} className={"bg-green-100 text-green-500"}>
                    Approve</Badge>
            </Button>
            <Button size={"sm"} asChild className="shadow-none hover:bg-primary" variant={"ghost"}>
                <Badge variant={"secondary"} className={"bg-neutral-100 text-neutral-500"}>
                    <X className="h-4 w-4" />
                </Badge>
            </Button> */}
        </div>
    );

    return (
        <Badge variant={"secondary"} className={config.className} >
            <config.icon className={"h-4 w-4"} />
            {config.label}</Badge>
    );
}

export const columns: ColumnDef<AttendanceAdmin>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Employee Name" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={row.original.employee.avatar || "/placeholder.svg"}
                        alt={`${row.original.employee.firstName} ${row.original.employee.lastName}`}
                    />
                    <AvatarFallback>
                        {row.original.employee.firstName[0]}
                        {row.original.employee.lastName[0]}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">
                        {row.original.employee.firstName} {row.original.employee.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{row.original.employee.email}</div>
                </div>
            </div>
        ),
        filterFn: (row, _columnId, filterValue) => {
            const firstName = row.original.employee.firstName.toLowerCase();
            const lastName = row.original.employee.lastName.toLowerCase();
            const fullName = `${firstName} ${lastName}`;
            return fullName.includes(filterValue.toLowerCase());
        },
        enableSorting: false,
        enableHiding: false
    },
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

            const config = status ? statusConfig[status] : null

            function getIcon(status: string) {
                if (status === "approve") return Check;
                if (status === "rejected") return X;
                if (status === "waiting") return Loader;
            }

            return (
                <div className="flex w-[140px] items-center">
                    {approvalConfig(status)}
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <DataTableRowActions row={row} />
        }
    }
];