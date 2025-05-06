"use client"
import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PdfCardPreview } from "@/components/pdf-card-preview"

// Sample PDF data
const samplePdfs = [
  {
    id: "1",
    fileName: "Annual Report 2023.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    thumbnailUrl: "/placeholder.svg?height=400&width=300",
    fileSize: 2540000, // 2.54 MB
    dateModified: new Date("2023-12-15"),
    pageCount: 24,
  },
  {
    id: "2",
    fileName: "Project Proposal.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    thumbnailUrl: "/placeholder.svg?height=400&width=300",
    fileSize: 1250000, // 1.25 MB
    dateModified: new Date("2023-11-28"),
    pageCount: 12,
  },
  {
    id: "3",
    fileName: "Financial Statement Q4.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    thumbnailUrl: "/placeholder.svg?height=400&width=300",
    fileSize: 3800000, // 3.8 MB
    dateModified: new Date("2023-12-30"),
    pageCount: 32,
  },
  {
    id: "4",
    fileName: "User Manual v2.0.pdf",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileSize: 5200000, // 5.2 MB
    dateModified: new Date("2023-10-15"),
    pageCount: 48,
  },
]

export function PdfGallery() {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleViewPdf = (pdfUrl: string) => {
    setSelectedPdf(pdfUrl)
  }

  const handleDownloadPdf = (pdfUrl: string) => {
    // Simulate download start
    setIsLoading(true)

    // In a real app, you might want to track download progress
    setTimeout(() => {
      setIsLoading(false)

      // Default download behavior
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = samplePdfs.find((pdf) => pdf.pdfUrl === pdfUrl)?.fileName || "document.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {samplePdfs.map((pdf) => (
          <PdfCardPreview
            key={pdf.id}
            pdfUrl={pdf.pdfUrl}
            thumbnailUrl={pdf.thumbnailUrl}
            fileName={pdf.fileName}
            fileSize={pdf.fileSize}
            dateModified={pdf.dateModified}
            pageCount={pdf.pageCount}
            isLoading={isLoading}
            onView={handleViewPdf}
            onDownload={handleDownloadPdf}
          />
        ))}
      </div>

      {/* PDF Viewer Dialog */}
      <Dialog open={!!selectedPdf} onOpenChange={(open) => !open && setSelectedPdf(null)}>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0">
          <div className="absolute top-2 right-2 z-10">
            <Button variant="ghost" size="icon" onClick={() => setSelectedPdf(null)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          {selectedPdf && <iframe src={`${selectedPdf}#toolbar=0`} className="w-full h-full" title="PDF Viewer" />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
