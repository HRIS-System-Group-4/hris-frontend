import axiosInstance from "@/lib/axios";

export async function getCheckClockSettings() {
    const response = await axiosInstance.get('/api/check-clock-settings', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
    console.log("response", response);
    return response.data;
}

export async function getCheckClockSettingsById(id: string) {
    const response = await axiosInstance.get(`/api/check-clock-settings/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
    console.log("response", response.data);
    return response.data;
}

export async function addCheckClockSetting(payload: any) {
    console.log("Mengirim data check clock...", payload)
    const token = localStorage.getItem("token")
    const response = await axiosInstance.post(`/api/add/check-clock-settings`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
    console.log("Response:", response)
  
    return response.data
  }