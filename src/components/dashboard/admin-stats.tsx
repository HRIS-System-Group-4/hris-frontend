// // import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

// // import { Badge } from "@/components/ui/badge"
// // import {
// //   Card,
// //   CardAction,
// //   CardDescription,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card"

// // export function AdminStats() {
// //   return (
// //     <div className="grid auto-rows-min gap-4 md:grid-cols-4">
// //         <Card>
// //           <CardHeader>
// //             <CardDescription>Total Employee</CardDescription>
// //             <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
// //               230
// //             </CardTitle>
// //           </CardHeader>
// //           <CardFooter className="border-t">
// //             <p className="text-xs font-normal text-neutral-400">Update: 23 Apr 2025</p>
// //           </CardFooter>
// //         </Card>
// //         <Card>
// //           <CardHeader>
// //             <CardDescription>Attendance Today</CardDescription>
// //             <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
// //               90%
// //             </CardTitle>
// //           </CardHeader>
// //           <CardFooter className="border-t">
// //             <p className="text-xs font-normal text-neutral-400">Update: 23 Apr 2025</p>
// //           </CardFooter>
// //         </Card>
// //         <Card>
// //           <CardHeader>
// //             <CardDescription>Leaves Today</CardDescription>
// //             <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
// //               12
// //             </CardTitle>
// //           </CardHeader>
// //           <CardFooter className="border-t">
// //             <p className="text-xs font-normal text-neutral-400">Update: 23 Apr 2025</p>
// //           </CardFooter>
// //         </Card>
// //         <Card>
// //           <CardHeader>
// //             <CardDescription>Request Leave</CardDescription>
// //             <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
// //               1
// //             </CardTitle>
// //           </CardHeader>
// //           <CardFooter className="border-t">
// //             <p className="text-xs font-normal text-neutral-400">Update: 23 Apr 2025</p>
// //           </CardFooter>
// //         </Card>
// //       </div>
// //   )
// // }
// "use client"

// import { useEffect, useState } from "react"
// import {
//   Card,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// export function AdminStats() {
//   const [stats, setStats] = useState({
//     total_employees: 0,
//     attendance_percent: 0,
//     leaves_today: 0,
//     requested_leave: 0,
//   })

//   useEffect(() => {
//     fetch("http://localhost:8000/api/dashboard") // ganti sesuai URL backend kamu
//       .then((res) => res.json())
//       .then((data) => {
//         setStats(data)
//       })
//       .catch((err) => console.error("Failed to fetch dashboard stats:", err))
//   }, [])

//   return (
//     <div className="grid auto-rows-min gap-4 md:grid-cols-4">
//       <Card>
//         <CardHeader>
//           <CardDescription>Total Employee</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             {stats.total_employees}
//           </CardTitle>
//         </CardHeader>
//         <CardFooter className="border-t">
//           <p className="text-xs font-normal text-neutral-400">
//             Update: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
//           </p>
//         </CardFooter>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardDescription>Attendance Today</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             {stats.attendance_percent}%
//           </CardTitle>
//         </CardHeader>
//         <CardFooter className="border-t">
//           <p className="text-xs font-normal text-neutral-400">
//             Update: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
//           </p>
//         </CardFooter>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardDescription>Leaves Today</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             {stats.leaves_today}
//           </CardTitle>
//         </CardHeader>
//         <CardFooter className="border-t">
//           <p className="text-xs font-normal text-neutral-400">
//             Update: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
//           </p>
//         </CardFooter>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardDescription>Request Leave</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             {stats.requested_leave}
//           </CardTitle>
//         </CardHeader>
//         <CardFooter className="border-t">
//           <p className="text-xs font-normal text-neutral-400">
//             Update: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AdminStats() {
  const [stats, setStats] = useState({
    total_employees: 0,
    attendance_percent: 0,
    leaves_today: 0,
    requested_leave: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // tidak ada token, jangan lanjut

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/index", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch stats", res.status);
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []); // hanya jalan sekali saat komponen mount

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Employee</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.total_employees}
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Attendance Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.attendance_percent}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Leaves Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.leaves_today}
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Request Leave</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.requested_leave}
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
