import axiosInstance from "@/lib/axios";

export const getAdminDashboardStats = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  const response = await axiosInstance.get("/api/index", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true
  });

  return response.data;
};

export const getEmployeeDashboardStats = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  const response = await axiosInstance.get("/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true
  });

  return response.data;
};


export const getWorkHoursTrend = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  const response = await axiosInstance.get("/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  });

  const summary = response.data.daily_summary;

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const chartData = daysOfWeek.map((day) => ({
    date: day.charAt(0).toUpperCase() + day.slice(1), // Capitalize day
    desktop: summary[day]?.average_daily_working_hours || 0,
    mobile: summary[day]?.overtime || 0,
  }));

  return chartData;
};

export const getTimeOffDistribution = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  const response = await axiosInstance.get("/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  });

  const data = response.data;
  const lainnya = data.total_leave_days - data.total_annual_leave_days - data.total_sick_leave_days;

  const chartData = [
    {
      browser: "Cuti Tahunan",
      visitors: data.total_annual_leave_days,
      fill: "var(--color-chart-1)",
    },
    {
      browser: "Cuti Sakit",
      visitors: data.total_sick_leave_days,
      fill: "var(--color-chart-2)",
    },
    {
      browser: "Cuti Lainnya",
      visitors: lainnya > 0 ? lainnya : 0,
      fill: "var(--color-chart-3)",
    },
  ];

  return chartData;
};
