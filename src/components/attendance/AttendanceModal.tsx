"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DatePicker } from "@/components/date-picker"

export function AttendanceModal() {
  const [attendanceType, setAttendanceType] = useState("Clock In")
  const [attendanceDate, setAttendanceDate] = useState<Date | undefined>(undefined)
  const [leaveStartDate, setLeaveStartDate] = useState<Date | undefined>(undefined)
  const [leaveEndDate, setLeaveEndDate] = useState<Date | undefined>(undefined)
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!attendanceDate) {
      alert("Please select attendance date")
      return
    }

    // Handle submission logic here (e.g., send to backend)
    console.log({
      attendanceType,
      attendanceDate,
      leaveStartDate,
      leaveEndDate,
      file,
    })
  }

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
            <label htmlFor="attendance-date" className="text-sm font-medium">
              Attendance Date
            </label>
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
                {["Clock In", "Clock Out", "Absent", "Annual Leave", "Sick Leave"].map(
                  (type) => (
                    <DropdownMenuItem
                      key={type}
                      onSelect={() => setAttendanceType(type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {(attendanceType === "Absent" ||
            attendanceType === "Annual Leave" ||
            attendanceType === "Sick Leave") && (
            <>
              <div>
                <label htmlFor="start-date" className="text-sm font-medium">
                  Start Date
                </label>
                <DatePicker
                  value={leaveStartDate}
                  onChange={setLeaveStartDate}
                  placeholder="Select start date"
                />
              </div>

              <div>
                <label htmlFor="end-date" className="text-sm font-medium">
                  End Date
                </label>
                <DatePicker
                  value={leaveEndDate}
                  onChange={setLeaveEndDate}
                  placeholder="Select end date"
                />
              </div>
            </>
          )}

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
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
