"use client"

import { TableCheckClock } from "@/components/table/table-check-clock";
import { Button } from "@/components/ui/button";
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page";
import { Plus } from "lucide-react";
import Link from "next/link";

type CheckClock = {
  id: string
  name: string
  totalEmployee: string
  type: "wfo" | "wfa" | "hybrid"
}

const tableData: CheckClock[] = [
  {
    id: "1",
    name: "Kantor Jakarta",
    totalEmployee: "120",
    type: "wfo",
  },
  {
    id: "2",
    name: "Remote Team Bandung",
    totalEmployee: "45",
    type: "wfa",
  },
  {
    id: "3",
    name: "Divisi Tech Hybrid",
    totalEmployee: "60",
    type: "hybrid",
  },
  {
    id: "4",
    name: "Kantor Surabaya",
    totalEmployee: "80",
    type: "wfo",
  },
]


export default function CheckClockPage() {
    return (
      <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Check Clock Management</CustomPageTitle>
          <CustomPageSubtitle>Manage and organize all your check clock setting</CustomPageSubtitle>
        </CustomPageTitleContainer>
        <CustomPageTitleButtons>
          <Link href={'/dashboard/check-clock/add'}>
            <Button variant="default" size={"lg"}>
              <Plus />
              Add Check Clock</Button>
          </Link>
        </CustomPageTitleButtons>
      </CustomPageHeader>
      <TableCheckClock data={tableData} />
    </CustomPage>
    )
  }
  