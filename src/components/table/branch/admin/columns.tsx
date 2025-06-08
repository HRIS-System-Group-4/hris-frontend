"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Branch } from "./schema"
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { TrendingUp, TrendingDown, Check, Cross, Loader, X, CheckCircle2, CircleX, EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusConfig = (status: Branch["status"]) => {
    status = status.toLowerCase() as Branch["status"];
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

export const columns: ColumnDef<Branch>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Branch" />
        ),
        cell: ({ row }) => (
            <div className="flex w-[100px] items-center">
                <span className="capitalize">{row.original.name}</span>
            </div>
        ),
        filterFn: (row, _columnId, filterValue) => {
            return row.original.name.includes(filterValue.toLowerCase());
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "address",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Address" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize">{row.original.address}</span>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "city",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="City" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize"> {row.getValue("city")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "country",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Country" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize"> {row.getValue("country")}</span>
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