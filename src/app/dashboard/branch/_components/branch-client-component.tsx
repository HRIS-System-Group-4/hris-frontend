"use client";

import { useEffect, useState } from "react";
import { columns } from "@/components/table/branch/admin/columns";
import { DataTableBranch } from "@/components/table/branch/admin/data-table";
import { overview } from "@/services/branchService";

type BranchDetail = {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  status: "active" | "inactive";
  latitude: string;
  longitude: string;
};

export default function BranchClientComponent() {
  const [data, setData] = useState<BranchDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branches = await overview();
        setData(branches);
      } catch (err) {
        setError("Failed to load branch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <DataTableBranch data={data} columns={columns} />;
}
