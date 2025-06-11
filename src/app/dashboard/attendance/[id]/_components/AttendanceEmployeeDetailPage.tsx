"use client"

import { useRouter } from "next/navigation"
import { AttendanceRecord } from "@/components/table/attendance/employee/schema"
import { ImagePreview } from "@/components/ui/image-preview"
import {
  CustomPage, CustomPageHeader, CustomPageTitle, CustomPageTitleContainer, CustomPageSubtitle
} from "@/components/ui/custom-page"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DetailContainer, DetailGroup, DetailItem } from "@/components/ui/custom-detail"
import { Badge } from "@/components/ui/badge"
import { Check, CheckCircle2, CircleX, Loader, X } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AttendanceAdmin } from "@/components/table/attendance/admin/schema"
import { getInitials } from "@/lib/strings"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { approveClockRequest, rejectClockRequest } from "@/services/attendanceService"

// 🔽 Function mapping di sini
const mapRawAttendanceEmployee = (raw: any): AttendanceRecord => ({
  id: raw.clock_in?.id ?? '',
  employee: {
    avatar: raw.employee_avatar ?? 'https://via.placeholder.com/150',
    name: raw.employee_name ?? '',
    email: raw.employee_email ?? '',
  },
  date: new Date(raw.date),
  clockIn: raw.clock_in?.time ?? '-',
  clockOut: raw.clock_out?.time ?? '-',
  workHours: raw.work_hours ?? '-',
  attendanceType: raw.attendance_type,
  approval: raw.approval ?? null,
  startDate: raw.start_date ? new Date(raw.start_date) : null,
  endDate: raw.end_date ? new Date(raw.end_date) : null,
  branchName: raw.branch_name ?? '-',
  branchAddress: raw.branch_address ?? '-',
  proofPath: raw.clock_in?.proof_path ?? null,
})

const mapRawAttendanceAdmin = (raw: any, id: string): AttendanceAdmin => ({
  id: id,
  avatar: raw.employee_avatar ?? 'https://via.placeholder.com/150',
  employee_name: raw.employee_name ?? '',
  email: raw.email ?? '',
  job_title: raw.job_title ?? '-',
  grade: raw.grade ?? '-',
  date: new Date(raw.date),
  clock_in: raw.clock_in ?? '-',
  clock_out: raw.clock_out ?? '-',
  work_hours: raw.work_hours ?? '-',
  attendance_type: raw.attendance_type,
  status: raw.status ?? null,
  start_date: raw.startDate ? new Date(raw.startDate) : null,
  end_date: raw.endDate ? new Date(raw.endDate) : null,
  branch_name: raw.branch ?? '-',
  branch_address: raw.address ?? '-',
  proof_path: raw.clock_in?.proof_path ?? null,
})

function attendanceTypeConfig(type: AttendanceAdmin["attendance_type"] | AttendanceRecord["attendanceType"]) {
  const typeConfig = {
    "On Time": { label: "On Time", className: "bg-gray-100 text-gray-950" },
    "Late": { label: "Late", className: "bg-gray-100 text-gray-950" },
    "Sick Leave": { label: "Sick Leave", className: "bg-amber-100 text-amber-500" },
    "Absent": { label: "Absent", className: "bg-amber-100 text-amber-500" },
    "Annual Leave": { label: "Annual Leave", className: "bg-amber-100 text-amber-500" },
  } as const;

  const config = typeConfig[type];

  return (
    <Badge variant="secondary" className={config?.className || ""}>
      {config?.label || type}
    </Badge>
  )
}

// 🔽 Komponen utama
export default function AttendanceDetailsPage({ rawData, isAdmin = false, id }: { rawData: any, isAdmin: boolean, id: string }) {
  const router = useRouter()
  console.log("Raw Attendance Data:", rawData)
  const data = isAdmin ? mapRawAttendanceAdmin(rawData.data, id) : mapRawAttendanceEmployee(rawData.data)
  console.log("Attendance Details Data:", data)
  const user = useSelector((state: RootState) => state.auth.user)


  const handleApprove = async () => {
    try {
      console.log("Approving attendance for:", data.id);
      const res = await approveClockRequest(data.id);
      if (res.status === 200) {
        // Call the refresh function from column meta
        toast({
          title: "Attendance approved",
          description: "Attendance has been approved successfully.",
          variant: "default",
        });
      }

      router.push(`/dashboard/attendance`)
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
      console.log("Rejecting attendance for:", data.id);
      const res = await rejectClockRequest(data.id);
      if (res.status === 200) {

        toast({
          title: "Attendance rejected",
          description: "Attendance has been rejected successfully.",
          variant: "default",
        });
      }
      router.push(`/dashboard/attendance`)
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
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Detail Attendance</CustomPageTitle>
          <CustomPageSubtitle>Manage your attendance data</CustomPageSubtitle>
        </CustomPageTitleContainer>
      </CustomPageHeader>

      <Card>
        <CardContent className="space-y-5">
          {user?.is_admin && (
            <DetailGroup title="Employment Information">
              <div className="flex items-center gap-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={(data as AttendanceAdmin).avatar || "/placeholder.svg"}
                    alt={`${(data as AttendanceAdmin).employee_name}`}
                  />
                  <AvatarFallback>
                    {getInitials((data as AttendanceAdmin).employee_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {(data as AttendanceAdmin).employee_name}
                  </div>
                  <div className="text-xs text-muted-foreground">{(data as AttendanceAdmin).email}</div>
                </div>
              </div>
              <DetailContainer>
                <DetailItem layout={"column"} label="Job Title">
                  <div className="font-medium text-black">{(data as AttendanceAdmin).job_title}</div>
                </DetailItem>
                <DetailItem layout={"column"} label="Grade">
                  <div className="font-medium text-black">{(data as AttendanceAdmin).grade}</div>
                </DetailItem>
              </DetailContainer>
            </DetailGroup>
          )}
          <DetailGroup title="Attendance Information">
            <DetailContainer>
              {((data as AttendanceRecord).attendanceType !== "On Time" || (data as AttendanceRecord).attendanceType !== "Late" || (data as AttendanceAdmin).attendance_type !== "On Time" || (data as AttendanceAdmin).attendance_type !== "Late") ? (
                <DetailItem layout="column" label="Leave Date">
                  <div className="font-medium text-black">
                    {data.date.toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>
                </DetailItem>
              ) : (
                <DetailItem layout="column" label="Date">
                  <div className="font-medium text-black">
                    {data.date.toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>
                </DetailItem>

              )}
              <DetailItem layout="column" label="Attendance Type">
                {attendanceTypeConfig((data as AttendanceRecord).attendanceType || (data as AttendanceAdmin).attendance_type)}
              </DetailItem>
            </DetailContainer>
            {((data as AttendanceRecord).attendanceType === "On Time" || (data as AttendanceRecord).attendanceType === "Late" || (data as AttendanceAdmin).attendance_type === "On Time" || (data as AttendanceAdmin).attendance_type === "Late") && (
              <DetailContainer>
                <DetailItem layout="column" label="Clock In">
                  <div className="font-medium text-black">{(data as AttendanceRecord).clockIn || (data as AttendanceAdmin).clock_in}</div>
                </DetailItem>
                <DetailItem layout="column" label="Clock Out">
                  <div className="font-medium text-black">{(data as AttendanceRecord).clockOut || (data as AttendanceAdmin).clock_out}</div>
                </DetailItem>
              </DetailContainer>
            )}
            {(data as AttendanceRecord).approval || (data as AttendanceAdmin).status && (
              <DetailContainer>
                <DetailItem layout="column" label="Status">
                  {approvalConfig((data as AttendanceRecord).approval || (data as AttendanceAdmin).status)}
                </DetailItem>
              </DetailContainer>
            )}
          </DetailGroup>
          <Separator />
          <DetailGroup title="Branch Information">
            <DetailContainer>
              <DetailItem layout="column" label="Branch Name">
                <div className="font-medium text-black">{(data as AttendanceRecord).branchName || (data as AttendanceAdmin).branch_name}</div>
              </DetailItem>
              <DetailItem layout="column" label="Address">
                <div className="font-medium text-black">{(data as AttendanceRecord).branchAddress || (data as AttendanceAdmin).branch_address}</div>
              </DetailItem>
            </DetailContainer>
          </DetailGroup>
          <Separator />
          {/* <DetailGroup title="Proof of Attendance">
            <ImagePreview
              src={data.proofPath
                ? `https://your-server.com/${data.proofPath}`// harus diubah
                : "https://example.com/150"}
              alt="Proof of Attendance"
              width={3000}
              height={100}
              previewWidth={800}
              previewHeight={200}
            />
          </DetailGroup> */}
        </CardContent>
        {(isAdmin && ((data as AttendanceAdmin).status === "waiting" || (data as AttendanceAdmin).status === "pending")) && <CardFooter className="flex justify-end border-t pt-6 gap-3">
          <Button onClick={handleApprove} variant="ghost" size={"lg"} className="bg-green-600 text-white hover:bg-green-700 hover:text-white">
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button onClick={handleReject} variant="ghost" size={"lg"} className="bg-neutral-100 t hover:bg-neutral-200 ">
            <X className="h-4 w-4" />
            Reject
          </Button>
        </CardFooter>}
      </Card >
    </CustomPage >
  )
}

// Fungsi konversi status approval
const approvalConfig = (approval?: AttendanceRecord["approval"]) => {
  const statusConfig = {
    "approve": { label: "Approve", className: "bg-green-100 text-green-600", icon: CheckCircle2 },
    "rejected": { label: "Rejected", className: "bg-red-100 text-red-600", icon: CircleX },
    "waiting": { label: "Waiting", className: "bg-amber-100 text-amber-500", icon: Loader },
    "pending": { label: "Waiting", className: "bg-amber-100 text-amber-500", icon: Loader },
  } as const

  const config = approval ? statusConfig[approval] : null
  if (!config) return <div className="flex w-[100px] items-center">-</div>

  return (
    <Badge variant="secondary" className={config.className}>
      <config.icon className="h-4 w-4 mr-1" />
      {config.label}
    </Badge>
  );
}
