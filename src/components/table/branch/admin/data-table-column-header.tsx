import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDown,
} from "lucide-react"
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

type SortDirection = "asc" | "desc" | undefined

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  // const [sortField, setSortField] = useState<SortField>(undefined)
  const [sortDirection, setSortDirection] = useState<SortDirection>(undefined)
  
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }
  const handleSort = () => {
    if (sortDirection === "asc") {
      setSortDirection("desc");
      column.toggleSorting(true);
    } else if (sortDirection === "desc") {
      setSortDirection(undefined);
      column.toggleSorting(undefined);
    } else {
      setSortDirection("asc");
      column.toggleSorting(false);
    }
  };
  // else {
  //   // New field, set to asc
  //   setSortField(field)
  //   setSortDirection("asc")
  // }
  // }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild> */}
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={handleSort}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
      {/* </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}
