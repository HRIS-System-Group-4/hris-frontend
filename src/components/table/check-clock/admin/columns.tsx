"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckClock } from "./schema"
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

const mapTypeNumberToString = (type: number): "wfo" | "wfa" | "hybrid" | "unknown" => {
  switch(type) {
    case 1: return "wfo";
    case 2: return "wfa";
    case 3: return "hybrid";
    default: return "unknown";
  }
};

// const typeConfig = (type: CheckClock["type"]) => {
//     const typeConfig = {
//         "wfo": { label: "WFO"},
//         "wfa": { label: "WFA"},
//         "hybrid": { label: "Hybrid"},
//     } as const

//     const config = typeConfig[type]

//     return (
//         <div className="flex w-[100px] items-center">
//             <div className="">{config.label}</div>
//         </div>
//     );
// }

const typeConfig = (type: "wfo" | "wfa" | "hybrid" | "unknown") => {
  const typeConfigMap = {
    wfo: { label: "WFO" },
    wfa: { label: "WFA" },
    hybrid: { label: "Hybrid" },
    unknown: { label: "Unknown" }
  } as const;

  const config = typeConfigMap[type] || typeConfigMap["unknown"];

  return (
    <div className="flex w-[100px] items-center">
      <div>{config.label}</div>
    </div>
  );
};

export const columns: ColumnDef<CheckClock>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Check Clock Name" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center">
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
        accessorKey: "totalEmployee",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total Employee" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="capitalize">{row.original.totalEmployee}</span>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => {
            // return (
            //     typeConfig(row.getValue("type"))
            // );
            const typeNumber = row.getValue("type") as number;
            const typeString = mapTypeNumberToString(typeNumber);
            return typeConfig(typeString);
        },
        filterFn: (row, id, value) => {
            // return value.includes(row.getValue(id));
            const typeNumber = row.getValue(id) as number;
            const typeString = mapTypeNumberToString(typeNumber);
            return value.includes(typeString);
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <DataTableRowActions row={row} />
        }
    }
];