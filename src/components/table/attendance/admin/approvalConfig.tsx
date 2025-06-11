import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2, CircleX, Loader, X } from "lucide-react";
import { AttendanceAdmin } from "./schema";

type ApprovalStatus = "approved" | "rejected" | "waiting" | "pending";

const approvalConfig = (
    status?: ApprovalStatus,
    is_admin?: boolean,
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
        if (is_admin) {

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
    }


    // Handle null approval status
    if (status === null) {
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

export default approvalConfig