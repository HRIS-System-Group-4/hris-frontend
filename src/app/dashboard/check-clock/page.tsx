import { Metadata } from "next"
import path from "path"
import fs from "fs"
import { DataTableCheckClock } from "@/components/table/check-clock/admin/data-table";
import { TableCheckClock } from "@/components/table/table-check-clock";
import { Button } from "@/components/ui/button";
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page";
import { Plus } from "lucide-react";
import Link from "next/link";

import { getCheckClockSettings } from "@/services/checkClockService";
import CheckClockSection from "@/components/check-clock/CheckClockSection";

export const metadata: Metadata = {
  title: "Check Clock",
  description: "A Expense tracker build using Tanstack Table."
};

export default async function CheckClockPage() {
  return (
    <CheckClockSection/>
  )
}
