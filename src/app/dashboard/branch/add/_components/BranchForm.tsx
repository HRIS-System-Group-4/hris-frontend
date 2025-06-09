"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, set } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown, Loader2, Plus, Trash2, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Label } from "@radix-ui/react-label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleContainer } from "@/components/ui/custom-page"
import { count } from "console"
import { Textarea } from "@/components/ui/textarea"
import { DetailContainer, DetailGroup, DetailItem } from "@/components/ui/custom-detail"
import MapSearchComponent from "@/components/map/map-search"
import { addBranch } from "@/services/branchService"

// Sample data for dropdowns
const statuses = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
]

const countries = [
    { label: "Indonesia", value: "indonesia" },
    { label: "Malaysia", value: "malaysia" },
    { label: "Singapore", value: "singapore" },
    { label: "Thailand", value: "thailand" },
]

// Form schema using zod
const formSchema = z.object({
    // Personal Information
    name: z.string().min(2, "Branch name must be at least 2 characters"),
    address: z.string().min(2, "Branch address must be at least 2 characters"),
    city: z.string().min(2, "Branch city must be at least 2 characters"),
    country: z.string({
        required_error: "Please select a country",
    }),
    status: z.string({
        required_error: "Please select a country",
    }),
    latitude: z
        .string()
        .regex(/^-?\d+(\.\d+)?$/, 'Invalid latitude')
        .optional()
        .or(z.literal(''))
        .refine((val) => val !== '' && val !== undefined, {
            message: "Please select a location",
        }),
    longitude: z
        .string()
        .regex(/^-?\d+(\.\d+)?$/, 'Invalid longitude')
        .optional()
        .or(z.literal(''))
        .refine((val) => val !== '' && val !== undefined, {
            message: "Please select a location",
        }),
})

type FormValues = z.infer<typeof formSchema>

export default function AddBranchPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState<FormValues | null>(null)

    // Initialize form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema as any),
        defaultValues: {
            name: "",
            address: "",
            city: "",
            country: "indonesia",
            status: "Active",
            latitude: "",
            longitude: "",
        },
    })

    const handleLocationSelect = (latitude?: number, longitude?: number) => {
        if (latitude && longitude) {
            form.setValue('latitude', latitude.toString(), { shouldValidate: true });
            form.setValue('longitude', longitude.toString(), { shouldValidate: true });
        } else {
            form.setValue('latitude', "", { shouldValidate: true });
            form.setValue('longitude', "", { shouldValidate: true });
        }
    };

    // Form submission
    const handleConfirm = async () => {
        if (!formData) return
        setIsSubmitting(true)
        setIsDialogOpen(false)

        try {
            const payload = {
            branch_name: formData.name,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
            status: formData.status === "Active" ? "Active" : "Inactive" as "Active" | "Inactive",
            }

            const result = await addBranch(payload)

            toast({
            title: "Success",
            description: result.message || "Branch added successfully",
            })

            router.push("/dashboard/branch")
        } catch (error: any) {
            console.error("Submit error:", error.response?.data || error)

            toast({
            title: "Error",
            description: error?.response?.data?.message || error.message || "Something went wrong.",
            variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }



    // Handle form submission
    const onSubmit = async (data: FormValues) => {
        if (form.formState.isValid) {
            // Store form data and open confirmation modal
            setFormData(data)
            setIsDialogOpen(true)
        } else {
            // Show error toast if form is invalid
            toast({
                title: "Incomplete form",
                description: "Please fill in all required fields before submitting.",
                variant: "destructive",
            })
        }
    }

    const handleSubmitCheck = async () => {
        const isValid = await form.trigger()
        if (isValid) {
            const values = form.getValues()
            setFormData(values)
            setIsDialogOpen(true)
        } else {
            toast({
                title: "Incomplete form",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
        }
    }

    return (
        <CustomPage>
            <CustomPageHeader>
                <CustomPageTitleContainer>
                    <CustomPageTitle>Add Branch</CustomPageTitle>
                    {/* <CustomPageSubtitle>Manage and organize all your employees' data</CustomPageSubtitle> */}
                </CustomPageTitleContainer>
            </CustomPageHeader>
            <Card className="w-full pt-0">
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <Accordion
                                type="multiple"
                                className="w-full"
                                defaultValue={["branch", "location"]}
                            >

                                {/* Employment Details */}
                                <AccordionItem value="branch">
                                    <AccordionTrigger className="text-lg font-medium">Branch Information</AccordionTrigger>
                                    <AccordionContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                            {/* NIK */}
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Branch Name</FormLabel>
                                                        <FormControl className="w-full">
                                                            <Input placeholder="Enter branch name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Phone Number */}
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Address</FormLabel>
                                                        <FormControl className="w-full">
                                                            <Textarea placeholder="Enter address" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* First Name */}
                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>City</FormLabel>
                                                        <FormControl className="w-full">
                                                            <Input placeholder="Enter city" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Last Name */}
                                            <FormField
                                                control={form.control}
                                                name="country"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Country</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl className="w-full">
                                                                    <Button
                                                                        variant="outline"
                                                                        role="combobox"
                                                                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                                                    >
                                                                        {field.value
                                                                            ? countries.find((country) => country.value === field.value)?.label
                                                                            : "Select country"}
                                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0">
                                                                <Command className="w-full">
                                                                    <CommandInput placeholder="Search country..." />
                                                                    <CommandList>
                                                                        <CommandEmpty>No country found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {countries.map((country) => (
                                                                                <CommandItem
                                                                                    key={country.value}
                                                                                    value={country.value}
                                                                                    onSelect={() => {
                                                                                        form.setValue("country", country.value)
                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            country.value === field.value ? "opacity-100" : "opacity-0",
                                                                                        )}
                                                                                    />
                                                                                    {country.label}
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Last Name */}
                                            <FormField
                                                control={form.control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Status</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl className="w-full">
                                                                    <Button
                                                                        variant="outline"
                                                                        role="combobox"
                                                                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                                                    >
                                                                        {field.value
                                                                            ? statuses.find((status) => status.value === field.value)?.label
                                                                            : "Select status"}
                                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0">
                                                                <Command className="w-full">
                                                                    <CommandInput placeholder="Search status..." />
                                                                    <CommandList>
                                                                        <CommandEmpty>No status found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {statuses.map((status) => (
                                                                                <CommandItem
                                                                                    key={status.value}
                                                                                    value={status.value}
                                                                                    onSelect={() => {
                                                                                        form.setValue("status", status.value)
                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            status.value === field.value ? "opacity-100" : "opacity-0",
                                                                                        )}
                                                                                    />
                                                                                    {status.label}
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Location Information */}
                                <AccordionItem value="location">
                                    <AccordionTrigger className="text-lg font-medium">Location Information</AccordionTrigger>
                                    <AccordionContent className="space-y-4">
                                        <MapSearchComponent onLocationSelect={handleLocationSelect} />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                            {/* Bank */}
                                            <FormField
                                                control={form.control}
                                                name="latitude"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Latitude</FormLabel>
                                                        <FormControl className="w-full">
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
                                                        <FormControl className="w-full">
                                                            <Input placeholder="Please select a location" readOnly {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" type="button" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button type="button" disabled={isSubmitting} onClick={handleSubmitCheck}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Branch
                                </Button>
                                {/* <Button type="submit" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Employee
                            </Button> */}

                            </div>
                        </form>
                    </Form>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">Add Branch</DialogTitle>
                                <DialogDescription>
                                    Please review the details below before adding the branch. Click Confirm to proceed or Cancel to edit.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh] pr-4">
                                <DetailGroup title="Branch Information">
                                    <DetailContainer>
                                        <DetailItem label="Branch Name" layout={"column"} >
                                            <div className="font-medium text-black">{form.getValues("name")}</div>
                                        </DetailItem>
                                    </DetailContainer>
                                    <DetailContainer>
                                        <DetailItem label="Address" layout={"column"} >
                                            <div className="font-medium text-black">{form.getValues("address")}</div>
                                        </DetailItem>
                                    </DetailContainer>
                                    <DetailContainer>
                                        <DetailItem label="City" layout={"column"} >
                                            <div className="font-medium text-black">{form.getValues("city")}</div>
                                        </DetailItem>
                                    </DetailContainer>
                                    <DetailContainer>
                                        <DetailItem label="Country" layout={"column"} >
                                            <div className="font-medium text-black">{form.getValues("country")}</div>
                                        </DetailItem>
                                    </DetailContainer>
                                    <DetailContainer>
                                        <DetailItem label="Status" layout={"column"} >
                                            <div className="font-medium text-black">{form.getValues("status")}</div>
                                        </DetailItem>
                                    </DetailContainer>
                                </DetailGroup>
                                <DetailGroup title="Location Information">
                                    <DetailContainer>
                                        <DetailItem label="Latitude" layout={"column"} >
                                            <div className="font-medium text-black">{form.getValues("latitude")}</div>
                                        </DetailItem>
                                    </DetailContainer>
                                    <DetailContainer>
                                        <DetailItem label="Longitude" layout={"column"} >
                                            <div className="font-medium text-black">{form.getValues("longitude")}</div>
                                        </DetailItem>
                                    </DetailContainer>
                                </DetailGroup>
                            </ScrollArea>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirm} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Confirm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </CustomPage>

    )
}