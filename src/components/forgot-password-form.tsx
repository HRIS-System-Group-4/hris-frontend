'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // alert(`Reset link sent to: ${email}`)
    router.push("/auth/forgot-password/reset-link-send") // ✅ path sesuai struktur folder kamu
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="w-full max-w-100xl mx-auto px-3">
          <CardHeader>
            <div className="mx-auto mb-2 h-10 w-10">
              <img
                src="/logo.png"
                alt="HRIS Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <CardTitle className="text-center text-3xl">Forgot Password</CardTitle>
            <CardDescription className="text-center text-sm">
              Submit your email to reset your password
            </CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="employee@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-3">
              <Button type="submit" className="w-full mt-6">
                Send Reset Link
              </Button>
              <p className="text-sm text-muted-foreground mt-4 mb-2">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-bold">
                  Sign in
                </Link>
              </p>
            </CardFooter>
        </Card>
    </form>
  )
}
