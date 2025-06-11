// /components/checkout-content.tsx
"use client";

import { EmployeeAddonCompact } from "@/components/employee-addon-compact"
import PricingCard from "@/components/pricing-card"
import { Button } from "@/components/ui/button"
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

// Loading fallback component
function CheckoutLoading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Card className="col-span-7">
                <CardHeader>
                    <CardTitle>Loading pricing breakdown...</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </CardContent>
            </Card>
            <Card className="col-span-5 h-fit">
                <CardHeader>
                    <CardTitle>Plan Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Main component with Suspense boundary
export default function CheckoutContent() {
    return (
        <Suspense fallback={<CheckoutLoading />}>
            <CheckoutForm />
        </Suspense>
    );
}