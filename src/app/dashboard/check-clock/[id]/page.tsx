"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { DetailContainer, DetailGroup, DetailItem } from "@/components/ui/custom-detail"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"
import Link from "next/link"
import { toTitleCase } from "@/lib/strings"
import { formatDayWorkType } from "@/lib/utils/dayWorkType"
import axios from "axios";

type CheckClockDay = {
  startTime: string
  endTime: string
  breakDuration: number
  lateTolerance: number
}

type CheckClockDetail = {
  id: string
  name: string
  type: "WFO" | "WFA" | "Hybrid"
  totalEmployee: string
  monday: CheckClockDay
  tuesday: CheckClockDay
  wednesday: CheckClockDay
  thursday: CheckClockDay
  friday: CheckClockDay
  saturday: CheckClockDay
  sunday: CheckClockDay
}

function mapDay(apiDay: any): CheckClockDay {
  return {
    startTime: apiDay.clock_in,
    endTime: apiDay.clock_out,
    breakDuration: calculateBreakDuration(apiDay.break_start, apiDay.break_end),
    lateTolerance: apiDay.late_tolerance,
  }
}

function calculateBreakDuration(start: string, end: string): number {
  // Asumsi waktu format "HH:mm:ss", hitung durasi dalam menit
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

function mapType(type: number): "WFO" | "WFA" | "Hybrid" {
  switch (type) {
    case 1: return "WFO";
    case 2: return "WFA";
    case 3: return "Hybrid";
    default: return "WFO"; 
  }
}

function formatApiDataToLocal(apiData: any): CheckClockDetail {
  return {
    id: apiData.id,
    name: apiData.name,
    type: mapType(apiData.type),
    totalEmployee: "N/A",
    monday: mapDay(apiData.days.monday),
    tuesday: mapDay(apiData.days.tuesday),
    wednesday: mapDay(apiData.days.wednesday),
    thursday: mapDay(apiData.days.thursday),
    friday: mapDay(apiData.days.friday),
    saturday: mapDay(apiData.days.saturday),
    sunday: mapDay(apiData.days.sunday),
  }
}

export default function DetailCheckClockPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [checkClock, setCheckClock] = useState<CheckClockDetail | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState<string | null>(null);

//  useEffect(() => {
//   const fetchCheckClockDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:8000/api/check-clock-settings/${params.id}`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
//       }
//       const data = await response.json();
//       const formatted = formatApiDataToLocal(data);
//       setCheckClock(formatted);
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching check clock details:", err);
//       setError(err instanceof Error ? err.message : "Failed to load check clock details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (params.id) {
//     fetchCheckClockDetails();
//   }
// }, [params.id]);
    useEffect(() => {
        const fetchCheckClockDetails = async () => {
          try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/api/check-clock-settings/${params.id}`);
            const data = response.data;
            const formatted = formatApiDataToLocal(data);
            setCheckClock(formatted);
            setError(null);
          } catch (err) {
            console.error("Error fetching check clock details:", err);
            setError(err instanceof Error ? err.message : "Failed to load check clock details");
          } finally {
            setLoading(false);
          }
        };

        if (params.id) {
          fetchCheckClockDetails();
        }
      }, [params.id]);


  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Detail Check Clock</CustomPageTitle>
          <CustomPageSubtitle>Manage and organize all your employees' data</CustomPageSubtitle>
        </CustomPageTitleContainer>
        <CustomPageTitleButtons>
          <Link href={`/dashboard/check-clock/edit/${params.id}`}>
            <Button variant="default" size={"lg"}>
              Edit Check Clock</Button>
          </Link>
        </CustomPageTitleButtons>
      </CustomPageHeader>

      {loading ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="rounded-md bg-destructive/15 p-4 text-destructive">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        checkClock && (
          <Card>
            <CardContent className="space-y-5">
              <DetailGroup title="Check Clock Setting">
                <DetailContainer>
                  <DetailItem label="Check Clock Name" layout={"column"} >
                    <div className="font-medium text-black">{checkClock.name}</div>
                  </DetailItem>
                  <DetailItem label="Number of Employee" layout={"column"} >
                    <div className="font-medium text-black">{checkClock.totalEmployee}</div>
                  </DetailItem>
                </DetailContainer>
              </DetailGroup>
              {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                <div key={day}>
                  <Separator />
                  <DetailGroup key={day} title={(toTitleCase(day) as string)} className="pt-5">
                    <DetailContainer>
                      <DetailItem label="Work Type" layout={"column"} >
                        {/* <div className="font-medium text-black">{formatDayWorkType(checkClock[day as keyof typeof checkClock]?.type)}</div> */}
                        <div className="font-medium text-black">
                          {checkClock?.type}
                        </div>
                      </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                      <DetailItem label="Start Time" layout={"column"} >
                        <div className="font-medium text-black">{(checkClock[day as keyof typeof checkClock]?.startTime)}</div>
                      </DetailItem>
                      <DetailItem label="End Time" layout={"column"} >
                        <div className="font-medium text-black">{(checkClock[day as keyof typeof checkClock]?.endTime)}</div>
                      </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                      <DetailItem label="Break Duration" layout={"column"} >
                        <div className="font-medium text-black">{(checkClock[day as keyof typeof checkClock]?.breakDuration)} minutes</div>
                      </DetailItem>
                      <DetailItem label="Late Tolerance" layout={"column"} >
                        <div className="font-medium text-black">{(checkClock[day as keyof typeof checkClock]?.lateTolerance)} minutes</div>
                      </DetailItem>
                    </DetailContainer>
                  </DetailGroup>
                </div>

              ))}

            </CardContent>
          </Card>
        )
      )}
    </CustomPage>
  )
}