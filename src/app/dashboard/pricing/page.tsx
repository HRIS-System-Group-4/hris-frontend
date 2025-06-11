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
import { fetchBillingHistory, fetchSubscriptionStatus, getPlans } from "@/services/subscriptionService"
import axios from "axios"

type Billing = {
  id: string
  created_at: string;
  invoiceDate: string
  plan: string
  amount: string
  status: "pending" | "processing" | "paid" | "failed"
  pricing?: {
    name: string;
  };
}

export default function PricingPage() {
    const [billings, setBillings] = useState<Billing[]>([])
    const [loading, setLoading] = useState(true)
    const [subscriptionActive, setSubscriptionActive] = useState<boolean | null>(null)
    const [expiresAt, setExpiresAt] = useState<string | null>(null)
    const [currentPlan, setCurrentPlan] = useState<"Free" | "Starter" | "Growth">("Free")

    const [planMap, setPlanMap] = useState<Record<string, string>>({})

    useEffect(() => {
    const fetchPlans = async () => {
        const plans = await getPlans()
        const map: Record<string, string> = {}
        plans.forEach(plan => {
        map[plan.name] = plan.id
        })
        setPlanMap(map)
    }

    fetchPlans()
    }, [])

    useEffect(() => {
    const fetchData = async () => {
        try {
        const token = localStorage.getItem("authToken")
        if (!token) throw new Error("Unauthorized")

        // 1. Ambil billing history
        const billingData = await fetchBillingHistory()
        setBillings(billingData)

        console.log("Token from localStorage:", token)

        // 2. Ambil status subscription
        const statusJson = await fetchSubscriptionStatus()
        setSubscriptionActive(statusJson.subscription_active)
        setExpiresAt(statusJson.expires_at)

        const planAliasMap: Record<string, "Free" | "Starter" | "Growth"> = {
            "Free Plan": "Free",
            "Basic Plan": "Starter",
            "Pro Plan": "Growth",
        }

        if (statusJson.subscription_active && statusJson.plan_name) {
            const mappedPlan = planAliasMap[statusJson.plan_name] ?? "Free"
            setCurrentPlan(mappedPlan)
        } else {
            setCurrentPlan("Free")
        }
        } catch (err) {
        console.error("Error fetching subscription data", err)
        } finally {
        setLoading(false)
        }
    }

    fetchData()
    }, [])

    useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("authToken")

            // Ambil data billing
            const billingRes = await axios.get('http://localhost:8000/api/subscription/billing', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            console.log("Raw billing response:", billingRes.data);

            // Sesuaikan format data dari Laravel
            const billingData = billingRes.data.data.map((item: any) => ({
                id: item.id,
                invoiceDate: item.created_at,
                plan: item.plan_name ?? "-",
                ammount: item.amount,
                status: item.status,
            }))

            // setBillings(billingData)
            // setBillings((billingData.data ?? []).map((item: any) => ({
            // id: item.id,
            // invoiceDate: item.created_at,
            // plan: item.pricing?.name ?? "-",
            // amount: item.amount,
            // status: item.status
            // })))
            setBillings(billingRes.data.data); // langsung assign karena datanya sudah rapi


            // Ambil status subscription
            const statusRes = await axios.get("http://localhost:8000/api/subscription/status", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                }
            })
            const statusJson = statusRes.data
            console.log("Subscription status response:", statusRes.data);
            setSubscriptionActive(statusJson.subscription_active)
            setExpiresAt(statusJson.expires_at)
        //     if (statusJson.subscription_active && statusJson.plan_name) {
        //   const validPlans = ["Free", "Starter", "Growth"]
        //   if (validPlans.includes(statusJson.plan_name)) {
        //         setCurrentPlan(statusJson.plan_name)
        //     } else {
        //         setCurrentPlan("Free") // fallback jika tidak ada plan yang dipilih
        //     }
        //     } else {
        //     setCurrentPlan("Free")
        //     }
        const planAliasMap: Record<string, "Free" | "Starter" | "Growth"> = {
        "Free Plan": "Free",
        "Basic Plan": "Starter",
        "Pro Plan": "Growth",
        }

        if (statusJson.subscription_active && statusJson.plan_name) {
        const mappedPlan = planAliasMap[statusJson.plan_name] ?? "Free"
        console.log("Plan name from API:", statusJson.plan_name)
        console.log("Mapped current plan:", mappedPlan)
        setCurrentPlan(mappedPlan)
        } else {
        setCurrentPlan("Free")
        }
        } catch (err) {
            console.error("Error fetching data", err)
        } finally {
            setLoading(false)
        }
    }

    fetchData()
}, [])


    // useEffect(() => {
    //     const fetchBilling = async () => {
    //         try {

    //             // const parse = await fetch("https://api.stripe.com/v1/billing/invoices",)
    //             // const data = await parse.json()
    //             // const data = [
    //             //     {
    //             //         "id": "INV-001",
    //             //         "invoiceDate": "2025-05-01",
    //             //         "plan": "Basic Plan",
    //             //         "ammount": "49.99",
    //             //         "status": "pending"
    //             //     },
    //             //     {
    //             //         "id": "INV-002",
    //             //         "invoiceDate": "2025-04-15",
    //             //         "plan": "Pro Plan",
    //             //         "ammount": "99.99",
    //             //         "status": "processing"
    //             //     },
    //             //     {
    //             //         "id": "INV-003",
    //             //         "invoiceDate": "2025-04-01",
    //             //         "plan": "Enterprise Plan",
    //             //         "ammount": "199.99",
    //             //         "status": "paid"
    //             //     },
    //             //     {
    //             //         "id": "INV-004",
    //             //         "invoiceDate": "2025-03-20",
    //             //         "plan": "Basic Plan",
    //             //         "ammount": "49.99",
    //             //         "status": "failed"
    //             //     },
    //             //     {
    //             //         "id": "INV-005",
    //             //         "invoiceDate": "2025-05-05",
    //             //         "plan": "Pro Plan",
    //             //         "ammount": "99.99",
    //             //         "status": "paid"
    //             //     }
    //             // ]

    //             setBillings(data)
    //         } catch (error) {
    //             console.error("Failed to fetch billing data:", error)
    //         } finally {
    //             setLoading(false)
    //         }
    //     }

    //     fetchBilling()
    // }, [])

    // useEffect(() => {
    //     console.log("Current Plan:", currentPlan)
    // }, [currentPlan])
    const planLimitMap: Record<"Free" | "Starter" | "Growth", number> = {
    Free: 10,
    Starter: 20,
    Growth: 500,
    }

    const maxEmployees = planLimitMap[currentPlan] ?? 10


    // useEffect(() => {
    //     console.log("Current Plan:", currentPlan)
    // }, [currentPlan])
    const planLimitMap: Record<"Free" | "Starter" | "Growth", number> = {
    Free: 10,
    Starter: 20,
    Growth: 500,
    }

    const maxEmployees = planLimitMap[currentPlan] ?? 10


    if (loading) return <p>Loading...</p>

    return (
        <CustomPage>
            <CustomPageHeader>
                <CustomPageTitleContainer>
                    <CustomPageTitle>Pricing Plan & Add-on</CustomPageTitle>
                    <CustomPageSubtitle>Review your current plan, explore upgrades, and access your payment records.</CustomPageSubtitle>
                    {subscriptionActive && expiresAt && (
                    <p className="text-sm text-muted-foreground">
                        Your plan expires on {new Date(expiresAt).toLocaleDateString()}
                    </p>
                    )}
                </CustomPageTitleContainer>
            </CustomPageHeader>
            {/* <Alert variant={"destructive"}>
                <AlertTriangle className="h-4 w-4 text-error-500" />
                <AlertTitle>Your subscription payment is overdue</AlertTitle>
                <AlertDescription>Administrative actions are restricted and employees cannot record attendance. Complete your payment to restore full functionality.</AlertDescription>
            </Alert> */}
            {subscriptionActive === false && (
                <Alert variant={"destructive"}>
                    <AlertTriangle className="h-4 w-4 text-error-500" />
                    <AlertTitle>Your subscription payment is overdue</AlertTitle>
                    <AlertDescription>
                        Administrative actions are restricted and employees cannot record attendance. Complete your payment to restore full functionality.
                    </AlertDescription>
                </Alert>
            )}
            
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
                    <Link href={`/dashboard/pricing/checkout?plan=${planMap["Free Plan"]}&planName=Free Plan`} className="w-full" >
                        <Button variant={"outline"} className="w-full" size={"lg"} disabled={currentPlan === "Free" || !planMap["Free Plan"]}>
                    <Link href={"/dashboard/pricing/checkout?plan=1"} className="w-full" >
                        <Button variant={"outline"} className="w-full" size={"lg"} disabled={currentPlan === "Free"}>
                            {/* Current Plan */}
                            {currentPlan === "Free" ? "Current Plan" : "Choose Plan"}
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
                    <Link  href={`/dashboard/pricing/checkout?plan=${planMap["Basic Plan"]}&planName=Basic Plan`} className="w-full" >
                        <Button variant={"outline"} className="w-full" size={"lg"} disabled={currentPlan === "Starter" || !planMap["Basic Plan"]}>
                    <Link href={"/dashboard/pricing/checkout?plan=2"} className="w-full" >
                        <Button variant={"outline"} className="w-full" size={"lg"} disabled={currentPlan === "Starter"}>
                            {/* Upgrade */}
                            {currentPlan === "Starter" ? "Current Plan" : "Upgrade"}
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
                    <Link href={`/dashboard/pricing/checkout?plan=${planMap["Growth Plan"]}&planName=Growth Plan`} className="w-full" >
                        <Button variant={"secondary"} className="w-full" size={"lg"} disabled={currentPlan === "Growth" || !planMap["Pro Plan"]}>
                    <Link href={"/dashboard/pricing/checkout?plan=3"} className="w-full" >
                            {/* Choose Plan */}
                            {currentPlan === "Growth" ? "Current Plan" : "Upgrade"}
                        </Button>
                    </Link>
                </PricingCard>
            </div>
            <EmployeeAddonSlider activeUser={401} currentLimit={maxEmployees} monthlyPricePerEmployee={1.5} currentPlan={currentPlan}/>
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
