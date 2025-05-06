"use client"

import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Variants for the detail item
const detailItemVariants = cva("flex gap-2 w-full", {
  variants: {
    layout: {
      row: "flex-row items-center justify-between",
      column: "flex-col",
      inline: "flex-row items-center",
    },
    size: {
      sm: "text-sm",
      default: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    layout: "row",
    size: "default",
  },
})

// Variants for the detail group
const detailGroupVariants = cva("w-full", {
  variants: {
    spacing: {
      compact: "space-y-2",
      default: "space-y-4",
      loose: "space-y-6",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
})

interface DetailItemProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof detailItemVariants> {
  label: React.ReactNode
  children: React.ReactNode
  labelClassName?: string
  valueClassName?: string
}

interface DetailGroupProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof detailGroupVariants> {
  title?: string
  children: React.ReactNode
  card?: boolean
  separator?: boolean
}

interface DetailContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof detailGroupVariants> {
  children: React.ReactNode
  separator?: boolean
}

export function DetailContainer({
  children,
  className,
  ...props
}: DetailContainerProps) {
  return (
    // <div className={cn(detailItemVariants({}), className)} {...props}>
      <div className={cn("text-sm text-muted-foreground flex gap-4", className)} {...props}>
        {children}
      </div>
    // </div>
  )
}

export function DetailItem({
  label,
  children,
  layout = "row",
  size = "default",
  className,
  labelClassName,
  valueClassName,
  ...props
}: DetailItemProps) {
  return (
    <div className={cn(detailItemVariants({ layout, size }), className)} {...props}>
      <div className={cn("text-sm text-muted-foreground", layout === "row" && "flex-shrink-0", labelClassName)}>
        {label}
      </div>
        {children}
    </div>
  )
}

export function DetailGroup({
  title,
  children,
  spacing = "default",
  card = false,
  separator = false,
  className,
  ...props
}: DetailGroupProps) {
  const content = (
    <div className={cn(detailGroupVariants({ spacing }), className)} {...props}>
      {title && (
        <>
          <div className="font-semibold text-lg">{title}</div>
          {separator && <Separator className="my-2" />}
        </>
      )}
      <div className={cn("grid gap-y-4", spacing === "compact" ? "gap-y-2" : spacing === "loose" ? "gap-y-6" : "")}>
        {children}
      </div>
    </div>
  )

  if (card) {
    return (
      <Card>
        {title && (
          <CardHeader className="pb-0">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className={cn("pt-6", !title && "pt-6")}>
          <div className={cn(detailGroupVariants({ spacing }), "pt-0")}>{children}</div>
        </CardContent>
      </Card>
    )
  }

  return content
}
