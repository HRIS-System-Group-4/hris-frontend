"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AttendanceAdmin } from "./schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import {
    Check,
    X,
    Loader,
    CheckCircle2,
    CircleX,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTimeToDuration, getInitials } from "@/lib/strings";
import { approveClockRequest, rejectClockRequest } from "@/services/attendanceService";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

// Define the approval status type
type ApprovalStatus = "approved" | "rejected" | "waiting" | "pending";

const approvalConfig = (
    status: AttendanceAdmin["status"],
    onApprove?: () => void,
    onReject?: () => void
) => {
    const statusConfig = {
        approved: {
            label: "Approved",
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
        pending: {
            label: "Pending",
            className: "bg-gray-100 text-gray-500",
            icon: Loader,
        },
    } as const;

    // Show action buttons for waiting or pending status
    if (status === "waiting" || status === "pending") {
        return (
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700 hover:text-white"
                    onClick={onApprove}
                >
                    <Check className="h-4 w-4" />
                    Approve
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-neutral-100 text-foreground hover:bg-neutral-200"
                    onClick={onReject}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }


    // Handle null approval status
    if (status === null) {
        return (
            <div className="flex w-[100px] items-center">
                <span>-</span>
            </div>
        );
    }

    // Show status badge for approved/rejected
    const config = statusConfig[status as ApprovalStatus];
    if (config) {
        return (
            <Badge variant="secondary" className={config.className}>
                <config.icon className="h-4 w-4 mr-1" />
                {config.label}
            </Badge>
        );
    }

    return (
        <div className="flex w-[100px] items-center">
            <span>-</span>
        </div>
    );
};

export const columns: ColumnDef<AttendanceAdmin>[] = [
    {
        accessorKey: "employee_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Employee Name" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    {row.getValue("avatar") ? (
                        <AvatarImage
                            src={row.getValue("avatar")}
                            alt={row.getValue("employee_name")}
                        />
                    ) : (
                        <AvatarFallback>
                            {getInitials(row.getValue("employee_name"))}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="font-medium">{row.getValue("employee_name")}</div>
            </div>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        enableSorting: false,
        enableHiding: false,
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
                year: "numeric",
            });
            return (
                <div className="flex w-[100px] items-center">
                    <span>{formattedDate}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            const rowDate = new Date(row.getValue(id));
            const [startDate, endDate] = value;
            return rowDate >= startDate && rowDate <= endDate;
        },
    },
    {
        accessorKey: "clock_in",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Clock In" />
        ),
        cell: ({ row }) => (
            <div className="flex w-[100px] items-center">
                <span>{row.getValue("clock_in") ?? "-"}</span>
            </div>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "clock_out",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Clock Out" />
        ),
        cell: ({ row }) => (
            <div className="flex w-[100px] items-center">
                <span>{row.getValue("clock_out") ?? "-"}</span>
            </div>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "work_hours",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Work Hours" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    {row.getValue("work_hours") ? formatTimeToDuration(row.getValue("work_hours")) : "-"}
                </div>
            );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "attendance_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Attendance Type" />
        ),
        cell: ({ row }) => {
            const type = row.getValue("attendance_type") as AttendanceAdmin["attendance_type"];
            const typeConfig = {
                "On Time": { label: "On Time", className: "bg-gray-100 text-gray-950" },
                "Late": { label: "Late", className: "bg-gray-100 text-gray-950" },
                "Sick Leave": { label: "Sick Leave", className: "bg-amber-100 text-amber-500" },
                "Absent": { label: "Absent", className: "bg-amber-100 text-amber-500" },
                "Annual Leave": { label: "Annual Leave", className: "bg-amber-100 text-amber-500" },
            } as const;

            const config = typeConfig[type];

            return (
                <div className="flex w-[120px] items-center">
                    {/* {row.getValue("attendance_type")} */}
                    <Badge variant="secondary" className={config?.className || ""}>
                        {config?.label || type}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    // Update the status column in your columns definition
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Approval" />
        ),
        cell: ({ row, column }) => {
            const status = row.getValue("status") as AttendanceAdmin["status"];

            // Get onRefresh from column meta instead of row.table
            const onRefresh = column.columnDef.meta as { onRefresh?: () => void };
            const onRefreshCallback = onRefresh?.onRefresh;

            const handleApprove = async () => {
                try {
                    console.log("Approving attendance for:", row.original.id);
                    const res = await approveClockRequest(row.original.id);
                    if (res.status === 200) {
                        // Call the refresh function from column meta
                        if (onRefresh) {
                            onRefreshCallback();
                        }

                        toast({
                            title: "Attendance approved",
                            description: "Attendance has been approved successfully.",
                            variant: "default",
                        });
                    }
                } catch (error) {
                    toast({
                        title: "Error approving attendance",
                        description: "There was an error approving the attendance. Please try again.",
                        variant: "destructive",
                    });
                    console.error("Error approving attendance:", error);
                }
            };

            const handleReject = async () => {
                try {
                    console.log("Rejecting attendance for:", row.original.id);
                    const res = await rejectClockRequest(row.original.id);
                    if (res.status === 200) {
                        // Call the refresh function from column meta
                        if (onRefresh) {
                            onRefreshCallback();
                        }

                        toast({
                            title: "Attendance rejected",
                            description: "Attendance has been rejected successfully.",
                            variant: "default",
                        });
                    }
                } catch (error) {
                    toast({
                        title: "Error rejecting attendance",
                        description: "There was an error rejecting the attendance. Please try again.",
                        variant: "destructive",
                    });
                    console.error("Error rejecting attendance:", error);
                }
            };

            return (
                <div className="flex w-[140px] items-center">
                    {approvalConfig(status, handleApprove, handleReject)}
                </div>
            );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];