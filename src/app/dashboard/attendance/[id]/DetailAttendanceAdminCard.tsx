"use client"

import { AttendanceAdmin } from "@/components/table/attendance/admin/schema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { DetailContainer, DetailGroup, DetailItem } from "@/components/ui/custom-detail"
import { Separator } from "@radix-ui/react-separator"

export default function DetailAttendanceCard(dataAttendance: AttendanceAdmin) {
    return (
        <Card>
            <CardContent className="space-y-5">
                <DetailGroup title="Personal Information">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage
                                src={dataAttendance.employee.avatar || "/placeholder.svg"}
                                alt={`${dataAttendance.employee.firstName} ${dataAttendance.employee.lastName}`}
                            />
                            <AvatarFallback className="text-lg">
                                {dataAttendance.employee.firstName[0]}
                                {dataAttendance.employee.lastName[0]}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <DetailContainer>
                        <DetailItem label="Full Name" layout={"column"} >
                            <div className="font-medium text-black">John Doe</div>
                        </DetailItem>
                        <DetailItem label="NIK" layout={"column"} >
                            <div className="font-medium text-black">526278981345623</div>
                        </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                        <DetailItem label="Gender" layout={"column"} >
                            <div className="font-medium text-black">+1 (555) 123-4567</div>
                        </DetailItem>
                        <DetailItem label="Phone Number" layout={"column"} >
                            <div className="font-medium text-black">123 Main St, Anytown, CA 12345</div>
                        </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                        <DetailItem label="Birth Place" layout={"column"} >
                            <div className="font-medium text-black">Malang</div>
                        </DetailItem>
                        <DetailItem label="Birth Date" layout={"column"} >
                            <div className="font-medium text-black">12 Jan 2000</div>
                        </DetailItem>
                    </DetailContainer>
                </DetailGroup>

                <Separator />

                <DetailGroup title="Employement Details">
                    <DetailContainer>
                        <DetailItem label="Branch" layout={"column"} >
                            <div className="font-medium text-black">Head Office</div>
                        </DetailItem>
                        <DetailItem label="Job Title" layout={"column"} >
                            <div className="font-medium text-black">UI/UX Designer</div>
                        </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                        <DetailItem label="Grade" layout={"column"} >
                            <div className="font-medium text-black">Staff</div>
                        </DetailItem>
                        <DetailItem label="Contract Type" layout={"column"} >
                            <div className="font-medium text-black">Permanent</div>
                        </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                        <DetailItem label="SP Type" layout={"column"} >
                            <div className="font-medium text-black">II</div>
                        </DetailItem>
                    </DetailContainer>
                </DetailGroup>

                <Separator />

                <DetailGroup title="Banking Information">
                    <DetailContainer>
                        <DetailItem label="Bank" layout={"column"} >
                            <div className="font-medium text-black">Bank Mandiri</div>
                        </DetailItem>
                        <DetailItem label="Bank Account Number" layout={"column"} >
                            <div className="font-medium text-black">215234123412</div>
                        </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                        <DetailItem label="Account Holder Name" layout={"column"} >
                            <div className="font-medium text-black">John Doe</div>
                        </DetailItem>
                    </DetailContainer>
                </DetailGroup>

                <Separator />

                <DetailGroup title="Check Clock">
                    <DetailContainer>
                        <DetailItem label="Check Clock Setting" layout={"column"} >
                            <div className="font-medium text-black">WFO Head Office</div>
                        </DetailItem>
                    </DetailContainer>
                </DetailGroup>

                <Separator />

                <DetailGroup title="Letters">
                    <PdfGallery />
                </DetailGroup>

            </CardContent>
            {/* <CardFooter className="flex justify-end border-t pt-6">
              <Button onClick={() => router.push(`/dashboard/employee/${employee.id}/edit`)}>Edit Employee</Button>
            </CardFooter> */}
        </Card>
        )
}