'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ForgotPasswordRedirectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl text-center p-10 shadow-lg border border-gray-200">
        <CardHeader className="flex flex-col items-center">
          <img
            src="/logo.png"
            alt="HRIS Logo"
            className="h-12 w-12 mb-4 object-contain"
          />
          <CardTitle className="text-3xl font-bold text-gray-900">
            You're All Set!
          </CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            Your Password has been updated successfully. You can now sign in with your new password.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col items-center gap-3">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full mt-6">Sign in</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
