"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Mail, MapPin, Phone, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { table } from "console"
import { DetailContainer, DetailGroup, DetailItem } from "@/components/ui/custom-detail"
import { PdfGallery } from "@/components/pdf-card-gallery"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"
import Link from "next/link"
import axios from "axios";
import { getEmployeeById } from "@/services/employeeService"

type EmployeeDetail = {
  id: string
  nik: number
  first_name: string
  last_name: string
  gender: string
  birth_place: string
  birth_date: string
  avatar?: string
  job_title: string
  grade: string
  employment_type: string
  bank_name: string
  bank_account_no: string
  bank_account_owner: string
  sp_type: string
  branch_name: string
  check_clock_settings_name: string
  ck_settings_id: string
  branch: {
    id: string
    name: string
  }
  check_clock_settings: {
    id: string
    name: string
  }
  status: "active" | "inactive" | "pending" | "suspended"
  email: string
  phone_number: string
  start_date: string
  department: string
}

const grades = [
  { label: "Junior (G1)", value: "g1" },
  { label: "Mid-level (G2)", value: "g2" },
  { label: "Senior (G3)", value: "g3" },
  { label: "Lead (G4)", value: "g4" },
  { label: "Manager (G5)", value: "g5" },
];

function getGradeLabel(value: string): string {
  return grades.find((g) => g.value === value)?.label || value;
}

const sp_types = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
]

function getSPLabel(value: string): string {
  return sp_types.find((g) => g.value === value)?.label || value;
}

const bank_name = [
  { label: "Bank Central Asia (BCA)", value: "bca" },
  { label: "Bank Mandiri", value: "mandiri" },
  { label: "Bank Rakyat Indonesia (BRI)", value: "bri" },
  { label: "Bank Negara Indonesia (BNI)", value: "bni" },
  { label: "CIMB Niaga", value: "cimb" },
]

function getBankLabel(value: string): string {
  return bank_name.find((g) => g.value === value)?.label || value;
}

export default function EmployeeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchEmployeeDetails(id: string) {
    try {
      setLoading(true)
      const response = await getEmployeeById(id)

      setEmployee(response.data.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching employee details:", err)
      setError(err instanceof Error ? err.message : "Failed to load employee details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchEmployeeDetails(params.id)
    }
  }, [params.id])


  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: EmployeeDetail["status"] }) => {
    const statusConfig = {
      active: { label: "Active", variant: "outline" as const },
      inactive: { label: "Inactive", variant: "outline" as const },
      pending: { label: "Pending", variant: "outline" as const },
      suspended: { label: "Suspended", variant: "destructive" as const },
    }

    const config = statusConfig[status]

    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    )
  }

  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Detail Employee</CustomPageTitle>
          <CustomPageSubtitle>Manage and organize all your employees' data</CustomPageSubtitle>
        </CustomPageTitleContainer>
        <CustomPageTitleButtons>
          <Link href={`/dashboard/employee/edit/${params.id}`}>
            <Button variant="default" size={"lg"}>
              Edit Employee</Button>
          </Link>
        </CustomPageTitleButtons>
      </CustomPageHeader>

      {loading ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="rounded-md bg-destructive/15 p-4 text-destructive">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        employee && (
          <Card>
            <CardContent className="space-y-5">
              <DetailGroup title="Personal Information">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={employee.avatar || "/placeholder.svg"}
                      alt={`${employee.first_name} ${employee.last_name}`}
                    />
                    <AvatarFallback className="text-lg">
                      {employee.first_name[0]}
                      {employee.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <DetailContainer>
                  <DetailItem label="Full Name" layout={"column"} >
                    <div className="font-medium text-black">{employee?.first_name} {employee?.last_name}</div>
                  </DetailItem>
                  <DetailItem label="NIK" layout={"column"} >
                    <div className="font-medium text-black">{employee?.nik}</div>
                  </DetailItem>
                </DetailContainer>
                <DetailContainer>
                  <DetailItem label="Gender" layout={"column"} >
                    <div className="font-medium text-black">{employee?.gender}</div>
                  </DetailItem>
                  <DetailItem label="Phone Number" layout={"column"} >
                    <div className="font-medium text-black">{employee?.phone_number}</div>
                  </DetailItem>
                </DetailContainer>
                <DetailContainer>
                  <DetailItem label="Birth Place" layout={"column"} >
                    <div className="font-medium text-black">{employee?.birth_place}</div>
                  </DetailItem>
                  <DetailItem label="Birth Date" layout={"column"} >
                    <div className="font-medium text-black">{employee?.birth_date}</div>
                  </DetailItem>
                </DetailContainer>
              </DetailGroup>

              <Separator />

              <DetailGroup title="Employement Details">
                <DetailContainer>
                  <DetailItem label="Branch" layout={"column"} >
                    <div className="font-medium text-black">{employee?.branch_name}</div>
                  </DetailItem>
                  <DetailItem label="Job Title" layout={"column"} >
                    <div className="font-medium text-black">{employee?.job_title}</div>
                  </DetailItem>
                </DetailContainer>
                <DetailContainer>
                  <DetailItem label="Grade" layout={"column"} >
                    <div className="font-medium text-black">{getGradeLabel(employee?.grade)}</div>
                  </DetailItem>
                  <DetailItem label="Contract Type" layout={"column"} >
                    <div className="font-medium text-black">{employee?.employment_type}</div>
                  </DetailItem>
                </DetailContainer>
                <DetailContainer>
                  <DetailItem label="SP Type" layout={"column"} >
                    <div className="font-medium text-black">{getSPLabel(employee?.sp_type)}</div>
                  </DetailItem>
                </DetailContainer>
              </DetailGroup>

              <Separator />

              <DetailGroup title="Banking Information">
                <DetailContainer>
                  <DetailItem label="Bank" layout={"column"} >
                    <div className="font-medium text-black">{getBankLabel(employee?.bank_name)}</div>
                  </DetailItem>
                  <DetailItem label="Bank Account Number" layout={"column"} >
                    <div className="font-medium text-black">{employee?.bank_account_no}</div>
                  </DetailItem>
                </DetailContainer>
                <DetailContainer>
                  <DetailItem label="Account Holder Name" layout={"column"} >
                    <div className="font-medium text-black">{employee?.bank_account_owner}</div>
                  </DetailItem>
                </DetailContainer>
              </DetailGroup>

              <Separator />

              <DetailGroup title="Check Clock">
                <DetailContainer>
                  <DetailItem label="Check Clock Setting" layout={"column"} >
                    <div className="font-medium text-black">{employee?.check_clock_settings_name}</div>
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
      )}
    </CustomPage>
  )
}
