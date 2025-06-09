import axiosInstance from "@/lib/axios";
import axios from "axios";

export const getAdminDashboardStats = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  const response = await axiosInstance.get("http://127.0.0.1:8000/api/index", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  return response.data;
};
