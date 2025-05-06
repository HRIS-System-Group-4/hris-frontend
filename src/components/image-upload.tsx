"use client"

import * as React from "react"
import { useCallback, useState } from "react"
import Image from "next/image"
import { Download, Upload, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ImageUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onImageUpload?: (file: File) => void
  maxSizeMB?: number
  acceptedFileTypes?: string[]
}

export function ImageUpload({
  className,
  onImageUpload,
  maxSizeMB = 5,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ...props
}: ImageUploadProps) {
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (file: File | null) => {
      setError(null)

      if (!file) return

      // Validate file type
      if (!acceptedFileTypes.includes(file.type)) {
        setError(`File type not supported. Please upload: ${acceptedFileTypes.join(", ")}`)
        return
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size exceeds ${maxSizeMB}MB limit`)
        return
      }

      setIsLoading(true)

      // Create a preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setImage({
          file,
          preview: reader.result as string,
        })
        setIsLoading(false)

        if (onImageUpload) {
          onImageUpload(file)
        }
      }

      reader.onerror = () => {
        setError("Failed to read file")
        setIsLoading(false)
      }

      reader.readAsDataURL(file)
    },
    [acceptedFileTypes, maxSizeMB, onImageUpload],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileChange(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0] || null
    handleFileChange(file)
  }

  const handleRemoveImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDownload = () => {
    if (!image) return

    // Create a download link
    const link = document.createElement("a")
    link.href = image.preview
    link.download = image.file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          image ? "bg-muted/30" : "hover:bg-muted/30",
          "cursor-pointer",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!image ? handleButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(",")}
          className="sr-only"
          onChange={handleInputChange}
          disabled={isLoading}
        />

        {!image ? (
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground">
                Supports: {acceptedFileTypes.map((type) => type.split("/")[1]).join(", ")}
              </p>
              <p className="text-xs text-muted-foreground">Max size: {maxSizeMB}MB</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 z-10 rounded-full bg-foreground/10 hover:bg-foreground/20"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveImage()
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {image && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={image.preview || "/placeholder.svg"}
                alt="Preview"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm truncate max-w-[70%]" title={image.file.name}>
                {image.file.name}
              </p>
              <Button variant="outline" size="sm" className="gap-1" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
