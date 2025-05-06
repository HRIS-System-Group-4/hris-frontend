import * as React from "react"

import { cn } from "@/lib/utils"

function CustomPage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="custom-page"
      className={cn(
        "flex flex-col gap-4",
        className
      )}
      {...props}
    />
  )
}

function CustomPageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "flex gap-0",
        className
      )}
      {...props}
    />
  )
}

function CustomPageTitleContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-title-container"
      className={cn("flex flex-col gap-1 flex-1", className)}
      {...props}
    />
  )
}

function CustomPageTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-title"
      className={cn("font-semibold text-xl", className)}
      {...props}
    />
  )
}

function CustomPageSubtitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-subtitle"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CustomPageTitleButtons({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-title-container"
      className={cn("flex gap-3 w-fit", className)}
      {...props}
    />
  )
}

export {
  CustomPage,
  CustomPageHeader,
  CustomPageTitleContainer,
  CustomPageTitle,
  CustomPageSubtitle,
  CustomPageTitleButtons,
}