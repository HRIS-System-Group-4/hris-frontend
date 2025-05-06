"use client"

import { TableEmployees } from "@/components/table/table-employees"
import { Button } from "@/components/ui/button"
import { CardHeader } from "@/components/ui/card"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"
import { Plus } from "lucide-react"
import Link from "next/link"

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


export default function EmployeePage() {
  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Employee Management</CustomPageTitle>
          <CustomPageSubtitle>Manage and organize all your employees' data</CustomPageSubtitle>
        </CustomPageTitleContainer>
        <CustomPageTitleButtons>
          <Button variant="outline" size={"lg"}>Import</Button>
          <Button variant="outline" size={"lg"}>Export</Button>
          <Link href={'/dashboard/employee/add'}>
            <Button variant="default" size={"lg"}>
              <Plus />
              Add Employee</Button>
          </Link>
        </CustomPageTitleButtons>
      </CustomPageHeader>
      <TableEmployees data={tableData} />
      {/* <h2 className="text-lg font-medium mb-4">Employee Management</h2> */}
    </CustomPage>
  )
}
