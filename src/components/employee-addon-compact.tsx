"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface EmployeeAddonCompactProps {
  onAdditionalEmployeesChange: (data: number) => void;
  additionalEmployeesParam: number;
  currentLimit: number;
  activeUser: number;
  monthlyPricePerEmployee: number;
  maxEmployees?: number;
  onLimitChange?: (newLimit: number) => void;
  className?: string;
}

export function EmployeeAddonCompact({
  onAdditionalEmployeesChange,
  additionalEmployeesParam,
  currentLimit,
  activeUser,
  monthlyPricePerEmployee,
  maxEmployees = 1000,
  onLimitChange,
  className,
}: EmployeeAddonCompactProps) {
  const [newLimit, setNewLimit] = useState(currentLimit);
  const proratedPricePerEmployee = monthlyPricePerEmployee / 30;

    // Calculate additional employees and cost
    const additionalEmployees = Math.max(newLimit - currentLimit)
    // onAdditionalEmployeesChange(additionalEmployees)
    useEffect(() => {
    onAdditionalEmployeesChange(additionalEmployees)
    }, [additionalEmployees])
    const additionalCostMonthly = additionalEmployees * monthlyPricePerEmployee
    const additionalCostProrated = additionalEmployees * proratedPricePerEmployee
  // Calculate additional employees and cost
  const additionalEmployees = Math.max(newLimit - currentLimit);
  const additionalCostMonthly = additionalEmployees * monthlyPricePerEmployee;
  const additionalCostProrated = additionalEmployees * proratedPricePerEmployee;

  // Inform parent (CheckOutPage) only when additionalEmployees changes
  useEffect(() => {
    onAdditionalEmployeesChange(additionalEmployees);
  }, [additionalEmployees, onAdditionalEmployeesChange]);

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setNewLimit(value[0]);
    if (onLimitChange) {
      onLimitChange(value[0]);
    }
  };

  // Update limit when props change
  useEffect(() => {
    if (additionalEmployeesParam !== 0) {
      setNewLimit(currentLimit + additionalEmployeesParam);
    }
  }, [additionalEmployeesParam, currentLimit]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Add More Employees</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-1">
            Current:{" "}
            <strong className={"text-primary transition-all duration-500"}>
              {activeUser}
            </strong>{" "}
            /
            <span
              className={additionalEmployees !== 0 ? "text-muted-foreground" : ""}
            >
              {currentLimit}
            </span>
            <div
              className="flex items-center gap-1 transition-opacity duration-200"
              style={{ opacity: additionalEmployees > 0 ? 1 : 0 }}
            >
              <ArrowRight className="h-3 w-3" />
              <span>
                <strong>{newLimit}</strong>
              </span>
            </div>
          </span>
          <Badge
            variant={
              additionalEmployees === 0
                ? "outline"
                : additionalEmployees > 0
                ? "default"
                : "destructive"
            }
            className="text-xs"
          >
            {additionalEmployees >= 0 ? "+" : ""}
            {additionalEmployees} employees
          </Badge>
        </div>

        <Slider
          value={[newLimit]}
          min={activeUser}
          max={maxEmployees}
          step={10}
          onValueChange={handleSliderChange}
        />
      </CardContent>
      {/* Optional Footer button */}
      {/* <CardFooter>
        <Button size="sm" className="w-full gap-1" disabled={additionalEmployees === 0}>
          <Plus className="h-3.5 w-3.5" />
          {additionalEmployees === 0 ? "No Changes" : `Add ${additionalEmployees}`}
        </Button>
      </CardFooter> */}
    </Card>
  );
}
