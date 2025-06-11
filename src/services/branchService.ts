import axiosInstance from "@/lib/axios";

export async function getCsrfCookie() {
  await axiosInstance.get('/sanctum/csrf-cookie');
}

export async function indexBranch() {
  const token = localStorage.getItem("token")
  const response = await axiosInstance.get("/api/branches/index", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
  return response // sesuaikan jika struktur response berbeda
}

export async function overview() {
  console.log("Mengambil data cabang...")

  // Panggil getCsrfCookie jika memang diperlukan sebelum request (misalnya untuk Laravel Sanctum)
  // await getCsrfCookie()

  const token = localStorage.getItem("token")
  const response = await axiosInstance.get("/api/branches", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  console.log("Response cabang:", response)

  return response.data.data // sesuaikan jika struktur response berbeda
}

export type BranchDetail = {
  branch_name: string
  address: string
  city: string
  country: string
  status: "active" | "inactive"
  latitude: string
  longitude: string
}

export async function getBranchDetail(id: string, token: string): Promise<BranchDetail> {
  const response = await axiosInstance.get(`/api/branches/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  return response.data.data
}

export async function addBranch(data: {
  branch_name: string
  address: string
  city: string
  country: string
  latitude: number | null
  longitude: number | null
  status: "Active" | "Inactive"
}) {
  console.log("Mengirim data branch...", data)

  const token = localStorage.getItem("token")
  const response = await axiosInstance.post("/api/add-branch", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  console.log("Response tambah branch:", response)

  return response.data
}

export async function updateBranch(id: string, payload: any) {
  const token = localStorage.getItem("token")
  const response = await axiosInstance.put(`/api/branches/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  return response.data
}
