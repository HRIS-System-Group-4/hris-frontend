'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companySchema, CompanyFormData } from "@/schemas/company-schema"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"

export function CompanyProfile() {
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      companyUsername: "",
    },
  })

  const onSubmit = (data: CompanyFormData) => {
    console.log("Company Data:", data)
    // TODO: Submit ke API / simpan state
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card className="w-full max-w-100xl mx-auto px-3">
          <CardHeader>
            <div className="mx-auto mb-2 h-10 w-10">
              <Image
                src="/logo/Logo HRIS-1.png"
                alt="logo"
                width={100}
                height={100}
              />
            </div>
            <CardTitle className="text-center text-3xl">Getting Started</CardTitle>
            <CardDescription className="text-center text-sm">
              Enter your company profile to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. PT Maju Sejahtera" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Username</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. majusejahtera" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-3">
            <Button type="submit" className="w-full mt-6">
              Continue
            </Button>
            <p className="text-sm text-muted-foreground mt-4 mb-2">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-bold">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
