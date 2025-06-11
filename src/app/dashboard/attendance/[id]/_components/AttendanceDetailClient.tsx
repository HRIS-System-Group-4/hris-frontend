'use client';

import React, { useEffect, useState } from 'react';
import AttendanceDetailsPage from './AttendanceEmployeeDetailPage';
import { AttendanceRecord } from '@/components/table/attendance/employee/schema';
import { attendanceService, getAttendanceDetail } from '@/services/attendanceService';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';

interface AttendanceDetailClientProps {
  id: string;
  checkClock?: boolean;  
}

export function AttendanceDetailClient({ id, checkClock = false }: AttendanceDetailClientProps) {
  const [data, setData] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Id:", id)
      console.log("CheckClock:", checkClock)
      console.log("user:", user)
      let data
      if (user?.is_admin) {
        data = await getAttendanceDetail(id, checkClock);
      } else {
        data = await attendanceService.getAttendanceById(id);
      }
      if (!data) {
        setError('Data tidak ditemukan.');
      } else {
        setData(data);
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Terjadi kesalahan saat mengambil data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user,id]);

  if (loading) return <p>Loading attendance detail...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return <p>Data tidak ditemukan.</p>;

  return <AttendanceDetailsPage rawData={data} />;
}
