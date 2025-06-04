"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stepper, type Step } from "@/components/ui/stepper"
import { CompanyForm } from "@/components/setup-company/company-form"
// import { LocationForm, type LocationFormData } from "@/components/setup-company/location-form"
import { LocationForm } from "@/components/setup-company/location-form"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { CompanyFormData } from "@/schemas/company-schema"
import { CompanyInfoFormData, LocationFormData } from "@/schemas/company-schema"

import Image from "next/image"
import { Router } from "next/router"
import Link from "next/link"

const steps: Step[] = [
  {
    id: "company",
    title: "Company Information",
    description: "Basic company details",
  },
  {
    id: "location",
    title: "Company Location",
    description: "Location info",
  },
]

// interface SetupData {
//   company?: CompanyFormData
//   location?: LocationFormData
// }

interface SetupData {
  company?: CompanyInfoFormData & { id?: string }
  location?: LocationFormData
}
interface SetupStepperCardProps {
  onComplete?: (data: SetupData) => void
  className?: string
}

export function SetupCompanyCard({ onComplete, className }: SetupStepperCardProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [setupData, setSetupData] = useState<SetupData>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const handleCompanySubmit = (data: CompanyInfoFormData) => {
    setSetupData((prev) => ({ ...prev, company: data }))
    setCurrentStep(2)
    toast({
      title: "Company information saved locally",
      description: "Please enter location info.",
    })
  }

  const handleLocationSubmit = async (locationData: LocationFormData) => {
    setIsLoading(true)
    try {
      const companyData = setupData.company
      if (!companyData) throw new Error("Company data is missing")

      // Gabungkan company + location data ke payload
      const payload = {
        company_name: companyData.companyName,
        company_username: companyData.companyUsername,
        latitude: parseFloat(locationData.latitude),
        longitude: parseFloat(locationData.longitude),
        location_radius: 200, // bisa kamu ambil dari form jika ada
      }
      console.log("PAYLOAD YANG DIKIRIM:", payload)
      console.log("TOKEN YANG DIKIRIM:", localStorage.getItem("token"));

      const response = await fetch("http://localhost:8000/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let errorMessage = "Failed to save company data"
        try {
          const err = await response.json()
          errorMessage = err.message || errorMessage
        } catch (_) {
          // respons bukan JSON (mungkin HTML), biarkan pakai pesan default
        }
        throw new Error(errorMessage)
      }

      setIsCompleted(true)
      toast({
        title: "Setup completed successfully!",
        description: "Your company has been set up.",
      })
    } catch (error) {
      toast({
        title: "Setup failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStartOver = () => {

  }

  if (isCompleted) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Setup Complete!</h3>
              <p className="text-muted-foreground">Your company has been successfully set up and configured.</p>
            </div>
            <Link href={"/dashboard"}>
              <Button variant="outline" className="mt-4">
                Start Over
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="mx-auto mb-2 h-10 w-10">
          <Image
            src="/logo/Logo HRIS-1.png"
            alt="logo"
            width={100}
            height={100}
          />
        </div>
        <CardTitle className="text-center text-3xl">Getting Started</CardTitle>
        <CardDescription className="text-center text-sm">
          Enter your company profile to get started
        </CardDescription>
        <Stepper steps={steps} currentStep={currentStep} />
      </CardHeader>
      <CardContent>
        {currentStep === 1 && (
          <CompanyForm onSubmit={handleCompanySubmit} defaultValues={setupData.company} isLoading={isLoading} />
        )}
        {currentStep === 2 && (
          <LocationForm
            onSubmit={handleLocationSubmit}
            onBack={handleBack}
            defaultValues={setupData.location}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  )
}
