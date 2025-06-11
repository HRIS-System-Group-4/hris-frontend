// "use client";

// import React, { useEffect, useState } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import { DataTableAttendanceEmployee } from "./data-table";
// import { attendanceService } from "@/services/attendanceServices";

// interface AttendanceRecord {
//   date: string;
//   attendance_type: string;
//   clock_in_time: string | null;
//   approval: string | null;
//   work_hours: string | null;
// }

// interface AttendanceTableClientProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
// }

// export function AttendanceTableClient<TData extends AttendanceRecord, TValue>({
//   columns,
// }: AttendanceTableClientProps<TData, TValue>) {
//   const [data, setData] = useState<TData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await attendanceService.getAttendanceRecords();
//         // response shape: { message: string, data: AttendanceRecord }
//         // Wrap data into array because table expects array
//         setData([response.data] as TData[]);
//       } catch (error: any) {
//         console.error("Fetch error:", error);
//         setError(
//           error.response?.data?.message ||
//             error.message ||
//             "Terjadi kesalahan saat mengambil data"
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   if (loading) return <p>Loading attendance data...</p>;
//   if (error) return <p className="text-red-500">Error: {error}</p>;

//   return <DataTableAttendanceEmployee data={data} columns={columns} />;
// }
"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableAttendanceEmployee } from "./data-table";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceRecord } from "./schema";

interface AttendanceTableClientProps {
  columns: ColumnDef<AttendanceRecord>[];
  refreshKey?: number; // Tambahan untuk trigger refetch dari luar
}

export function AttendanceTableClient({ columns, refreshKey }: AttendanceTableClientProps) {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const attendanceData = await attendanceService.getAttendanceRecords();

      // Jika API mengembalikan array langsung, pakai langsung
      // Jika hanya satu record, bungkus jadi array
      const formattedData = Array.isArray(attendanceData) ? attendanceData : [attendanceData];
      setData(formattedData);
    } catch (error: any) {
      console.error("Fetch error:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat mengambil data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]); // Refetch data setiap refreshKey berubah

  if (loading) return <p>Loading attendance data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return <DataTableAttendanceEmployee data={data} columns={columns} isLoading={false} skeletonRowCount={5}/>;
}
