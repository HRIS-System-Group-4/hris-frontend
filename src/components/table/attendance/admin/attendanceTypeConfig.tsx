import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2, CircleX, Loader, X } from "lucide-react";
import { AttendanceAdmin } from "./schema";

type AttendanceType = "On Time" | "Late" | "Sick Leave" | "Absent" | "Annual Leave";

const attendanceTypeConfig = (
    status: AttendanceType,
) => {
    const typeConfig = {
        "On Time": { label: "On Time", className: "bg-gray-100 text-gray-950" },
        "Late": { label: "Late", className: "bg-gray-100 text-gray-950" },
        "Sick Leave": { label: "Sick Leave", className: "bg-amber-100 text-amber-500" },
        "Absent": { label: "Absent", className: "bg-amber-100 text-amber-500" },
        "Annual Leave": { label: "Annual Leave", className: "bg-amber-100 text-amber-500" },
    } as const;
    // Show status badge for approved/rejected
    const config = typeConfig[status as AttendanceType];

    return (
        <Badge variant="secondary" className={config.className}>
            {config.label}
        </Badge>
    );
};

export default attendanceTypeConfig