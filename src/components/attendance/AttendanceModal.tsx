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
  // State untuk menyimpan jenis absensi, default "Clock In"
  const [attendanceType, setAttendanceType] = useState("Clock In");

  // State untuk tanggal dan waktu absensi
  const [attendanceDate, setAttendanceDate] = useState<Date | undefined>(undefined);

  // State untuk menyimpan file bukti presensi (optional)
  const [file, setFile] = useState<File | null>(null);

  // State untuk lokasi yang diambil otomatis dari device (latitude dan longitude)
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  // State loading lokasi (tunggu proses pengambilan lokasi device)
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Fungsi untuk mengambil lokasi device menggunakan Geolocation API
  const fetchLocation = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoadingLocation(false);
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        toast({
          title: "Lokasi berhasil didapatkan",
          description: `Latitude: ${position.coords.latitude.toFixed(6)}, Longitude: ${position.coords.longitude.toFixed(6)}`,
        });
      },
      (error) => {
        setLoadingLocation(false);
        toast({
          title: "Gagal mendapatkan lokasi",
          description:
            "Mohon izinkan akses lokasi pada browser Anda agar absensi dengan lokasi otomatis dapat dilakukan.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true }
    );
  };

  // Fungsi submit form absensi
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

    if (lat === null || lng === null) {
      toast({
        title: "Location Error",
        description: "Lokasi belum tersedia. Klik tombol 'Ambil Lokasi' terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    const baseUrl = "http://127.0.0.1:8000";
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

    // Format jam dari attendanceDate, misal "14:30:00"
    const timeString = attendanceDate.toTimeString().split(" ")[0];
    formData.append("check_clock_time", timeString);

    // Kirim latitude dan longitude sebagai string
    formData.append("latitude", lat.toString());
    formData.append("longitude", lng.toString());

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
      if (!response.ok) throw new Error(result.message || "Gagal mengirim data absensi.");

      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          <Plus className="mr-2" /> Add Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Attendance</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new attendance record. Use the button below to get your current location.
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
                  <DropdownMenuItem key={type} onSelect={() => setAttendanceType(type)}>
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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

          <div>
            <label className="text-sm font-medium">Attendance Location</label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={fetchLocation}
                disabled={loadingLocation}
                variant="outline"
              >
                {loadingLocation ? "Mengambil Lokasi..." : "Ambil Lokasi"}
              </Button>
              {lat !== null && lng !== null && (
                <p>
                  Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
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
