'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validasi password bisa ditambahkan di sini
    router.push("/auth/reset-password/reset-password-success") // ✅ path sesuai struktur folder kamu
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-2xl px-6 py-8">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 h-10 w-10">
              <img
                src="/logo.png"
                alt="HRIS Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <CardTitle className="text-3xl font-semibold">Set a New Password</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-8">
              Enter a new password for your account below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-4">
              <Label htmlFor="password" className="mb-1">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 8 characters, include a number or symbol
              </p>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="mb-1">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 8 characters, include a number or symbol
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-3 mt-8">
            <Button type="submit" className="w-full mt-2">
              Reset Password
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
