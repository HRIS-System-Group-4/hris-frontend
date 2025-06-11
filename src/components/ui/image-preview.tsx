"use client"

import { useState } from "react"
import Image from "next/image"
import { Download, X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface ImagePreviewProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  previewWidth?: number
  previewHeight?: number
  fileName?: string
  showControls?: boolean
}

export function ImagePreview({
  src,
  alt,
  width = 40,
  height = 40,
  className = "",
  previewWidth = 600,
  previewHeight = 600,
  fileName,
  showControls = true,
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDownload = async () => {
    try {
      // Fetch the image
      const response = await fetch(src)
      const blob = await response.blob()

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName || src.split("/").pop() || "image"
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative group">
        <DialogTrigger asChild>
          <div className="cursor-pointer relative">
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={width}
              height={height}
              className={`rounded-md object-cover ${className}`}
            />
            {showControls && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <ZoomIn className="text-white h-5 w-5" />
              </div>
            )}
          </div>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-transparent border-none">
        <div className="relative bg-white rounded-lg overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>{alt}</DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleDownload} title="Download image">
                  <Download className="h-4 w-4" />
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" size="icon" title="Close">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>
            <DialogDescription>{fileName || src.split("/").pop() || "Image preview"}</DialogDescription>
          </DialogHeader>

          <div className="relative flex items-center justify-center bg-muted/30 p-4">
            <div className="relative" style={{ maxWidth: "100%", maxHeight: "70vh" }}>
              <Image
                src={src || "/placeholder.svg"}
                alt={alt}
                width={previewWidth}
                height={previewHeight}
                className="object-contain max-h-[70vh]"
                priority
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}