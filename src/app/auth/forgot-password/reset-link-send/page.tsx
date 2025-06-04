'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import Image from "next/image"

export default function ForgotPasswordRedirectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl text-center p-10 shadow-lg border border-gray-200">
        <CardHeader className="flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="HRIS Logo"
            className="h-12 w-12 mb-4 object-contain"
          />
          <CardTitle className="text-3xl font-bold text-gray-900">
            Check Your Inbox
          </CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            We’ve sent a password reset link to <span className="font-semibold">example@mail.com</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <p className="text-sm text-gray-500">
            Didn’t receive the email?{" "}
            <a
              href="#"
              className="text-blue-950 hover:underline font-semibold"
            >
              Resend Reset Link
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
