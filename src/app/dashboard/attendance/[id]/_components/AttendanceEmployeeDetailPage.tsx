"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    CustomPage,
    CustomPageHeader,
    CustomPageTitle,
    CustomPageTitleButtons,
    CustomPageTitleContainer,
    CustomPageSubtitle
} from "@/components/ui/custom-page"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AttendanceAdmin } from "@/components/table/attendance/admin/schema"
import { DetailContainer, DetailGroup, DetailItem } from "@/components/ui/custom-detail"
import { Badge } from "@/components/ui/badge"
import { Check, CheckCircle2, CircleX, Loader, X } from "lucide-react"
import { ImagePreview } from "@/components/ui/image-preview"

const approvalConfig = (approval?: AttendanceAdmin["approval"]) => {
    const statusConfig = {
        "approve": { label: "Approve", className: "bg-green-100 text-green-600", icon: CheckCircle2 },
        "rejected": { label: "Rejected", className: "bg-red-100 text-red-600", icon: CircleX },
        "waiting": { label: "Waiting", className: "bg-amber-100 text-amber-500", icon: Loader },
    } as const

    const config = approval ? statusConfig[approval] : null

    if (!config) return (
        <div>
            <div className="flex w-[100px] items-center">
                -
            </div>
        </div>
    );

    return (
        <Badge variant={"secondary"} className={config.className} >
            <config.icon className={"h-4 w-4"} />
            {config.label}</Badge>
    );
}

export default function AttendanceDetailsPage({ data }: { data: AttendanceAdmin }) {
    const router = useRouter()

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
                            <DetailItem layout={"column"} label="Date">
                                <div className="font-medium text-black">{
                                    new Date(data.date).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}</div>
                            </DetailItem>
                            <DetailItem layout={"column"} label="Attendance Type">
                                <div className="font-medium text-black capitalize">{data.attendanceType}</div>
                            </DetailItem>
                        </DetailContainer>
                        {data.attendanceType === "ontime" || data.attendanceType === "late" ? (
                            <DetailContainer>
                                <DetailItem layout={"column"} label="Clock In">
                                    <div className="font-medium text-black">{data.clockIn}</div>
                                </DetailItem>
                                <DetailItem layout={"column"} label="Clock Out">
                                    <div className="font-medium text-black">{data.clockOut}</div>
                                </DetailItem>
                            </DetailContainer>

                        ) : (
                            <DetailContainer>
                                <DetailItem layout={"column"} label="Start Date">
                                    <div className="font-medium text-black">{data.startDate}</div>
                                </DetailItem>
                                <DetailItem layout={"column"} label="End Date">
                                    <div className="font-medium text-black">{data.endDate}</div>
                                </DetailItem>
                            </DetailContainer>
                        )
                        }
                        {data.approval && (
                            <DetailContainer>
                                <DetailItem layout={"column"} label="Approval">
                                    {approvalConfig(data.approval)}
                                </DetailItem>
                            </DetailContainer>
                        )}
                    </DetailGroup>
                    <Separator />
                    <DetailGroup title="Branch Information">
                        <DetailContainer>
                            <DetailItem layout={"column"} label="Branch Name">
                                <div className="font-medium text-black">Bandung Innovation Hub</div>
                            </DetailItem>
                            <DetailItem layout={"column"} label="Address">
                                <div className="font-medium text-black">Jl. Permata Jingga no 2A</div>
                            </DetailItem>
                        </DetailContainer>
                    </DetailGroup>
                    <Separator />
                    <DetailGroup title="Proof of Attendance">
                        <ImagePreview
                            src="https://randomuser.me/api/portraits/men/8.jpg"
                            alt="Custom size example"
                            width={3000}
                            height={100}
                            previewWidth={800}
                            previewHeight={200}
                        />

                    </DetailGroup>

                </CardContent>
            </Card>
        </CustomPage >
    )
}
