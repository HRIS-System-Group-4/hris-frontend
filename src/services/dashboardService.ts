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
