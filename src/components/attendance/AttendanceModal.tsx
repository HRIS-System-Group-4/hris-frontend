"use client";
import { useRouter } from "next/navigation";

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
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const getLocation = (): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const isClockType = attendanceType === "Clock In" || attendanceType === "Clock Out";
    const isLeaveType = ["Absent", "Annual Leave", "Sick Leave"].includes(attendanceType);

    if (isLeaveType && (!leaveStartDate || !leaveEndDate)) {
      toast({
        title: "Validation Error",
        description: "Please select start and end date.",
        variant: "destructive",
      });
      setLoadingSubmit(false);
      return;
    }

    let lat: number | null = null;
    let lng: number | null = null;

    if (isClockType) {
      try {
        const location = await getLocation();
        lat = location.lat;
        lng = location.lng;
      } catch {
        toast({
          title: "Gagal mendapatkan lokasi",
          description: "Mohon izinkan akses lokasi pada browser Anda.",
          variant: "destructive",
        });
        setLoadingSubmit(false);
        return;
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const endpointMap: Record<string, string> = {
      "Clock In": `${baseUrl}/api/clock-in`,
      "Clock Out": `${baseUrl}/api/clock-out`,
      "Absent": `${baseUrl}/api/absent`,
      "Annual Leave": `${baseUrl}/api/leave`,
      "Sick Leave": `${baseUrl}/api/leave`,
    };

    const endpoint = endpointMap[attendanceType];
    const formData = new FormData();

    if (isClockType && lat !== null && lng !== null) {
      formData.append("latitude", lat.toString());
      formData.append("longitude", lng.toString());
    }

    if (isLeaveType && leaveStartDate && leaveEndDate) {
      formData.append("start_date", leaveStartDate.toISOString().split("T")[0]);
      formData.append("end_date", leaveEndDate.toISOString().split("T")[0]);

      formData.append("start_date", leaveStartDate.toISOString().split("T")[0]);
      formData.append("end_date", leaveEndDate.toISOString().split("T")[0]);

      // ⬇️ Tambahkan bagian ini di dalam blok ini
      const clockTypeMap: Record<string, string> = {
        "Annual Leave": "3",
        "Sick Leave": "4",
      };

      if (attendanceType in clockTypeMap) {
        formData.append("check_clock_type", clockTypeMap[attendanceType]);
      }
    }

    if (file) formData.append("proof", file);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal mengirim data.");

      toast({ title: "Success", description: result.message });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" onClick={() => setOpen(true)}>
          <Plus className="mr-2" /> Add Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Attendance</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new attendance record.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Attendance Type */}
          <div>
            <label className="text-sm font-medium">Type</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {attendanceType || "Select type"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {["Clock In", "Clock Out", "Absent", "Annual Leave", "Sick Leave"].map((type) => (
                  <DropdownMenuItem key={type} onSelect={() => setAttendanceType(type)}>
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Leave Dates */}
          {["Absent", "Annual Leave", "Sick Leave"].includes(attendanceType) && (
            <>
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <DatePicker
                  value={leaveStartDate}
                  onChange={setLeaveStartDate}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <DatePicker
                  value={leaveEndDate}
                  onChange={setLeaveEndDate}
                  placeholder="Select end date"
                />
              </div>
            </>
          )}

          {/* File Upload */}
          <div>
            <label className="text-sm font-medium">Proof of Attendance</label>
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

          {/* Submit */}
          <div className="flex justify-end gap-2 mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? "Submitting..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
