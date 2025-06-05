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

type CheckClockDetail = {
  id: string
  name: string
  totalEmployee: string
  monday: CheckClockDay
  tuesday: CheckClockDay
  wednesday: CheckClockDay
  thursday: CheckClockDay
  friday: CheckClockDay
  saturday: CheckClockDay
  sunday: CheckClockDay
}

type CheckClockDay = {
  type: "wfo" | "wfa" | "off-day"
  startTime: string
  endTime: string
  breakDuration: number
  lateTolerance: number
}

// Define the days array with proper typing
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const
type DayKey = typeof DAYS[number]

const tableData: CheckClockDetail[] = [
  {
    id: "1",
    name: "Kantor Pusat Jakarta",
    totalEmployee: "120",
    monday: {
      type: "wfo",
      startTime: "08:00",
      endTime: "17:00",
      breakDuration: 60,
      lateTolerance: 15,
    },
    tuesday: {
      type: "wfo",
      startTime: "08:00",
      endTime: "17:00",
      breakDuration: 60,
      lateTolerance: 15,
    },
    wednesday: {
      type: "wfo",
      startTime: "08:00",
      endTime: "17:00",
      breakDuration: 60,
      lateTolerance: 15,
    },
    thursday: {
      type: "wfo",
      startTime: "08:00",
      endTime: "17:00",
      breakDuration: 60,
      lateTolerance: 15,
    },
    friday: {
      type: "wfo",
      startTime: "08:00",
      endTime: "16:00",
      breakDuration: 60,
      lateTolerance: 10,
    },
    saturday: {
      type: "wfa",
      startTime: "09:00",
      endTime: "12:00",
      breakDuration: 0,
      lateTolerance: 5,
    },
    sunday: {
      type: "off-day",
      startTime: "09:00",
      endTime: "12:00",
      breakDuration: 0,
      lateTolerance: 5,
    },
  },
  {
    id: "2",
    name: "Remote Team Bandung",
    totalEmployee: "45",
    monday: {
      type: "wfa",
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 45,
      lateTolerance: 10,
    },
    tuesday: {
      type: "wfa",
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 45,
      lateTolerance: 10,
    },
    wednesday: {
      type: "wfa",
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 45,
      lateTolerance: 10,
    },
    thursday: {
      type: "wfa",
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 45,
      lateTolerance: 10,
    },
    friday: {
      type: "wfa",
      startTime: "09:00",
      endTime: "16:00",
      breakDuration: 30,
      lateTolerance: 10,
    },
    saturday: {
      type: "wfa",
      startTime: "10:00",
      endTime: "13:00",
      breakDuration: 0,
      lateTolerance: 5,
    },
    sunday: {
      type: "wfa",
      startTime: "10:00",
      endTime: "13:00",
      breakDuration: 0,
      lateTolerance: 5,
    },
  },
]

export default function DetailCheckClockPage() {
  const params = useParams()
  const router = useRouter()
  const [checkClock, setcheckClock] = useState<CheckClockDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCheckClockDetails = async () => {
      try {
        setLoading(true)
        // Fetch the employee data from the JSON file
        // const response = await fetch("/data/employees.json")

        // if (!response.ok) {
        //   throw new Error(`Failed to fetch employee data: ${response.status} ${response.statusText}`)
        // }

        // const data = await response.json()
        const data = tableData

        // Find the employee with the matching ID
        const foundData = data.find((data: CheckClockDetail) => data.id === params.id)

        if (!foundData) {
          throw new Error(`Check Clock with ID ${params.id} not found`)
        }

        setcheckClock(foundData)
        setError(null)
      } catch (err) {
        console.error("Error fetching check clock details:", err)
        setError(err instanceof Error ? err.message : "Failed to load check clock details")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCheckClockDetails()
    }
  }, [params.id])

  // Helper function to get day data with proper typing
  const getDayData = (day: string): CheckClockDay | null => {
    if (!checkClock) return null
    return checkClock[day as DayKey] || null
  }

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
              {DAYS.map((day) => {
                const dayData = getDayData(day)
                return (
                  <div key={day}>
                    <Separator />
                    <DetailGroup title={toTitleCase(day) as string} className="pt-5">
                      <DetailContainer>
                        <DetailItem label="Work Type" layout={"column"} >
                          <div className="font-medium text-black">
                            {dayData ? formatDayWorkType(dayData.type) : 'N/A'}
                          </div>
                        </DetailItem>
                      </DetailContainer>
                      <DetailContainer>
                        <DetailItem label="Start Time" layout={"column"} >
                          <div className="font-medium text-black">
                            {dayData?.startTime || 'N/A'}
                          </div>
                        </DetailItem>
                        <DetailItem label="End Time" layout={"column"} >
                          <div className="font-medium text-black">
                            {dayData?.endTime || 'N/A'}
                          </div>
                        </DetailItem>
                      </DetailContainer>
                      <DetailContainer>
                        <DetailItem label="Break Duration" layout={"column"} >
                          <div className="font-medium text-black">
                            {dayData ? `${dayData.breakDuration} minutes` : 'N/A'}
                          </div>
                        </DetailItem>
                        <DetailItem label="Late Tolerance" layout={"column"} >
                          <div className="font-medium text-black">
                            {dayData ? `${dayData.lateTolerance} minutes` : 'N/A'}
                          </div>
                        </DetailItem>
                      </DetailContainer>
                    </DetailGroup>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )
      )}
    </CustomPage>
  )
}