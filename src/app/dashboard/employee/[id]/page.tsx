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

// Define Employee type
type Employee = {
  id: string
  firstName: string
  lastName: string
  avatar?: string
  jobTitle: string
  grade: string
  branch: string
  status: "active" | "inactive" | "pending" | "suspended"
  email: string
  phone: string
  startDate: string
  department: string
}

const tableData: Employee[] = [
  {
    id: "1",
    firstName: "Alex",
    lastName: "Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "Senior Developer",
    grade: "G5",
    branch: "New York",
    status: "active",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    startDate: "2020-03-15",
    department: "Engineering",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Williams",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "Product Manager",
    grade: "G6",
    branch: "San Francisco",
    status: "active",
    email: "sarah.williams@example.com",
    phone: "(555) 234-5678",
    startDate: "2019-07-22",
    department: "Product",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "UX Designer",
    grade: "G4",
    branch: "London",
    status: "inactive",
    email: "michael.brown@example.com",
    phone: "(555) 345-6789",
    startDate: "2021-01-10",
    department: "Design",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "HR Specialist",
    grade: "G3",
    branch: "Chicago",
    status: "active",
    email: "emily.davis@example.com",
    phone: "(555) 456-7890",
    startDate: "2022-05-18",
    department: "Human Resources",
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Miller",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "Financial Analyst",
    grade: "G4",
    branch: "New York",
    status: "pending",
    email: "david.miller@example.com",
    phone: "(555) 567-8901",
    startDate: "2021-11-03",
    department: "Finance",
  },
  {
    id: "6",
    firstName: "Jessica",
    lastName: "Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "Marketing Specialist",
    grade: "G3",
    branch: "San Francisco",
    status: "active",
    email: "jessica.wilson@example.com",
    phone: "(555) 678-9012",
    startDate: "2020-09-14",
    department: "Marketing",
  },
  {
    id: "7",
    firstName: "James",
    lastName: "Taylor",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "Senior Developer",
    grade: "G5",
    branch: "London",
    status: "suspended",
    email: "james.taylor@example.com",
    phone: "(555) 789-0123",
    startDate: "2019-04-30",
    department: "Engineering",
  },
  {
    id: "8",
    firstName: "Olivia",
    lastName: "Anderson",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "Customer Support",
    grade: "G2",
    branch: "Chicago",
    status: "active",
    email: "olivia.anderson@example.com",
    phone: "(555) 890-1234",
    startDate: "2022-02-11",
    department: "Customer Success",
  },
  {
    id: "9",
    firstName: "Daniel",
    lastName: "Thomas",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "Product Manager",
    grade: "G6",
    branch: "New York",
    status: "active",
    email: "daniel.thomas@example.com",
    phone: "(555) 901-2345",
    startDate: "2020-06-22",
    department: "Product",
  },
  {
    id: "10",
    firstName: "Sophia",
    lastName: "Jackson",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "UX Designer",
    grade: "G4",
    branch: "San Francisco",
    status: "inactive",
    email: "sophia.jackson@example.com",
    phone: "(555) 012-3456",
    startDate: "2021-08-05",
    department: "Design",
  },
  {
    id: "11",
    firstName: "Matthew",
    lastName: "White",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "DevOps Engineer",
    grade: "G5",
    branch: "London",
    status: "active",
    email: "matthew.white@example.com",
    phone: "(555) 123-4567",
    startDate: "2020-11-19",
    department: "Engineering",
  },
  {
    id: "12",
    firstName: "Emma",
    lastName: "Harris",
    avatar: "/placeholder.svg?height=32&width=32",
    jobTitle: "Content Writer",
    grade: "G3",
    branch: "Chicago",
    status: "pending",
    email: "emma.harris@example.com",
    phone: "(555) 234-5678",
    startDate: "2022-01-07",
    department: "Marketing",
  },
]

export default function EmployeeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true)
        // Fetch the employee data from the JSON file
        // const response = await fetch("/data/employees.json")

        // if (!response.ok) {
        //   throw new Error(`Failed to fetch employee data: ${response.status} ${response.statusText}`)
        // }

        // const data = await response.json()
        const data = tableData

        // Find the employee with the matching ID
        const foundEmployee = data.find((emp: Employee) => emp.id === params.id)

        if (!foundEmployee) {
          throw new Error(`Employee with ID ${params.id} not found`)
        }

        setEmployee(foundEmployee)
        setError(null)
      } catch (err) {
        console.error("Error fetching employee details:", err)
        setError(err instanceof Error ? err.message : "Failed to load employee details")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEmployeeDetails()
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
  const StatusBadge = ({ status }: { status: Employee["status"] }) => {
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
          <Link href={'/dashboard/employee/add'}>
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
                      alt={`${employee.firstName} ${employee.lastName}`}
                    />
                    <AvatarFallback className="text-lg">
                      {employee.firstName[0]}
                      {employee.lastName[0]}
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
      )}
    </CustomPage>
  )
}
