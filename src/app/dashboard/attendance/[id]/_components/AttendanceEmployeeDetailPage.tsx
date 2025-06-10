"use client"

import { useRouter } from "next/navigation"
import { AttendanceRecord } from "@/components/table/attendance/employee/schema"
import { ImagePreview } from "@/components/ui/image-preview"
import {
  CustomPage, CustomPageHeader, CustomPageTitle, CustomPageTitleContainer, CustomPageSubtitle
} from "@/components/ui/custom-page"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DetailContainer, DetailGroup, DetailItem } from "@/components/ui/custom-detail"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, CircleX, Loader } from "lucide-react"

// 🔽 Function mapping di sini
const mapRawAttendance = (raw: any): AttendanceRecord => ({
  id: raw.clock_in?.id ?? '',
  employee: {
    avatar: raw.employee_avatar ?? 'https://via.placeholder.com/150',
    firstName: raw.employee_first_name ?? '',
    lastName: raw.employee_last_name ?? '',
    email: raw.employee_email ?? '',
  },
  date: new Date(raw.date),
  clockIn: raw.clock_in?.time ?? null,
  clockOut: raw.clock_out?.time ?? null,
  workHours: raw.work_hours ?? null,
  attendanceType: raw.attendance_type,
  approval: raw.approval ?? null,
  startDate: raw.start_date ? new Date(raw.start_date) : null,
  endDate: raw.end_date ? new Date(raw.end_date) : null,
  branchName: raw.branch_name ?? null,
  branchAddress: raw.branch_address ?? null,
  proofPath: raw.clock_in?.proof_path ?? null,
})

// 🔽 Komponen utama
export default function AttendanceDetailsPage({ rawData }: { rawData: any }) {
  const router = useRouter()
  console.log("Raw Attendance Data:", rawData)
  const data = mapRawAttendance(rawData.data)
  console.log("Attendance Details Data:", data)

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
          <DetailGroup title="Attendance Information">
            <DetailContainer>
              <DetailItem layout="column" label="Date">
                <div className="font-medium text-black">
                  {data.date.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </div>
              </DetailItem>
              <DetailItem layout="column" label="Attendance Type">
                <div className="font-medium text-black capitalize">{data.attendanceType}</div>
              </DetailItem>
            </DetailContainer>
            {(data.attendanceType === "On Time" || data.attendanceType === "Late") ? (
              <DetailContainer>
                <DetailItem layout="column" label="Clock In">
                  <div className="font-medium text-black">{data.clockIn ?? "-"}</div>
                </DetailItem>
                <DetailItem layout="column" label="Clock Out">
                  <div className="font-medium text-black">{data.clockOut ?? "-"}</div>
                </DetailItem>
              </DetailContainer>
            ) : (
              <DetailContainer>
                <DetailItem layout="column" label="Start Date">
                  <div className="font-medium text-black">{data.startDate?.toDateString() ?? "-"}</div>
                </DetailItem>
                <DetailItem layout="column" label="End Date">
                  <div className="font-medium text-black">{data.endDate?.toDateString() ?? "-"}</div>
                </DetailItem>
              </DetailContainer>
            )}
            {data.approval && (
              <DetailContainer>
                <DetailItem layout="column" label="Approval">
                  {approvalConfig(data.approval)}
                </DetailItem>
              </DetailContainer>
            )}
          </DetailGroup>
          <Separator />
          <DetailGroup title="Branch Information">
            <DetailContainer>
              <DetailItem layout="column" label="Branch Name">
                <div className="font-medium text-black">{data.branchName}</div>
              </DetailItem>
              <DetailItem layout="column" label="Address">
                <div className="font-medium text-black">{data.branchAddress}</div>
              </DetailItem>
            </DetailContainer>
          </DetailGroup>
          <Separator />
          <DetailGroup title="Proof of Attendance">
            <ImagePreview
              src={data.proofPath
                ? `https://your-server.com/${data.proofPath}`// harus diubah
                : "https://via.placeholder.com/150"}
              alt="Proof of Attendance"
              width={3000}
              height={100}
              previewWidth={800}
              previewHeight={200}
            />
          </DetailGroup>
        </CardContent>
      </Card>
    </CustomPage>
  )
}

// Fungsi konversi status approval
const approvalConfig = (approval?: AttendanceRecord["approval"]) => {
  const statusConfig = {
    "approve": { label: "Approve", className: "bg-green-100 text-green-600", icon: CheckCircle2 },
    "rejected": { label: "Rejected", className: "bg-red-100 text-red-600", icon: CircleX },
    "waiting": { label: "Waiting", className: "bg-amber-100 text-amber-500", icon: Loader },
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
