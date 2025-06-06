// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogClose,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { DatePicker } from "@/components/date-picker";
// import { toast } from "@/components/ui/use-toast";

// export function AttendanceModal() {
//   const [attendanceType, setAttendanceType] = useState("Clock In");
//   const [attendanceDate, setAttendanceDate] = useState<Date | undefined>(
//     undefined
//   );
//   const [leaveStartDate, setLeaveStartDate] = useState<Date | undefined>(
//     undefined
//   );
//   const [leaveEndDate, setLeaveEndDate] = useState<Date | undefined>(undefined);
//   const [file, setFile] = useState<File | null>(null);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!attendanceDate) {
//       alert("Please select attendance date");
//       return;
//     }

//     const messages: Record<string, { title: string; description: string }> = {
//       "Clock In": {
//         title: "Clock In Successful",
//         description: "Your attendance has been recorded.",
//       },
//       "Clock Out": {
//         title: "Clock Out Successful",
//         description: "Your work session has ben recorded.",
//       },
//       Absent: {
//         title: "Absence Recorded Successfully",
//         description: "Your absence has been logged.",
//       },
//       "Annual Leave": {
//         title: "Annual Leave Request Sent",
//         description: "Waiting for admin approval. See all request here.",
//       },
//       "Sick Leave": {
//         title: "Sick Leave Request Sent",
//         description: "Waiting for admin approval. See all request here.",
//       },
//     };

//     const message = messages[attendanceType];

//     if (message) {
//     toast({
//       title: message.title,
//       description: message.description,
//       variant: "default",
//     });
//   }

//     // Handle submission logic here (e.g., send to backend)
//     console.log({
//       attendanceType,
//       attendanceDate,
//       leaveStartDate,
//       leaveEndDate,
//       file,
//     });
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="default" size="lg">
//           <Plus className="mr-2" />
//           Add Attendance
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Add Attendance</DialogTitle>
//           <DialogDescription>
//             Fill in the form below to add a new attendance record.
//           </DialogDescription>
//         </DialogHeader>

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="attendance-date" className="text-sm font-medium">
//               Attendance Date
//             </label>
//             <DatePicker
//               value={attendanceDate}
//               onChange={setAttendanceDate}
//               placeholder="Select attendance date"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Type</label>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="w-full justify-start">
//                   {attendanceType || "Select type"}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-full">
//                 {[
//                   "Clock In",
//                   "Clock Out",
//                   "Absent",
//                   "Annual Leave",
//                   "Sick Leave",
//                 ].map((type) => (
//                   <DropdownMenuItem
//                     key={type}
//                     onSelect={() => setAttendanceType(type)}
//                   >
//                     {type}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {(attendanceType === "Absent" ||
//             attendanceType === "Annual Leave" ||
//             attendanceType === "Sick Leave") && (
//             <>
//               <div>
//                 <label htmlFor="start-date" className="text-sm font-medium">
//                   Start Date
//                 </label>
//                 <DatePicker
//                   value={leaveStartDate}
//                   onChange={setLeaveStartDate}
//                   placeholder="Select start date"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="end-date" className="text-sm font-medium">
//                   End Date
//                 </label>
//                 <DatePicker
//                   value={leaveEndDate}
//                   onChange={setLeaveEndDate}
//                   placeholder="Select end date"
//                 />
//               </div>
//             </>
//           )}

//           <div>
//             <label htmlFor="proof" className="text-sm font-medium">
//               Proof of Attendance
//             </label>
//             <label
//               htmlFor="proof"
//               className="block w-full mt-1 px-3 py-2 border rounded-md text-muted-foreground bg-white cursor-pointer"
//             >
//               {file?.name || "No file chosen"}
//             </label>
//             <input
//               id="proof"
//               type="file"
//               onChange={(e) => setFile(e.target.files?.[0] || null)}
//               className="hidden"
//             />
//           </div>

//           <div className="flex justify-end gap-2">
//             <DialogClose asChild>
//               <Button type="button" variant="outline">
//                 Cancel
//               </Button>
//             </DialogClose>
//             <DialogClose asChild>
//               <Button type="submit">Add</Button>
//             </DialogClose>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { toast } from "@/components/ui/use-toast";

export function AttendanceModal() {
  const [attendanceType, setAttendanceType] = useState("Clock In");
  const [attendanceDate, setAttendanceDate] = useState<Date | undefined>(undefined);
  const [leaveStartDate, setLeaveStartDate] = useState<Date | undefined>(undefined);
  const [leaveEndDate, setLeaveEndDate] = useState<Date | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!attendanceDate) {
      toast({
        title: "Validation Error",
        description: "Please select attendance date.",
        variant: "destructive",
      });
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    // Tentukan endpoint berdasarkan jenis absensi
    const endpoint =
      attendanceType === "Clock In"
        ? `${baseUrl}/api/clock-in`
        : attendanceType === "Clock Out"
        ? `${baseUrl}/api/clock-out`
          : null;

    if (!endpoint) {
      toast({
        title: "Error",
        description: "Jenis absensi belum terhubung ke backend.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("check_clock_time", attendanceDate.toTimeString().split(" ")[0]); // contoh hasil: 13:45:00

    if (file) {
      formData.append("proof", file);
    }

    // Dummy coordinates, bisa diambil dari geolocation API
    formData.append("latitude", "-6.200000");
    formData.append("longitude", "106.816666");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // atau pakai cookies jika pakai Sanctum
          credentials: 'include'
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengirim data absensi.");
      }

      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          <Plus className="mr-2" />
          Add Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Attendance</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new attendance record.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Attendance Date</label>
            <DatePicker
              value={attendanceDate}
              onChange={setAttendanceDate}
              placeholder="Select attendance date"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {attendanceType || "Select type"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {["Clock In", "Clock Out"].map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onSelect={() => setAttendanceType(type)}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label htmlFor="proof" className="text-sm font-medium">
              Proof of Attendance
            </label>
            <label
              htmlFor="proof"
              className="block w-full mt-1 px-3 py-2 border rounded-md text-muted-foreground bg-white cursor-pointer"
            >
              {file?.name || "No file chosen"}
            </label>
            <input
              id="proof"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">Add</Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
