"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailContainer, DetailGroup, DetailItem } from "@/components/ui/custom-detail";
import {
  CustomPage,
  CustomPageHeader,
  CustomPageSubtitle,
  CustomPageTitle,
  CustomPageTitleButtons,
  CustomPageTitleContainer,
} from "@/components/ui/custom-page";
import Link from "next/link";
import { toTitleCase } from "@/lib/strings";
import { getCheckClockSettingsById } from "@/services/checkClockService";
import { SkeletonDetail } from "@/components/skeletons/skeleton-detail";

type CheckClockDay = {
  startTime: string;
  endTime: string;
  breakDuration: number;
  lateTolerance: number;
};

type CheckClockDetail = {
  id: string;
  name: string;
  type: "WFO" | "WFA" | "Hybrid";
  totalEmployee: string;
  monday: CheckClockDay;
  tuesday: CheckClockDay;
  wednesday: CheckClockDay;
  thursday: CheckClockDay;
  friday: CheckClockDay;
  saturday: CheckClockDay;
  sunday: CheckClockDay;
};

// Define the day keys
type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

function mapDay(apiDay: any): CheckClockDay {
  return {
    startTime: apiDay.clock_in,
    endTime: apiDay.clock_out,
    breakDuration: calculateBreakDuration(apiDay.break_start, apiDay.break_end),
    lateTolerance: apiDay.late_tolerance,
  };
}

function calculateBreakDuration(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function mapType(type: number): "WFO" | "WFA" | "Hybrid" {
  switch (type) {
    case 1:
      return "WFO";
    case 2:
      return "WFA";
    case 3:
      return "Hybrid";
    default:
      return "WFO";
  }
}

function formatApiDataToLocal(apiData: any): CheckClockDetail {
  return {
    id: apiData.id,
    name: apiData.name,
    type: mapType(apiData.type),
    totalEmployee: "N/A",
    monday: mapDay(apiData.days.Monday),
    tuesday: mapDay(apiData.days.Tuesday),
    wednesday: mapDay(apiData.days.Wednesday),
    thursday: mapDay(apiData.days.Thursday),
    friday: mapDay(apiData.days.Friday),
    saturday: mapDay(apiData.days.Saturday),
    sunday: mapDay(apiData.days.Sunday),
  };
}

export default function DetailCheckClockPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [checkClock, setCheckClock] = useState<CheckClockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheckClockDetails = async () => {
      try {
        setLoading(true);
        const data = await getCheckClockSettingsById(params.id);
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

  // Array of day keys
  const days: DayKey[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Detail Check Clock</CustomPageTitle>
          <CustomPageSubtitle>Manage and organize your data</CustomPageSubtitle>
        </CustomPageTitleContainer>
        <CustomPageTitleButtons>
          <Link href={`/check-clock/edit/${params.id}`}>
            <Button variant="default" size="lg">
              Edit Timings
            </Button>
          </Link>
        </CustomPageTitleButtons>
      </CustomPageHeader>

      {loading ? (
        <SkeletonDetail />
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
                  <DetailItem label="Check Clock Name" layout="column">
                    <div className="font-medium text-black">{checkClock.name}</div>
                  </DetailItem>
                  <DetailItem label="Number of Employee" layout={"column"} >
                    <div className="font-medium text-black">{checkClock.totalEmployee}</div>
                  </DetailItem>
                </DetailContainer>
              </DetailGroup>
              {days.map((day) => (
                <div key={day}>
                  <Separator />
                  <DetailGroup title={toTitleCase(day)} className="pt-5">
                    <DetailContainer>
                      <DetailItem label="Work Type" layout="column">
                        <div className="font-medium text-black">{checkClock.type}</div>
                      </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                      <DetailItem label="Start Time" layout="column">
                        <div className="font-medium text-black">{checkClock[day].startTime || '-'}</div>
                      </DetailItem>
                      <DetailItem label="End Time" layout="column">
                        <div className="font-medium text-black">{checkClock[day].endTime || '-'}</div>
                      </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                      <DetailItem label="Break Duration" layout="column">
                        <div className="font-medium text-black">{checkClock[day].breakDuration || '-'} minutes</div>
                      </DetailItem>
                      <DetailItem label="Late Tolerance" layout="column">
                        <div className="font-medium text-black">{checkClock[day].lateTolerance || '-'} minutes</div>
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
  );
}