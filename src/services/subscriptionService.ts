import axiosInstance from "@/lib/axios"

export type Billing = {
  id: string
  created_at: string
  invoiceDate: string
  plan: string
  amount: string
  status: "pending" | "processing" | "paid" | "failed"
  pricing?: {
    name: string
  }
}

export async function fetchBillingHistory(): Promise<Billing[]> {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Unauthorized: Token not found")

  const response = await axiosInstance.get("/api/subscription/billing", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  return response.data.data.map((item: any) => ({
    id: item.id,
    invoiceDate: item.created_at,
    plan: item.plan_name ?? "-",
    amount: item.amount,
    status: item.status,
  }))
}

export async function fetchSubscriptionStatus(): Promise<{
  subscription_active: boolean
  expires_at: string | null
  plan_name: string | null
}> {
  const token = localStorage.getItem("token")
  const response = await axiosInstance.get("/api/subscription/status", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  return response.data
}

export async function activateSubscription(payload: {
  plan: string
  additional_employees: number
}) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Unauthorized: Token not found")

  try {
    const response = await axiosInstance.post("/api/subscription/activate", {
      plan: payload.plan,
      additional_employees: payload.additional_employees,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    return response.data
  } catch (error: any) {
    const message = error.response?.data?.message || "Something went wrong"
    throw new Error(message)
  }
}

export async function getPlans(): Promise<{ id: string; name: string }[]> {
  const token = localStorage.getItem("token")

  const response = await axiosInstance.get("/api/subscription/plans", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  return response.data
}