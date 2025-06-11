"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CustomPage,
  CustomPageHeader,
  CustomPageSubtitle,
  CustomPageTitle,
  CustomPageTitleButtons,
  CustomPageTitleContainer,
} from "@/components/ui/custom-page";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTableEmployee } from "@/components/table/employee/admin/data-table";

import axios from "axios";
import { getEmployees } from "@/services/employeeService";
import EmployeeSection from "@/components/employee/EmployeeSection";

export default function EmployeePage() {
  return (

    <EmployeeSection />

  );
}
