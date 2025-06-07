import { Button } from "@/components/ui/button";
import { Building, CalendarDays, Check, ChevronRight, Lightbulb, MapPin, UsersIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import PreviewDashboard from "@/components/preview/preview-dashboard";
import PreviewDashboardAdmin from "@/components/preview/preview-dashboard-admin";
import { PreviewChartTimeOffTypes } from "@/components/preview/preview-chart-time-off";
import { IconBuilding, IconBuildings } from "@tabler/icons-react";

export default function Home() {

  return (
    <div className="h-svh w-svw bg-neutral-50 md:grid-cols-12 p-5 md:p-12 lg:p-20 overflow-hidden">
      <div className="col-span-12 w-full h-full flex ">
        {/* <CardContent className="flex h-full"> */}
        <div className="flex flex-col w-full md:w-1/2 md:pr-20 h-full justify-between">
          <div className="flex flex-col gap-6 md:gap-9 w-full">
            <Link
              href={"/auth/register"}
              className="group relative flex gap-3 py-2 pl-2 pr-3 bg-primary-100 rounded-xl w-fit overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Full width always running animated shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_3s_ease-in-out_infinite]"></div>

              {/* Subtle pulse background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-primary-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative flex gap-2 items-center z-10">
                <Lightbulb
                  size={20}
                  className="text-primary-300 stroke-2 transition-all duration-300 group-hover:text-primary-400 group-hover:scale-110 group-hover:rotate-12"
                />
                <p className="font-medium text-normal md:text-lg text-primary-500 transition-colors duration-300 group-hover:text-primary-600">
                  <strong className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-800 transition-all duration-300">
                    First Release:&nbsp;
                  </strong>
                  <span className="hidden md:inline bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                    Human Resource Information System
                  </span>
                  <span className="inline md:hidden bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                    HRIS
                  </span>
                </p>
              </div>

              {/* Border glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-200/20 via-primary-300/40 to-primary-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>

            </Link>
            <div className="flex flex-col gap-3 md:gap-6 w-full">
              <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-4 w-full">
                  <h1 className="text-5xl md:text-6xl font-semibold text-black leading-16">It's Time to Simplify Your HR Operations</h1>
                  <p className="text-xl font-normal text-neutral-500">Say goodbye to scattered tools and confusing systems. Our centralized platform gives you full control over your team, attendance, and daily operations.</p>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-[18px] w-[18px] text-primary-300" />
                  <p className="text-base font-medium flex-1 text-primary">
                    Smart Attendance with Location Tracking
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <UsersIcon className="mt-0.5 h-[18px] w-[18px] text-primary-300" />
                  <p className="text-base font-medium flex-1 text-primary">
                    Centralized Employee Management
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 h-[18px] w-[18px] text-primary-300" />
                  <p className="text-base font-medium flex-1 text-primary">
                    Customizable Work Schedules
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <IconBuildings className="mt-0.5 h-[18px] w-[18px] text-primary-300" />
                  <p className="text-base font-medium flex-1 text-primary">
                    Branch Management System
                  </p>
                </li>
              </ul>
              {/* <div className="flex gap-3 w-full"> */}
              <Link href={"/auth/register"} >
                <Button size={"lg"}>Register</Button>
              </Link>
              {/* </div> */}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-base font-normal text-neutral-500">Associated with</p>
            <div className="flex gap-5">
              <Image src="/logo/Logo-Polinema.png" alt="Logo Polinema" width={40} height={100} />
              <Image src="/logo/Logo-jti.png" alt="Logo JTI" width={40} height={100} />
              <Image src="/logo/Logo-cmlabs.png" alt="Logo cmlabs" width={40} height={100} />
            </div>
          </div>
        </div>
        <div className="hidden md:block relative w-1/2 h-full">
          <PreviewDashboard className="scale-75 origin-top-left absolute top-20 left-5" ><PreviewDashboardAdmin /></PreviewDashboard>
          {/* <div className="absolute top-1/5">
            <div className="relative w-fit h-fit">
              <div className="scale-[60%] w-[400px]">
                <PreviewChartTimeOffTypes />
              </div>
              <div className="absolute scale-75 -right-1/4 -translate-x-1/2 bottom-4 w-[250px] ">
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
          </div> */}
        </div>
        {/* </CardContent> */}
      </div>
    </div>
  );
}
