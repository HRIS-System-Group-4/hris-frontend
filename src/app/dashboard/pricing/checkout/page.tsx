"use client"

import { EmployeeAddonCompact } from "@/components/employee-addon-compact"
import PricingCard from "@/components/pricing-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleContainer } from "@/components/ui/custom-page"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { activateSubscription } from "@/lib/api";
import { PRICING_IDS } from "@/lib/constants";


export default function CheckOutPage() {
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

    // In checkout/page.tsx
    const planMapping: { [key: string]: number } = {
        "1": 0, // Free
        "2": 1, // Starter
        "3": 2, // Growth
    }

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
                                title="Starter Plan"
                                description="Simple and affordable HR tools for small teams."
                                price="Rp100.000"
                                duration="per month"
                                features={[
                                    "Up to *20 employees*",
                                    "*Advanced Attendance Tracking* (Location-based)",
                                ]}
                            >
                            </PricingCard>
                            <EmployeeAddonCompact onAdditionalEmployeesChange={handleOutputChange} additionalEmployeesParam={additionalEmployeesParam} currentLimit={500} activeUser={400} monthlyPricePerEmployee={1.5} />
                            {/* <span>Additional Employees: {additionalEmployees}</span> */}
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
