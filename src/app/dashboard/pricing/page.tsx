"use client"

import PricingCard from "@/components/pricing-card"
import { TableBilling } from "@/components/table/table-billing"
import { TableEmployees } from "@/components/table/table-employees"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"
import { AlertTriangle, Check, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import fs from "fs";
import path from "path";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EmployeeAddonSlider } from "@/components/employee-addon-slider"

type Billing = {
    id: string
    invoiceDate: string
    plan: string
    ammount: string
    status: "pending" | "processing" | "paid" | "failed"
}

const data: Billing[] = [
    {
        "id": "INV-001",
        "invoiceDate": "2025-05-01",
        "plan": "Basic Plan",
        "ammount": "49.99",
        "status": "pending"
    },
    {
        "id": "INV-002",
        "invoiceDate": "2025-04-15",
        "plan": "Pro Plan",
        "ammount": "99.99",
        "status": "processing"
    },
    {
        "id": "INV-003",
        "invoiceDate": "2025-04-01",
        "plan": "Enterprise Plan",
        "ammount": "199.99",
        "status": "paid"
    },
    {
        "id": "INV-004",
        "invoiceDate": "2025-03-20",
        "plan": "Basic Plan",
        "ammount": "49.99",
        "status": "failed"
    },
    {
        "id": "INV-005",
        "invoiceDate": "2025-05-05",
        "plan": "Pro Plan",
        "ammount": "99.99",
        "status": "paid"
    }
]

export default function PricingPage() {
    const [billings, setBillings] = useState<Billing[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBilling = async () => {
            try {

                // const parse = await fetch("https://api.stripe.com/v1/billing/invoices",)
                // const data = await parse.json()
                // const data = [
                //     {
                //         "id": "INV-001",
                //         "invoiceDate": "2025-05-01",
                //         "plan": "Basic Plan",
                //         "ammount": "49.99",
                //         "status": "pending"
                //     },
                //     {
                //         "id": "INV-002",
                //         "invoiceDate": "2025-04-15",
                //         "plan": "Pro Plan",
                //         "ammount": "99.99",
                //         "status": "processing"
                //     },
                //     {
                //         "id": "INV-003",
                //         "invoiceDate": "2025-04-01",
                //         "plan": "Enterprise Plan",
                //         "ammount": "199.99",
                //         "status": "paid"
                //     },
                //     {
                //         "id": "INV-004",
                //         "invoiceDate": "2025-03-20",
                //         "plan": "Basic Plan",
                //         "ammount": "49.99",
                //         "status": "failed"
                //     },
                //     {
                //         "id": "INV-005",
                //         "invoiceDate": "2025-05-05",
                //         "plan": "Pro Plan",
                //         "ammount": "99.99",
                //         "status": "paid"
                //     }
                // ]

                setBillings(data)
            } catch (error) {
                console.error("Failed to fetch billing data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBilling()
    }, [])

    if (loading) return <p>Loading...</p>

    return (
        <CustomPage>
            <CustomPageHeader>
                <CustomPageTitleContainer>
                    <CustomPageTitle>Pricing Plan & Add-on</CustomPageTitle>
                    <CustomPageSubtitle>Review your current plan, explore upgrades, and access your payment records.</CustomPageSubtitle>
                </CustomPageTitleContainer>
            </CustomPageHeader>
            <Alert variant={"destructive"}>
                <AlertTriangle className="h-4 w-4 text-error-500" />
                <AlertTitle>Your subscription payment is overdue</AlertTitle>
                <AlertDescription>Administrative actions are restricted and employees cannot record attendance. Complete your payment to restore full functionality.</AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">

                <PricingCard
                    title="Free Plan"
                    description="Try every feature free for 14 days"
                    price="Rp0"
                    duration="for 14 days"
                    features={[
                        "Up to *10 employees*",
                        "Every feature in *Starter* and *Growth Plan* during trial",
                    ]}
                >
                    <Link href={"/dashboard/pricing/checkout?plan=1"} className="w-full" >
                        <Button variant={"outline"} className="w-full" size={"lg"} disabled>
                            Current Plan
                        </Button>
                    </Link>
                </PricingCard>
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
                    <Link href={"/dashboard/pricing/checkout?plan=2"} className="w-full" >
                        <Button variant={"outline"} className="w-full" size={"lg"}>
                            Upgrade
                        </Button>
                    </Link>
                </PricingCard>
                <PricingCard
                    variant="primary"
                    title="Growth Plan"
                    description="Scale your HR operations across multiple offices."
                    price="Rp300.000"
                    duration="for 14 days"
                    features={[
                        "Up to *100 employees*",
                        "*Branch Management* (Organize teams across offices)",
                    ]}
                >
                    <Link href={"/dashboard/pricing/checkout?plan=3"} className="w-full" >
                        <Button variant={"secondary"} className="w-full" size={"lg"}>
                            Choose Plan
                        </Button>
                    </Link>
                </PricingCard>
            </div>
            <EmployeeAddonSlider activeUser={401} currentLimit={500} monthlyPricePerEmployee={1.5} />
            <CustomPageHeader>
                <CustomPageTitleContainer>
                    <CustomPageTitle>Billing History</CustomPageTitle>
                    {/* <CustomPageSubtitle>Review your current plan, explore upgrades, and access your payment records.</CustomPageSubtitle> */}
                </CustomPageTitleContainer>
            </CustomPageHeader>
            <TableBilling data={billings} />
            {/* <h2 className="text-lg font-medium mb-4">Employee Management</h2> */}
        </CustomPage>
    )
}
