
// src/components/table/attendance/schema.ts

export interface AttendanceRecord {
  date: string; // yyyy-mm-dd, contoh: "2025-06-08"
  clockIn?: string | null;  // jam masuk "08:00:00" atau null
  clockOut?: string | null; // jam keluar "17:00:00" atau null
  workHours?: { hours: number; minutes: number } | null; // {hours: 8, minutes: 0} atau null
  attendanceType: 'On Time' | 'Late' | 'Sick Leave' | 'Absent' | 'Annual Leave' | 'Diluar jam kerja'; // sesuai BE
  approval?: 'approve' | 'rejected' | 'waiting' | null;
}
