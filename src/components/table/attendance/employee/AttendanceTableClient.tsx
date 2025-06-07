"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableAttendanceEmployee } from "./data-table";

interface AttendanceTableClientProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  endpoint?: string;
}

export function AttendanceTableClient<TData, TValue>({
  columns,
  endpoint = "http://127.0.0.1:8000/api/check-clocks/records",
}: AttendanceTableClientProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Gagal fetch data: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        if (!json.data || !Array.isArray(json.data)) {
          throw new Error("Format data tidak valid");
        }

        setData(json.data);
      } catch (error: any) {
        console.error("Fetch error:", error.message);
        setError(error.message || "Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  if (loading) return <p>Loading attendance data...</p>;

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return <DataTableAttendanceEmployee data={data} columns={columns} />;
}
