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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { parse } from "path"
import MapComponent from "@/components/map/map-component"


type BranchDetail = {
  id: string
  name: string
  address: string
  city: string
  country: string
  status: "active" | "inactive"
  latitude: string
  longitude: string
}

const tableData: BranchDetail[] = [
  {
    id: "1",
    name: "Jakarta Headquarters",
    address: "Jl. Sudirman No. 55",
    city: "Jakarta",
    country: "Indonesia",
    status: "active",
    latitude: "-7.947468",
    longitude: "112.616102",
  },
  {
    id: "2",
    name: "Bandung Office",
    address: "Jl. Dago Atas No. 12",
    city: "Bandung",
    country: "Indonesia",
    status: "inactive",
    latitude: "-6.8896",
    longitude: "107.6107",
  },
  {
    id: "3",
    name: "Singapore Branch",
    address: "10 Marina Boulevard",
    city: "Singapore",
    country: "Singapore",
    status: "active",
    latitude: "1.28009",
    longitude: "103.8505",
  },
  {
    id: "4",
    name: "New York Office",
    address: "123 5th Ave",
    city: "New York",
    country: "USA",
    status: "active",
    latitude: "40.7419",
    longitude: "-73.9894",
  },
  {
    id: "5",
    name: "Tokyo Branch",
    address: "1-2-3 Shibuya",
    city: "Tokyo",
    country: "Japan",
    status: "inactive",
    latitude: "35.6580",
    longitude: "139.7016",
  },
]

const StatusBadge = ({ status }: { status: BranchDetail["status"] }) => {
  const statusConfig = {
    active: { label: "Active", variant: "secondary" as const, className: "bg-green-50 text-green-500" },
    inactive: { label: "Inactive", variant: "secondary" as const, className: "bg-red-50 text-red-500" },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={cn("capitalize", config.className)}>
      {config.label}
    </Badge>
  )
}


export default function DetailCheckClockPage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const params = useParams()
  const router = useRouter()
  const [checkClock, setcheckClock] = useState<BranchDetail | null>(null)
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
        const foundData = data.find((data: BranchDetail) => data.id === params.id)

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
          <CustomPageTitle>Detail Branch</CustomPageTitle>
          {/* <CustomPageSubtitle>Manage and organize all your employees' data</CustomPageSubtitle> */}
        </CustomPageTitleContainer>
        <CustomPageTitleButtons>
          <Link href={`/dashboard/branch/edit/${params.id}`}>
            <Button variant="default" size={"lg"}>
              Edit Branch</Button>
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
              <DetailGroup title="Branch Information">
                <DetailContainer>
                  <DetailItem label="Branch Name" layout={"column"} >
                    <div className="font-medium text-black"> {checkClock.name}</div>
                  </DetailItem>
                  <DetailItem label="Address" layout={"column"} >
                    <div className="font-medium text-black">{checkClock.address}</div>
                  </DetailItem>
                </DetailContainer>
                <DetailContainer>
                  <DetailItem label="City" layout={"column"} >
                    <div className="font-medium text-black">{checkClock.city}</div>
                  </DetailItem>
                  <DetailItem label="County" layout={"column"} >
                    <div className="font-medium text-black">{checkClock.country}</div>
                  </DetailItem>
                </DetailContainer>
                <DetailContainer>
                  <DetailItem label="Status" layout={"column"} >
                    <StatusBadge status={checkClock.status} />
                  </DetailItem>
                </DetailContainer>
              </DetailGroup>
              <DetailGroup title="Location Information">
                <DetailContainer>
                  <DetailItem label="Latitude" layout={"column"} >
                    <div className="font-medium text-black">{checkClock.latitude}</div>
                  </DetailItem>
                  <DetailItem label="Longitude" layout={"column"} >
                    <div className="font-medium text-black">{checkClock.longitude}</div>
                  </DetailItem>
                </DetailContainer>
                <MapComponent />
              </DetailGroup>
            </CardContent>
          </Card>
        )
      )}
    </CustomPage>
  )
}
