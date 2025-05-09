"use client"

import { useState, useEffect, act } from "react"
import { ArrowRight, Info, Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { add } from "date-fns"
import Link from "next/link"

interface EmployeeAddonSliderProps {
  currentLimit: number
  activeUser: number
  monthlyPricePerEmployee: number
  maxEmployees?: number
  onLimitChange?: (newLimit: number) => void
  className?: string
}

export function EmployeeAddonSlider({
  currentLimit,
  activeUser,
  monthlyPricePerEmployee,
  maxEmployees = 1000,
  onLimitChange,
  className,
}: EmployeeAddonSliderProps) {
  activeUser = Math.ceil(activeUser / 10) * 10
  const [newLimit, setNewLimit] = useState(currentLimit)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isAnimatingOpen, setIsAnimatingOpen] = useState(false)

  const proratedPricePerEmployee = monthlyPricePerEmployee / 30

  // Calculate additional employees and cost
  const additionalEmployees = Math.max(newLimit - currentLimit)
  const additionalCostMonthly = additionalEmployees * monthlyPricePerEmployee
  const additionalCostProrated = additionalEmployees * proratedPricePerEmployee

  // Calculate percentage for progress bar
  const currentActiveUserPercentage = (activeUser / maxEmployees) * 100
  const currentLimitPercentage = (currentLimit / maxEmployees) * 100
  const newPercentage = (newLimit / maxEmployees) * 100

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setNewLimit(value[0])
    if (onLimitChange) {
      onLimitChange(value[0])
    }
  }

  // Handle increment/decrement
  const handleIncrement = () => {
    const updatedLimit = Math.min(newLimit + 10, maxEmployees)
    setNewLimit(updatedLimit)
    if (onLimitChange) {
      onLimitChange(updatedLimit)
    }
  }

  const handleDecrement = () => {
    const updatedLimit = Math.max(newLimit - 10, activeUser)
    setNewLimit(updatedLimit)
    if (onLimitChange) {
      onLimitChange(updatedLimit)
    }
  }

  // Animate the progress bar when values change
  useEffect(() => {
    if (additionalEmployees > 0 && !isAnimatingOpen) {
      setIsAnimatingOpen(true)
      const timer = setTimeout(() => setIsAnimatingOpen(false), 500)
      return () => clearTimeout(timer)
    }
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 10)
    return () => clearTimeout(timer)
  }, [newLimit, additionalEmployees])

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Add More Employees</CardTitle>
            <CardDescription className="mt-1.5">
              Increase your employee limit to accommodate your growing team
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">More information</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Your current plan includes {currentLimit} employees. Add more employees at a rate of $
                  {monthlyPricePerEmployee.toFixed(2)} per employee per month.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current vs New Limit Visualization */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Current Limit</span>
            <span className="font-medium">{currentLimit} employees</span>
          </div>

          <div className="relative h-8">
            {/* Base progress bar (current limit) */}
            <Progress value={currentActiveUserPercentage} className="h-8" />

            {/* Additional progress bar (new limit) */}

            <div
              className={cn(
                "absolute top-0 left-0 h-8 rounded-r-full transition-all duration-500",
                isAnimating && "animate-pulse", additionalEmployees === 0 ? "" : "bg-primary/30"
              )}
              style={{
                width: `${newPercentage}%`,
                clipPath: `inset(0 0 0 ${currentLimitPercentage}%)`,
              }}
            />

            {/* Active user marker */}
            <div
              className="absolute top-0 left-0 h-8 bg-primary/10 rounded-r-full transition-all duration-500"
              style={{ left: `${currentActiveUserPercentage}%` }}
            >
              <Badge
                variant="outline"
                className="absolute -top-7 -translate-x-1/2 bg-background border-primary text-xs"
              >
                Active
              </Badge>
            </div>

            {/* Current limit marker */}
            <div
              className={
                "absolute top-0 left-0 h-8 bg-primary/30 rounded-r-full transition-all duration-500"
              }
              style={{
                width: `${currentLimitPercentage}%`,
                clipPath: `inset(0 0 0 ${currentLimitPercentage}%)`,
              }}
            >
            </div>
            <div
              className="absolute top-0 h-8 border-r-2 border-primary transition-all duration-500"
              style={{ left: `${currentLimitPercentage}%` }}
            >
              <Badge variant={"default"} className="absolute -top-7 -translate-x-1/2 text-xs">Limit</Badge>
            </div>

            {/* New limit marker (only show if different from current) */}
            {additionalEmployees !== 0 && (
              <div
                className={cn("absolute top-0 h-8 border-r-2 transition-all duration-500", additionalEmployees > 0 ? "border-primary" : "border-destructive")}
                style={{ left: `${newPercentage}%` }}
              >
                <Badge variant={additionalEmployees > 0 ? "default" : "destructive"} className="absolute -top-7 -translate-x-1/2 text-xs">New</Badge>
              </div>
            )}
          </div>

          <div className="flex justify-between text-sm">
            <span>0</span>
            <span>{maxEmployees}</span>
          </div>
        </div>

        {/* Slider Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">New Employee Limit</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleDecrement}
                // disabled={newLimit <= currentLimit}
                disabled={newLimit == activeUser}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-16 text-center font-medium">{newLimit}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleIncrement}
                disabled={newLimit >= maxEmployees}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Slider
            value={[newLimit]}
            // min={currentLimit}
            min={activeUser}
            max={maxEmployees}
            step={10}
            onValueChange={(value) => handleSliderChange(value)}
            className="py-4"
          />
        </div>

        {/* Summary */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Additional Employees</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{currentLimit}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{newLimit}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Difference</span>
            <Badge variant={additionalEmployees > 0 ? "default" : additionalEmployees < 0 ? "destructive" : "outline"} className="font-medium">
              {additionalEmployees > 0 ? "+" : ""} {additionalEmployees} employees
            </Badge>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-medium">Additional Monthly Cost</span>
            <div className="text-right">
              <div className="font-bold text-lg">${additionalCostMonthly.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                {additionalEmployees} × ${monthlyPricePerEmployee.toFixed(2)}
              </div>
            </div>
          </div>
          {additionalEmployees > 0 && (
            <div className={cn("flex justify-between items-center pt-2 duration-400", isAnimatingOpen && "transition-all")}>
              <span className="font-medium">Prorated Until May 31</span>
              <div className="text-right">
                <div className="font-bold text-lg">${additionalCostProrated.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {additionalEmployees} × ${proratedPricePerEmployee.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/dashboard/pricing/checkout?plan=3&additionalEmployees=${additionalEmployees}`} className="w-full">
          <Button className="w-full" disabled={additionalEmployees === 0} variant={additionalEmployees >= 0 ? "default" : "destructive"}>
            {additionalEmployees === 0 ? "No Changes" : additionalEmployees > 0 ? `Add ${additionalEmployees} Employees` : `Remove ${additionalEmployees * (-1)} Employees`}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
