
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsLeftIcon, ChevronsRight, ChevronsRightIcon } from "lucide-react";

interface DataTablePaginationProps<TData extends { id: number |string }> {
  table: Table<TData>;
  total: number;
}

export function DataTablePagination<TData extends { id: number | string}>({
  table,
  total
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {(() => {
          const pageIndex = table.getState().pagination.pageIndex ?? 0;
          const pageSize = table.getState().pagination.pageSize ?? 10;
          // const start = table.getFilteredRowModel().rows.length === 0
          //   ? 0
          //   : pageIndex * pageSize + 1;
          //   const end = Math.min(
          //     (pageIndex + 1) * pageSize,
          //     total
          //   );
            // const start = total === 0 ? 0 : pageIndex * pageSize + 1;
            // const end = Math.min((pageIndex + 1) * pageSize, total);
            const rows = table.getRowModel().rows;

            // const start = rows.length === 0 ? 0 : rows[0].original.id;
            // const end = rows.length === 0 ? 0 : rows[rows.length - 1].original.id;
            const start = total === 0 ? 0 : pageIndex * pageSize + 1;
            const end = Math.min((pageIndex + 1) * pageSize, total);

          console.log("Pagination Debug:", {
            total,
            pageIndex: table.getState().pagination.pageIndex,
            pageSize: table.getState().pagination.pageSize,
          });
          return (
            <>
              Showing <strong>{start}</strong> to <strong>{end}</strong> of{" "}
              <strong>{total}</strong> employees
            </>
          );
        })()}
      </div>



      <div className="flex items-center space-x-2">
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
    // 
  );
}