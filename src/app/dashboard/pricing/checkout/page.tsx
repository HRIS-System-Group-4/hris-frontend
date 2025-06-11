"use client"

import { EmployeeAddonCompact } from "@/components/employee-addon-compact"
import PricingCard from "@/components/pricing-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleContainer } from "@/components/ui/custom-page"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { activateSubscription, getPlans } from "@/services/subscriptionService"
import { useRouter } from "next/navigation"

export default function CheckOutPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan") || ""
  const planName = searchParams.get("planName") || ""
  const additionalEmployeesParam = Number(searchParams.get("additionalEmployees")) || 0
  const [additionalEmployees, setAdditionalEmployees] = useState(additionalEmployeesParam)
  const [planIdMap, setPlanIdMap] = useState<Record<string, string>>({})

  const handleOutputChange = (newData: number) => {
    setAdditionalEmployees(newData)
  }

  const router = useRouter()

  useEffect(() => {
    const fetchPlans = async () => {
      const plans = await getPlans()
      const map: Record<string, string> = {}
      plans.forEach(plan => {
        map[plan.name] = plan.id
      })
      setPlanIdMap(map)
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleContainer } from "@/components/ui/custom-page"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { activateSubscription } from "@/lib/api";
import { PRICING_IDS } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";


function CheckoutForm() {
    const searchParams = useSearchParams()
    const planParam = searchParams.get("plan") || 1
    const additionalEmployeesParam = Number(searchParams.get("additionalEmployees")) || 0
    const [additionalEmployees, setAdditionalEmployees] = useState(additionalEmployeesParam)

    const handleOutputChange = (newData: number) => {
        setAdditionalEmployees(newData);
    }

    const planNameMapping: { [key: string]: string } = {
        "1": "Free",
        "2": "Basic",
        "3": "Pro",
    };

    // Plan mapping
    const planMapping: { [key: string]: number } = {
        "1": 0, // Free
        "2": 1, // Starter
        "3": 2, // Growth
    }
    fetchPlans()
  }, [])

  const handleActivate = async () => {
    try {
      if (!planParam) throw new Error("Plan ID tidak ditemukan.")
      const payload = {
        plan: planParam,
        additional_employees: additionalEmployees,
      }
      const result = await activateSubscription(payload)
      alert("Sukses: " + result.message)
    } catch (err: any) {
      alert("Gagal: " + (err.response?.data?.message || err.message))
    }
  }

  const planDetails: Record<string, {
    title: string
    description: string
    price: string
    features: string[]
  }> = {
    "Free Plan": {
      title: "Free Plan",
      description: "Try every feature free for 14 days",
      price: "Rp0",
      features: [
        "Up to *10 employees*",
        "Every feature in *Starter* and *Growth Plan* during trial",
      ],
    },
    "Basic Plan": {
      title: "Starter Plan",
      description: "Simple and affordable HR tools for small teams.",
      price: "Rp100.000",
      features: [
        "Up to *20 employees*",
        "*Advanced Attendance Tracking* (Location-based)",
      ],
    },
    "Pro Plan": {
      title: "Growth Plan",
      description: "Scale your HR operations across multiple offices.",
      price: "Rp300.000",
      features: [
        "Up to *100 employees*",
        "*Branch Management* (Organize teams across offices)",
      ],
    },
  }
  console.log("PlanParam (ID):", planParam)
  const selectedPlanDetails = planDetails[planName] || planDetails["Basic Plan"]
    // const handleActivate = async () => {
    //     try {
    //         const planName = planNameMapping[planParam] || "Starter";
    //         const result = await activateSubscription(planName);
    //         alert("Sukses: " + result.message);
    //     } catch (err: any) {
    //         alert("Gagal: " + err.message);
    //     }
    // };
    const handleActivate = async () => {
    try {
        const payload = {
        plan: PRICING_IDS[planParam],      // Wajib!
        additional_employees: additionalEmployees,            // Opsional
        };
        console.log("Payload yang dikirim:", payload);
        console.log("planParam:", planParam);
        console.log("ID yang digunakan:", PRICING_IDS[planParam]);
        const result = await activateSubscription(payload);
        alert("Sukses: " + result.message);
    } catch (err: any) {
        alert("Gagal: " + (err.response?.data?.message || err.message));
    }
    };

    const selectedPlan = planParam && planMapping[planParam] !== undefined ? planMapping[planParam] : 1

    return (
        <div>
            {/* {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )} */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Pricing Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-semibold">Selected Plan</h3>
                                <Button variant="link" size="sm" className="text-sm">
                                    Change Plan
                                </Button>
                            </div>
                            <PricingCard
                                title="Starter Plan"
                                description="Simple and affordable HR tools for small teams."
                                price="Rp100.000"
                                duration="per month"
                                features={["Up to *20 employees*", "*Advanced Attendance Tracking* (Location-based)"]}
                            />
                            <EmployeeAddonCompact
                                onAdditionalEmployeesChange={handleOutputChange}
                                additionalEmployeesParam={additionalEmployeesParam}
                                currentLimit={500}
                                activeUser={400}
                                monthlyPricePerEmployee={1.5}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-5 h-fit">
                    <CardHeader>
                        <CardTitle>Plan Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-baseline pt-2">
                            <span className="font-medium">Current Plan</span>
                            <div className="text-right">
                                <div className="font-bold text-lg">Rp100.000</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline pt-2">
                            <span className="font-medium">Add-on Employee</span>
                            <div className="text-right">
                                <div className="font-bold text-lg">Rp{additionalEmployees * 5000}</div>
                                <div className="text-xs text-muted-foreground">
                                    {additionalEmployees} × Rp5.000
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline pt-2 border-t">
                            <span className="font-medium">Total</span>
                            <div className="text-right">
                                <div className="font-bold text-lg">Rp{100000 + additionalEmployees * 5000}</div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="default" className="w-full" onClick={handleActivate}>
                            Pay Now
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Checkout Page</CustomPageTitle>
          <CustomPageSubtitle>Review your current plan, explore upgrades, and access your payment records.</CustomPageSubtitle>
        </CustomPageTitleContainer>
      </CustomPageHeader>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>
              Pricing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">Selected Plan</h3>
                <Button variant="link" size={"sm"} className="text-sm">
                  Change Plan
                </Button>
              </div>
              <PricingCard
                title={selectedPlanDetails.title}
                description={selectedPlanDetails.description}
                price={selectedPlanDetails.price}
                duration="per month"
                features={selectedPlanDetails.features}
              />
              <EmployeeAddonCompact onAdditionalEmployeesChange={handleOutputChange} additionalEmployeesParam={additionalEmployeesParam} currentLimit={500} activeUser={400} monthlyPricePerEmployee={1.5} />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-5 h-fit">
          <CardHeader>
            <CardTitle>Plan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-baseline pt-2">
              <span className="font-medium">Current Plan</span>
              <div className="text-right">
                <div className="font-bold text-lg">Rp{additionalEmployees * 5000}</div>
              </div>
            </div>
            <div className="flex justify-between items-baseline pt-2 ">
              <span className="font-medium">Add-on Employee</span>
              <div className="text-right">
                <div className="font-bold text-lg">Rp{additionalEmployees * 5000}</div>
                <div className="text-xs text-muted-foreground">
                  {additionalEmployees} × Rp5.000
                </div>
              </div>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t">
              <span className="font-medium">Total</span>
              <div className="text-right">
                <div className="font-bold text-lg">Rp{additionalEmployees * 5000}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="default" className="w-full" onClick={handleActivate}>
              Pay Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </CustomPage>
  )
}
