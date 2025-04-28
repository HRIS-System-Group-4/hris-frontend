"use client"

import { useSelector } from "react-redux";

export default function EmployeesPage() {

    const user = useSelector((state: any) => state.auth.user);
    return (
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-medium mb-4">Employee Management</h2>
        <p>{user.email}</p>
      </div>
    )
  }
  