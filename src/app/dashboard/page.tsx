"use client"

import DashboardAdmin from "@/components/dashboard/dashboard-admin";
import DashboardEmployee from "@/components/dashboard/dashboard-employee";
import SkeletonDashboard from "@/components/skeletons/skeleton-dashboard";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardPage() {

  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <SkeletonDashboard />
  }

  return (
    <div>
      {user?.is_admin ? <DashboardAdmin /> : <DashboardEmployee />}
    </div>
  )
}