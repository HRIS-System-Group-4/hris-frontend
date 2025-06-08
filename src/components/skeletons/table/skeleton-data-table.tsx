"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  showToolbar?: boolean;
  showPagination?: boolean;
}

// Skeleton for toolbar
export function SkeletonDataTableToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Filter buttons skeleton */}
        <Skeleton className="h-8 w-[140px]" />
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[80px]" />
      </div>
      {/* Date picker skeleton */}
      <Skeleton className="h-8 w-[250px]" />
    </div>
  );
}

// Skeleton for pagination
export function SkeletonDataTablePagination() {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-[70px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for table rows
export function SkeletonDataTableRow() {
  return (
    <TableRow>
      {/* Date column */}
      <TableCell>
        <div className="flex w-[100px] items-center">
          <Skeleton className="h-4 w-20" />
        </div>
      </TableCell>
      {/* Clock In column */}
      <TableCell>
        <div className="flex w-[100px] items-center">
          <Skeleton className="h-4 w-16" />
        </div>
      </TableCell>
      {/* Clock Out column */}
      <TableCell>
        <div className="flex w-[100px] items-center">
          <Skeleton className="h-4 w-16" />
        </div>
      </TableCell>
      {/* Work Hours column */}
      <TableCell>
        <div className="flex w-[100px] items-center">
          <Skeleton className="h-4 w-12" />
        </div>
      </TableCell>
      {/* Attendance Type column */}
      <TableCell>
        <div className="flex w-[100px] items-center">
          <Skeleton className="h-4 w-20" />
        </div>
      </TableCell>
      {/* Approval column */}
      <TableCell>
        <div className="flex w-[140px] items-center">
          <div className="flex items-center">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Skeleton for table headers
export function SkeletonDataTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-18" />
            <Skeleton className="h-4 w-4" />
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-4" />
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

// Main skeleton component for the entire data table
export function SkeletonDataTable({
  columnCount = 6,
  rowCount = 5,
  showToolbar = true,
  showPagination = true,
}: DataTableSkeletonProps) {
  return (
    <div className="space-y-4">
      {showToolbar && <SkeletonDataTableToolbar />}
      
      <div className="rounded-md border">
        <Table>
          <SkeletonDataTableHeader />
          <TableBody>
            {Array.from({ length: rowCount }).map((_, index) => (
              <SkeletonDataTableRow key={index} />
            ))}
          </TableBody>
        </Table>
      </div>
      
      {showPagination && <SkeletonDataTablePagination />}
    </div>
  );
}

// Alternative: More generic skeleton for any table structure
export function GenericDataTableSkeleton({
  columnCount = 6,
  rowCount = 5,
  showToolbar = true,
  showPagination = true,
}: DataTableSkeletonProps) {
  return (
    <div className="space-y-4">
      {showToolbar && <SkeletonDataTableToolbar />}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={index}>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="flex items-center">
                      {colIndex === columnCount - 1 ? (
                        // Last column - approval badge
                        <Skeleton className="h-6 w-20 rounded-full" />
                      ) : (
                        <Skeleton className="h-4 w-16" />
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {showPagination && <SkeletonDataTablePagination />}
    </div>
  );
}