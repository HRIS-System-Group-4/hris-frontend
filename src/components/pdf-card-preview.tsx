"use client"

import type * as React from "react"
import { Download, Eye, FileText } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PdfCardPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The URL of the PDF file
   */
  pdfUrl: string
  /**
   * The URL of the thumbnail image for the PDF
   * If not provided, a generic PDF icon will be shown
   */
  thumbnailUrl?: string
  /**
   * The name of the PDF file
   */
  fileName: string
  /**
   * The size of the PDF file in bytes
   */
  fileSize?: number
  /**
   * The date the PDF was created or last modified
   */
  dateModified?: Date
  /**
   * Number of pages in the PDF
   */
  pageCount?: number
  /**
   * Whether the PDF is currently loading
   */
  isLoading?: boolean
  /**
   * Callback when the PDF card is clicked
   */
  onView?: (pdfUrl: string) => void
  /**
   * Callback when the download button is clicked
   * If not provided, the default browser download behavior will be used
   */
  onDownload?: (pdfUrl: string) => void
}

export function PdfCardPreview({
  className,
  pdfUrl,
  thumbnailUrl,
  fileName,
  fileSize,
  dateModified,
  pageCount,
  isLoading = false,
  onView,
  onDownload,
  ...props
}: PdfCardPreviewProps) {
  // Format file size to human-readable format
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"

    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  // Format date to human-readable format
  const formatDate = (date?: Date) => {
    if (!date) return "Unknown date"
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle view click
  const handleViewClick = (e: React.MouseEvent) => {
    if (isLoading) return

    if (onView) {
      e.preventDefault()
      onView(pdfUrl)
    } else {
      // Default behavior: open in new tab
      window.open(pdfUrl, "_blank")
    }
  }

  // Handle download click
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click

    if (isLoading) return

    if (onDownload) {
      onDownload(pdfUrl)
    } else {
      // Default behavior: trigger download
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "overflow-hidden transition-all hover:shadow-lg pt-0 pb-0",
          isLoading ? "opacity-70 pointer-events-none" : "cursor-pointer",
          className,
        )}
        onClick={handleViewClick}
        {...props}
      >
        <div className="relative aspect-[3/4] bg-muted">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : thumbnailUrl ? (
            <img
              src={thumbnailUrl || "/placeholder.svg"}
              alt={`Preview of ${fileName}`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted">
              <FileText className="h-20 w-20 text-muted-foreground/60" />
            </div>
          )}

          {/* Overlay with file info */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <div className="text-sm font-medium truncate">{fileName}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {pageCount && `${pageCount} pages • `}
              {formatFileSize(fileSize)}
            </div>
          </div>
        </div>

        <CardContent className="">
          <div className="space-y-1">
            <div className="font-medium truncate">{fileName}</div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDate(dateModified)}</span>
              <span>{formatFileSize(fileSize)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-3 flex justify-between px-3 gap-2 ">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={isLoading}
                onClick={handleViewClick}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open PDF</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1" disabled={isLoading} onClick={handleDownloadClick}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download PDF</TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
