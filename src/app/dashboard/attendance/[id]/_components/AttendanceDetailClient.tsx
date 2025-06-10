'use client';

import React, { useEffect, useState } from 'react';
import AttendanceDetailsPage from './AttendanceEmployeeDetailPage';
import { AttendanceRecord } from '@/components/table/attendance/employee/schema';
import { attendanceService } from '@/services/attendanceServices';

interface AttendanceDetailClientProps {
  id: string;
}

export function AttendanceDetailClient({ id }: AttendanceDetailClientProps) {
  const [data, setData] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || '';
      const result = await attendanceService.getAttendanceById(id, token);

      if (!result) {
        setError('Data tidak ditemukan.');
      } else {
        setData(result);
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
    fetchData();
  }, [id]);

  if (loading) return <p>Loading attendance detail...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return <p>Data tidak ditemukan.</p>;

  return <AttendanceDetailsPage rawData={data} />;
}
