import { GalleryVerticalEnd } from "lucide-react"

import RegisterForm from "@/components/register-form"
import Image from "next/image"
import { PreviewChartTimeOffTypes } from "@/components/preview/preview-chart-time-off"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-fit h-fit">
            <div className="scale-90 w-[400px]">
              <PreviewChartTimeOffTypes />
            </div>
            <div className="absolute scale-75 -right-1/4  bottom-1 z-10 w-[250px] ">
              <Card>
                <CardHeader>
                  <CardDescription>Total Employee</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    493 Employees
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            <div className="absolute scale-75 -right-1/4 -translate-x-1/2 -bottom-12 w-[250px] ">
              <Card>
                <CardHeader>
                  <CardDescription>Total Days Worked</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    520 Days
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Image src="/logo/Logo HRIS-1.png" alt="Logo" width={62} height={100} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}
