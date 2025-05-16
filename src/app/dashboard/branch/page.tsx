"use client"

import { TableBranch } from "@/components/table/table-branch"
import { Button } from "@/components/ui/button"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"
import { Plus, Table } from "lucide-react"
import Link from "next/link"

type Branch = {
  id: string
  name: string
  address: string
  city: string
  country: string
  status: "active" | "inactive"
}

const tableData: Branch[] = [
  {
    id: "1",
    name: "Jakarta Headquarters",
    address: "Jl. Sudirman No. 55",
    city: "Jakarta",
    country: "Indonesia",
    status: "active",
  },
  {
    id: "2",
    name: "Bandung Office",
    address: "Jl. Dago Atas No. 12",
    city: "Bandung",
    country: "Indonesia",
    status: "inactive",
  },
  {
    id: "3",
    name: "Singapore Branch",
    address: "10 Marina Boulevard",
    city: "Singapore",
    country: "Singapore",
    status: "active",
  },
  {
    id: "4",
    name: "New York Office",
    address: "123 5th Ave",
    city: "New York",
    country: "USA",
    status: "active",
  },
  {
    id: "5",
    name: "Tokyo Branch",
    address: "1-2-3 Shibuya",
    city: "Tokyo",
    country: "Japan",
    status: "inactive",
  },
]



export default function BranchPage() {
  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Branch Management</CustomPageTitle>
          <CustomPageSubtitle>Manage and organize all your branch offices</CustomPageSubtitle>
        </CustomPageTitleContainer>
        <CustomPageTitleButtons>
          <Link href={'/dashboard/branch/add'}>
            <Button variant="default" size={"lg"}>
              <Plus />
              Add Branch</Button>
          </Link>
        </CustomPageTitleButtons>
      </CustomPageHeader>
      <TableBranch data={tableData} />
      {/* <h2 className="text-lg font-medium mb-4">Employee Management</h2> */}
    </CustomPage>
  )
}
