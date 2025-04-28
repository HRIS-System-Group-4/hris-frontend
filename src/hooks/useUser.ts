"use client"

import { useEffect, useState } from "react"

export type User = {
  id: string
  email: string
  is_admin: number
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Saat halaman dibuka, cek di localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return { user }
}