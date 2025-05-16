"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Button } from "./ui/button"

// Helper function to parse text with *text* for bold formatting
function parseFeatureText(text: string) {
    // Split text by * and alternate between plain and bold
    const parts = text.split(/(\*[^\*]+\*)/g)
    return parts.map((part, index) => {
        if (part.startsWith("*") && part.endsWith("*")) {
            // Remove * and render as bold
            return <span key={index} className="font-medium opacity-100">{part.slice(1, -1)}</span>
        } else {
            return <span key={index} className="opacity-70">{part}</span>
        }
    })
}

interface PricingCardProps {
    children?: React.ReactNode
    title: string
    description: string
    price: string
    duration: string
    features: string[]
    variant?: "default" | "primary"
}

export default function PricingCard({ children, title, description, price, duration, features, variant = "default" }: PricingCardProps) {
    return (
        <Card className={cn(variant === "primary" && "bg-primary text-primary-foreground")}>
            <CardHeader>
                <CardTitle className="font-semibold">{title}</CardTitle>
                <CardDescription className={cn("text-sm", variant === "default" ? "text-muted-foreground" : "text-primary-foreground opacity-70")}>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 min-h-fit flex-1">
                <div className="flex flex-col gap-4">
                    <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-medium">{price}</div>
                        <div className={cn("text-sm", variant === "default" ? "text-muted-foreground" : "text-primary-foreground opacity-70")}>{duration}</div>
                    </div>
                    <ul className="space-y-2">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <Check className={cn("mt-0.5 h-[18px] w-[18px] ", variant === "default" ? "text-primary" : "text-primary-foreground")} />
                                <p className={cn("text-sm flex-1", variant === "default" ? "text-neutral-600" : "text-primary-foreground")}>{parseFeatureText(feature)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                {children}
            </CardFooter>
        </Card>
    )
}