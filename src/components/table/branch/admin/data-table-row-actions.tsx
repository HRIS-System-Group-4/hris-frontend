"use client";

import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { IconDots } from "@tabler/icons-react";
import Link from "next/link";
import { EyeIcon, TrashIcon } from "lucide-react";

interface BranchData {
  id: string | number;
}

interface DataTableRowActionsProps<TData extends BranchData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends BranchData>({
  row
}: DataTableRowActionsProps<TData>) {
  // const task = taskSchema.parse(row.original);

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/dashboard/branch/${row.original.id}`}>
        <Button variant="ghost" size="icon">
          <EyeIcon className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      </Link>
    </div>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant="ghost"
    //       className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
    //     >
    //       <IconDots className="h-4 w-4" />
    //       <span className="sr-only">Open menu</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end" className="w-[160px]">
    //     <DropdownMenuItem>Edit</DropdownMenuItem>
    //     <DropdownMenuItem>Make a copy</DropdownMenuItem>
    //     <DropdownMenuItem>Favorite</DropdownMenuItem>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuItem>
    //       Delete
    //       <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}