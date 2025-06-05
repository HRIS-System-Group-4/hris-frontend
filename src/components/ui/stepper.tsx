"use client"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { use } from "react"

export interface Step {
    id: string
    title: string
    description?: string
    optional?: boolean
}

interface StepperProps {
    steps: Step[]
    currentStep: number
    className?: string
    variant?: "default" | "minimal" | "elevated"
}

export function Stepper({ steps, currentStep, className, variant = "default" }: StepperProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case "minimal":
                return "bg-transparent"
            case "elevated":
                return "bg-card border border-border/40 rounded-xl p-6"
            default:
                return "bg-background/50 backdrop-blur-sm border border-border/20 rounded-lg p-4"
        }
    }
    const isMobile = useIsMobile();

    return (
        <nav
            aria-label="Progress"
            className={cn(
                "transition-all duration-300",
                getVariantStyles(),
                className
            )}
        >
            <ol className="flex items-center space-x-0">
                {steps.map((step, index) => {
                    const stepNumber = index + 1
                    const isCompleted = stepNumber < currentStep
                    const isCurrent = stepNumber === currentStep
                    const isUpcoming = stepNumber > currentStep

                    return (
                        <li
                            key={step.id}
                            className={cn("flex items-center flex-1 last:flex-none group", isMobile ? isCurrent ? "" : "hidden" : "")} 
                        >
                            {/* Step Content */}
                            <div className="flex items-center min-w-0">
                                {/* Step Circle */}
                                <div className="relative flex-shrink-0">
                                    <div
                                        className={cn(
                                            "relative z-10 flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 transform",
                                            {
                                                // Completed state
                                                "border-primary-500 bg-primary-500 text-white scale-110": isCompleted,
                                                // Current state
                                                "border-primary bg-primary-50 text-primary-700 scale-110 ring-4 ring-primary-500/20": isCurrent,
                                                // Upcoming state
                                                "border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400 hover:bg-gray-100": isUpcoming,
                                            }
                                        )}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5 animate-in zoom-in duration-200" />
                                        ) : (
                                            <span className="transition-all duration-200">
                                                {stepNumber}
                                            </span>
                                        )}
                                    </div>

                                    {/* Pulse effect for current step */}
                                    {isCurrent && (
                                        <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse opacity-30" />
                                    )}
                                </div>

                                {/* Step Text */}
                                <div className="ml-4 min-w-0 flex-1">
                                    <div className="flex items-center space-x-2">
                                        <p
                                            className={cn(
                                                "text-sm font-semibold leading-tight transition-all duration-200",
                                                {
                                                    "text-black": isCompleted || isCurrent,
                                                    "text-gray-600": isUpcoming,
                                                }
                                            )}
                                        >
                                            {step.title}
                                        </p>
                                        {step.optional && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                Optional
                                            </span>
                                        )}
                                    </div>
                                    {step.description && (
                                        <p
                                            className={cn(
                                                "text-xs leading-relaxed mt-1 transition-all duration-200",
                                                {
                                                    "text-neutral-600": isCompleted || isCurrent,
                                                    "text-gray-500": isUpcoming,
                                                }
                                            )}
                                        >
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className={cn("hidden md:flex items-center mx-4 flex-1 min-w-0 ")}>
                                    <div className={cn("flex items-center w-full")}>
                                        {/* Animated progress line */}
                                        <div className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-500 ease-out rounded-full",
                                                    {
                                                        "bg-primary-500 w-full": isCompleted,
                                                        "bg-primary-500 w-1/2": isCurrent,
                                                        "bg-transparent w-0": isUpcoming,
                                                    }
                                                )}
                                            />
                                        </div>

                                        {/* Chevron */}
                                        <ChevronRight
                                            className={cn(
                                                "ml-2 h-4 w-4 transition-all duration-200",
                                                {
                                                    "text-primary-500": isCompleted || isCurrent,
                                                    "text-gray-400": isUpcoming,
                                                }
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        </li>
                    )
                })}
            </ol>
            {useIsMobile() && (
                <div className="mt-6 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-500 transition-all duration-700 ease-out rounded-full"
                        style={{
                            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
                        }}
                    />
                </div>
            )
            }
        </nav >
    )
}