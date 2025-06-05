// /components/checkout-content.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import PricingCard from "@/components/pricing-card";
import { EmployeeAddonCompact } from "@/components/employee-addon-compact";
import Link from "next/link";

export default function CheckoutContent() {
    const searchParams = useSearchParams();
    const planParam = searchParams.get("plan") || "1";
    const additionalEmployeesParam = Number(searchParams.get("additionalEmployees")) || 0;
    const [additionalEmployees, setAdditionalEmployees] = useState(additionalEmployeesParam);
    const [error, setError] = useState<string | null>(null);

    const handleOutputChange = (newData: number) => {
        setAdditionalEmployees(newData);
    };

    // Plan mapping
    const planMapping: { [key: string]: number } = {
        "1": 0, // Free
        "2": 1, // Starter
        "3": 2, // Growth
    };

    // Validate planParam
    const selectedPlan = planParam && planMapping[planParam] !== undefined ? planMapping[planParam] : 1;
    if (!planMapping[planParam]) {
        setError("Invalid plan selected. Defaulting to Starter Plan.");
    }

    // Validate additionalEmployeesParam
    if (isNaN(additionalEmployeesParam) || additionalEmployeesParam < 0) {
        setError("Invalid number of additional employees.");
    }

    return (
        <div>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
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
                        <Link href="/dashboard/payment" className="w-full">
                            <Button variant="default" className="w-full">
                                Pay Now
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}