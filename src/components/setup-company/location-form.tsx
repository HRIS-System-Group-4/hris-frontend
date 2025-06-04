// "use client"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import MapSearchComponent from "../map/map-search"

// const locationFormSchema = z.object({
//     latitude: z
//         .string()
//         .regex(/^-?\d+(\.\d+)?$/, 'Invalid latitude')
//         .optional()
//         .or(z.literal(''))
//         .refine((val) => val !== '' && val !== undefined, {
//             message: "Please select a location",
//         }),
//     longitude: z
//         .string()
//         .regex(/^-?\d+(\.\d+)?$/, 'Invalid longitude')
//         .optional()
//         .or(z.literal(''))
//         .refine((val) => val !== '' && val !== undefined, {
//             message: "Please select a location",
//         }),
// })

// export type     LocationFormData = z.infer<typeof locationFormSchema>

// interface LocationFormProps {
//     onSubmit: (data: LocationFormData) => void
//     onBack: () => void
//     defaultValues?: Partial<LocationFormData>
//     isLoading?: boolean
// }

// export function LocationForm({ onSubmit, onBack, defaultValues, isLoading }: LocationFormProps) {
//     const form = useForm<LocationFormData>({
//         resolver: zodResolver(locationFormSchema),
//         defaultValues: {
//             latitude: "",
//             longitude: "",
//             ...defaultValues,
//         },
//     })

//     const handleLocationSelect = (latitude?: number, longitude?: number) => {
//         if (latitude && longitude) {
//             form.setValue('latitude', latitude.toString(), { shouldValidate: true });
//             form.setValue('longitude', longitude.toString(), { shouldValidate: true });
//         } else {
//             form.setValue('latitude', "", { shouldValidate: true });
//             form.setValue('longitude', "", { shouldValidate: true });
//         }
//     };

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 <MapSearchComponent onLocationSelect={handleLocationSelect} />
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
//                     {/* Bank */}
//                     <FormField
//                         control={form.control}
//                         name="latitude"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Latitude</FormLabel>
//                                 <FormControl className="w-full">
//                                     <Input placeholder="Please select a location" readOnly {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                     <FormField
//                         control={form.control}
//                         name="longitude"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Longitude</FormLabel>
//                                 <FormControl className="w-full">
//                                     <Input placeholder="Please select a location" readOnly {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                 </div>
//                 <div className="grid grid-cols-1 md:flex md:w-full gap-6">
//                     {onBack && (
//                         <Button type="button" variant="outline" onClick={onBack}>
//                             Back
//                         </Button>
//                     )}
//                     <Button type="submit" disabled={isLoading} className="flex flex-1">
//                         {isLoading ? "Saving..." : "Continue"}
//                     </Button>
//                 </div>
//             </form>
//         </Form>
//     )
// }
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { locationSchema, LocationFormData } from "@/schemas/company-schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import MapSearchComponent from "../map/map-search"

interface LocationFormProps {
  onSubmit: (data: LocationFormData) => void
  onBack: () => void
  defaultValues?: Partial<LocationFormData>
  isLoading?: boolean
}

export function LocationForm({
  onSubmit,
  onBack,
  defaultValues,
  isLoading
}: LocationFormProps) {
  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      latitude: "",
      longitude: "",
      ...defaultValues
    }
  })

  const handleLocationSelect = (latitude?: number, longitude?: number) => {
    if (latitude && longitude) {
      form.setValue("latitude", latitude.toString(), { shouldValidate: true })
      form.setValue("longitude", longitude.toString(), { shouldValidate: true })
    } else {
      form.setValue("latitude", "", { shouldValidate: true })
      form.setValue("longitude", "", { shouldValidate: true })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <MapSearchComponent onLocationSelect={handleLocationSelect} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input placeholder="Please select a location" readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input placeholder="Please select a location" readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:flex gap-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isLoading} className="flex flex-1">
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
