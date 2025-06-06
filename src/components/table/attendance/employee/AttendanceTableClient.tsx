"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableAttendanceEmployee } from "./data-table";

interface AttendanceTableClientProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export function AttendanceTableClient<TData, TValue>({
    columns,
}: AttendanceTableClientProps<TData, TValue>) {
    const [data, setData] = useState<TData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
                const res = await fetch("http://localhost:8000/api/check-clocks/records", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`Gagal fetch data: ${res.status} ${res.statusText}`);
                }

                const json = await res.json();
                setData(json);
            } catch (error: any) {
                console.error("Fetch error:", error.message);
                setError(error.message || "Terjadi kesalahan saat mengambil data");
            } finally {
                setLoading(false); // PENTING!
            }
        }

        fetchData();
    }, []);
    
    if (loading) return <p>Loading attendance data...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return <DataTableAttendanceEmployee data={data} columns={columns} />;
}
