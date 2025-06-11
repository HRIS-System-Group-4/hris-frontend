import axiosInstance from "@/lib/axios"

export type Option = {
  label: string
  value: string
}

export async function fetchBranches(): Promise<Option[]> {
  const token = localStorage.getItem("token")
  const res = await axiosInstance.get("/api/branches/index", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data.map((branch: any) => ({
    label: branch.branch_name,
    value: String(branch.id),
  }))
}

export async function fetchCheckClockSettings(): Promise<Option[]> {
  const token = localStorage.getItem("token")
  const res = await axiosInstance.get("/api/check-clock-settings", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data.map((item: any) => ({
    label: item.name,
    value: String(item.id),
  }))
}

export async function createEmployee(payload: FormData) {
  const token = localStorage.getItem("token")
  const res = await axiosInstance.post("/api/add-employees", payload, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })

  return res.data
}

export async function fetchEmployeeDetails(id: string) {
  const token = localStorage.getItem("token") 

  const response = await axiosInstance.get(`/api/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  })

  return response.data
}

export async function updateEmployee(id: string, payload: FormData) {
  const token = localStorage.getItem("token")
  const response = await axiosInstance.post(`/api/employees/${id}?_method=PUT`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}
