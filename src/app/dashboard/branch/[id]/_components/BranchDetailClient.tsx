"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DetailContainer, DetailGroup, DetailItem } from "@/components/ui/custom-detail"
import { CustomPageHeader, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import MapComponent from "@/components/map/map-component"
import { BranchDetail, getBranchDetail } from "@/services/branchService"

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toLowerCase() as "active" | "inactive";

  const statusConfig = {
    active: { label: "Active", variant: "secondary" as const, className: "bg-green-50 text-green-500" },
    inactive: { label: "Inactive", variant: "secondary" as const, className: "bg-red-50 text-red-500" },
  };

  const config = statusConfig[normalizedStatus];

  if (!config) {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-500">
        Unknown
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} className={cn("capitalize", config.className)}>
      {config.label}
    </Badge>
  );
};

export default function BranchDetailClient() {
  const params = useParams()
  const router = useRouter()
  const [branch, setBranch] = useState<BranchDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Unauthorized. Token not found.")

        const branchData = await getBranchDetail(params.id as string, token)
        setBranch(branchData)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchDetails()
  }, [params.id])

  if (loading) {
    return (
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
      </Card>
    )
  }

  if (error) {
    return (
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
    )
  }

  if (!branch) return null

  return (
    <>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Detail Branch</CustomPageTitle>
        </CustomPageTitleContainer>
        <CustomPageTitleButtons>
          <Link href={`/dashboard/branch/edit/${params.id}`}>
            <Button variant="default" size={"lg"}>
              Edit Branch
            </Button>
          </Link>
        </CustomPageTitleButtons>
      </CustomPageHeader>

      <Card>
        <CardContent className="space-y-5">
          <DetailGroup title="Branch Information">
            <DetailContainer>
              <DetailItem label="Branch Name" layout="column">
                <div className="font-medium text-black">{branch.branch_name}</div>
              </DetailItem>
              <DetailItem label="Address" layout="column">
                <div className="font-medium text-black">{branch.address}</div>
              </DetailItem>
            </DetailContainer>
            <DetailContainer>
              <DetailItem label="City" layout="column">
                <div className="font-medium text-black">{branch.city}</div>
              </DetailItem>
              <DetailItem label="Country" layout="column">
                <div className="font-medium text-black">{branch.country}</div>
              </DetailItem>
            </DetailContainer>
            <DetailContainer>
              <DetailItem label="Status" layout="column">
                <StatusBadge status={branch.status} />
              </DetailItem>
            </DetailContainer>
          </DetailGroup>

          <DetailGroup title="Location Information">
            <DetailContainer>
              <DetailItem label="Latitude" layout="column">
                <div className="font-medium text-black">{branch.latitude}</div>
              </DetailItem>
              <DetailItem label="Longitude" layout="column">
                <div className="font-medium text-black">{branch.longitude}</div>
              </DetailItem>
            </DetailContainer>
            <MapComponent />
          </DetailGroup>
        </CardContent>
      </Card>
    </>
  )
}
