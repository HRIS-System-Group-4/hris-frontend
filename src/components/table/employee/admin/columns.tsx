"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Employee } from "./schema"
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const statusConfig = (status: Employee["status"]) => {
    const statusConfig = {
        "active": { label: "Active", className: "bg-green-100 text-green-600" },
        "inactive": { label: "Inactive", className: "bg-gray-100 text-gray-950" },
    } as const

    const config = statusConfig[status]

    return (
        <Badge variant={"secondary"} className={config.className} >
            {config.label}</Badge>
    );
}

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Employee Name" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={row.original.avatar || "/placeholder.svg"}
                        alt={`${row.original.firstName} ${row.original.lastName}`}
                    />
                    <AvatarFallback>
                        {row.original.firstName[0]}
                        {row.original.lastName[0]}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">
                        {row.original.firstName} {row.original.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{row.original.email}</div>
                </div>
            </div>
        ),
        filterFn: (row, _columnId, filterValue) => {
            const firstName = row.original.firstName.toLowerCase();
            const lastName = row.original.lastName.toLowerCase();
            const fullName = `${firstName} ${lastName}`;
            return fullName.includes(filterValue.toLowerCase());
        },
        // enableSorting: false,
        // enableHiding: false
    },
    {
        accessorKey: "jobTitle",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Job Title" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize">{row.original.jobTitle}</span>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false
    },
    // {
    //     accessorKey: "grade",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Grade" />
    //     ),
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex w-[100px] items-center">
    //                 <span className="capitalize"> {row.getValue("grade")}</span>
    //             </div>
    //         );
    //     },
    //     filterFn: (row, id, value) => {
    //         return value.includes(row.getValue(id));
    //     }
    // },
    {
        accessorKey: "branch",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Branch" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize"> {row.getValue("branch")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            return (
                statusConfig(row.getValue("status"))
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