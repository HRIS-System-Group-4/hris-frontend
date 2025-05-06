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
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Label } from "@radix-ui/react-label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleContainer } from "@/components/ui/custom-page"

// Sample data for dropdowns
const branches = [
    { label: "Jakarta HQ", value: "jakarta-hq" },
    { label: "Surabaya Branch", value: "surabaya" },
    { label: "Bandung Branch", value: "bandung" },
    { label: "Bali Branch", value: "bali" },
]

const jobTitles = [
    { label: "Software Engineer", value: "software-engineer" },
    { label: "Product Manager", value: "product-manager" },
    { label: "UX Designer", value: "ux-designer" },
    { label: "HR Manager", value: "hr-manager" },
    { label: "Finance Specialist", value: "finance-specialist" },
]

const grades = [
    { label: "Junior (G1)", value: "g1" },
    { label: "Mid-level (G2)", value: "g2" },
    { label: "Senior (G3)", value: "g3" },
    { label: "Lead (G4)", value: "g4" },
    { label: "Manager (G5)", value: "g5" },
]

const contractTypes = [
    { label: "Permanent", value: "permanent" },
    { label: "Contract", value: "contract" },
    { label: "Probation", value: "probation" },
    { label: "Internship", value: "internship" },
]

const spTypes = [
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
]

const banks = [
    { label: "Bank Central Asia (BCA)", value: "bca" },
    { label: "Bank Mandiri", value: "mandiri" },
    { label: "Bank Rakyat Indonesia (BRI)", value: "bri" },
    { label: "Bank Negara Indonesia (BNI)", value: "bni" },
    { label: "CIMB Niaga", value: "cimb" },
]

// Form schema using zod
const formSchema = z.object({
    // Personal Information
    avatar: z.any().optional(),
    nik: z.string().min(16, "NIK must be at least 16 characters").max(16, "NIK must be exactly 16 characters"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    gender: z.enum(["male", "female"]),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
    birthPlace: z.string().min(2, "Birth place must be at least 2 characters"),
    birthDate: z.date({
        required_error: "Birth date is required",
    }),

    // Employment Details
    branch: z.string({
        required_error: "Please select a branch",
    }),
    jobTitle: z.string({
        required_error: "Please select a job title",
    }),
    grade: z.string({
        required_error: "Please select a grade",
    }),
    contractType: z.string({
        required_error: "Please select a contract type",
    }),
    spType: z.string({
        required_error: "Please select an SP type",
    }),

    // Banking Information
    bank: z.string({
        required_error: "Please select a bank",
    }),
    accountNumber: z.string().min(10, "Account number must be at least 10 characters"),
    accountHolderName: z.string().min(2, "Account holder name must be at least 2 characters"),

    // Check Clock
    checkClockSetting: z.string().optional(),

    // Letters
    letters: z
        .array(
            z.object({
                name: z.string().min(1, "Letter name is required"),
                file: z.any().optional(),
            }),
        )
        .optional()
        .default([]),
})

type FormValues = z.infer<typeof formSchema>

export default function EditEmployee() {
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
            nik: "1234567890123456",
            firstName: "John",
            lastName: "Doe",
            gender: "male",
            phoneNumber: "08123456789",
            birthPlace: "",
            birthDate: undefined,
            branch: "",
            jobTitle: "",
            grade: "",
            contractType: "",
            spType: "",
            bank: "",
            accountNumber: "",
            accountHolderName: "",
            checkClockSetting: undefined,
            letters: [],
        },
    })

    // Initialize useFieldArray for letters
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "letters",
    })

    // Handle avatar upload
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif']
            if (!validTypes.includes(file.type)) {
                toast({
                    title: "Invalid file type",
                    description: "Please upload a JPEG, PNG, or GIF image.",
                    variant: "destructive",
                })
                return
            }
            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024 // 5MB
            if (file.size > maxSize) {
                toast({
                    title: "File too large",
                    description: "Please upload an image smaller than 5MB.",
                    variant: "destructive",
                })
                return
            }
            form.setValue("avatar", file)
            const reader = new FileReader()
            reader.onload = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Form submission
    const handleConfirm = async () => {
        if (!form) return
        setIsSubmitting(true)
        setIsDialogOpen(false)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))
            console.log("Form data:", form)

            toast({
                title: "Employee added successfully",
                description: `${form.getValues("firstName")} ${form.getValues("lastName")} has been added to the system.`,
            })

            // Navigate to employee list or detail page
            router.push("/dashboard/employee")
        } catch (error) {
            toast({
                title: "Error adding employee",
                description: "There was an error adding the employee. Please try again.",
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
                    <CustomPageTitle>Edit Employee</CustomPageTitle>
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
                                defaultValue={["personal", "employment", "checkclock", "banking", "letters"]}
                            >
                                {/* Personal Information */}
                                <AccordionItem value="personal">
                                    <AccordionTrigger className="text-lg font-medium">Personal Information</AccordionTrigger>
                                    <AccordionContent className="space-y-4">
                                        {/* Avatar Upload */}
                                        <FormItem>
                                            <FormLabel>Avatar</FormLabel>
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted mb-2">
                                                    {avatarPreview ? (
                                                        <img
                                                            src={avatarPreview || "/placeholder.svg"}
                                                            alt="Avatar preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full w-full bg-muted">
                                                            <Upload className="h-8 w-8 text-muted-foreground/60" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    <label htmlFor="avatar-upload" className="cursor-pointer">
                                                        <Button type="button" variant="outline" size="sm" className="gap-1" asChild>
                                                            <Label htmlFor="avatar-upload" className="cursor-pointer">
                                                                <Upload className="h-4 w-4" />
                                                                Upload Photo
                                                            </Label>
                                                        </Button>
                                                        <input
                                                            id="avatar-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="sr-only"
                                                            onChange={handleAvatarChange}
                                                        />
                                                    </label>
                                                    {avatarPreview && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                setAvatarPreview(null)
                                                                form.setValue("avatar", undefined)
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Remove</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </FormItem>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                            {/* NIK */}
                                            <FormField
                                                control={form.control}
                                                name="nik"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>NIK (National ID)</FormLabel>
                                                        <FormControl className="w-full" aria-disabled>
                                                            <Input placeholder="Enter 16-digit NIK" {...field} disabled/>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Phone Number */}
                                            <FormField
                                                control={form.control}
                                                name="phoneNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl className="w-full">
                                                            <Input placeholder="Enter phone number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* First Name */}
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>First Name</FormLabel>
                                                        <FormControl className="w-full">
                                                            <Input placeholder="Enter first name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Last Name */}
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Last Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter last name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Gender */}
                                            <FormField
                                                control={form.control}
                                                name="gender"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel>Gender</FormLabel>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                className="flex space-x-4"
                                                            >
                                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value="male" />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal cursor-pointer">Male</FormLabel>
                                                                </FormItem>
                                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value="female" />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal cursor-pointer">Female</FormLabel>
                                                                </FormItem>
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Birth Place */}
                                            <FormField
                                                control={form.control}
                                                name="birthPlace"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Birth Place</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter birth place" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Birth Date */}
                                            <FormField
                                                control={form.control}
                                                name="birthDate"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Birth Date</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-full pl-3 text-left font-normal",
                                                                            !field.value && "text-muted-foreground",
                                                                        )}
                                                                    >
                                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={field.onChange}
                                                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Employment Details */}
                                <AccordionItem value="employment">
                                    <AccordionTrigger className="text-lg font-medium">Employment Details</AccordionTrigger>
                                    <AccordionContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                            {/* Branch */}
                                            <FormField
                                                control={form.control}
                                                name="branch"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Branch</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl className="w-full">
                                                                    <Button
                                                                        variant="outline"
                                                                        role="combobox"
                                                                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                                                    >
                                                                        {field.value
                                                                            ? branches.find((branch) => branch.value === field.value)?.label
                                                                            : "Select branch"}
                                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0">
                                                                <Command className="w-full">
                                                                    <CommandInput placeholder="Search branch..." />
                                                                    <CommandList>
                                                                        <CommandEmpty>No branch found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {branches.map((branch) => (
                                                                                <CommandItem
                                                                                    key={branch.value}
                                                                                    value={branch.value}
                                                                                    onSelect={() => {
                                                                                        form.setValue("branch", branch.value)
                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            branch.value === field.value ? "opacity-100" : "opacity-0",
                                                                                        )}
                                                                                    />
                                                                                    {branch.label}
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

                                            {/* Job Title */}
                                            <FormField
                                                control={form.control}
                                                name="jobTitle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Job Title</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                            <FormControl className="w-full">
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select job title" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {jobTitles.map((job) => (
                                                                    <SelectItem key={job.value} value={job.value}>
                                                                        {job.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Grade */}
                                            <FormField
                                                control={form.control}
                                                name="grade"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Grade</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl className="w-full">
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select grade" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {grades.map((grade) => (
                                                                    <SelectItem key={grade.value} value={grade.value}>
                                                                        {grade.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Contract Type */}
                                            <FormField
                                                control={form.control}
                                                name="contractType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Contract Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl className="w-full">
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select contract type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {contractTypes.map((contract) => (
                                                                    <SelectItem key={contract.value} value={contract.value}>
                                                                        {contract.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* SP Type */}
                                            <FormField
                                                control={form.control}
                                                name="spType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>SP Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl className="w-full">
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select SP type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {spTypes.map((sp) => (
                                                                    <SelectItem key={sp.value} value={sp.value}>
                                                                        {sp.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Banking Information */}
                                <AccordionItem value="banking">
                                    <AccordionTrigger className="text-lg font-medium">Banking Information</AccordionTrigger>
                                    <AccordionContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                            {/* Bank */}
                                            <FormField
                                                control={form.control}
                                                name="bank"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Bank</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl className="w-full">
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select bank" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {banks.map((bank) => (
                                                                    <SelectItem key={bank.value} value={bank.value}>
                                                                        {bank.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Account Number */}
                                            <FormField
                                                control={form.control}
                                                name="accountNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Bank Account Number</FormLabel>
                                                        <FormControl className="w-full">
                                                            <Input placeholder="Enter account number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Account Holder Name */}
                                            <FormField
                                                control={form.control}
                                                name="accountHolderName"
                                                render={({ field }) => (
                                                    <FormItem className="md:col-span-2">
                                                        <FormLabel>Account Holder Name</FormLabel>
                                                        <FormControl className="w-full">
                                                            <Input placeholder="Enter account holder name" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Enter the name exactly as it appears on the bank account</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Check Clock */}
                                <AccordionItem value="checkclock">
                                    <AccordionTrigger className="text-lg font-medium">Check Clock</AccordionTrigger>
                                    <AccordionContent className="pt-4 pb-2">
                                        <FormField
                                            control={form.control}
                                            name="checkClockSetting"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Check Clock Setting</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl className="w-full">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select check clock setting" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="standard">Standard (09:00 - 17:00)</SelectItem>
                                                            <SelectItem value="flexible">Flexible Hours</SelectItem>
                                                            <SelectItem value="shift">Shift Based</SelectItem>
                                                            <SelectItem value="remote">Remote Work</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>Configure how this employee's attendance will be tracked</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Letters */}
                                <AccordionItem value="letters">
                                    <AccordionTrigger className="text-lg font-medium">Letters</AccordionTrigger>
                                    <AccordionContent className="space-y-4">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex items-start gap-4 border rounded-md p-4">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Letter Name */}
                                                    <FormField
                                                        control={form.control}
                                                        name={`letters.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Letter Name</FormLabel>
                                                                <FormControl className="w-full">
                                                                    <Input placeholder="Enter letter name" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    {/* Letter File */}
                                                    <div className="flex items-end gap-2">
                                                        <div className="flex-1">
                                                            <FormLabel>File</FormLabel>
                                                            <div className="flex items-center mt-2">
                                                                <label htmlFor={`letter-file-${field.id}`} className="cursor-pointer flex-1">
                                                                    <Button type="button" variant="outline" className="w-full gap-2">
                                                                        <Upload className="h-4 w-4" />
                                                                        {form.watch(`letters.${index}.file`)?.name || "Upload File"}
                                                                    </Button>
                                                                    <span className="sr-only">Upload letter file</span>
                                                                    <input
                                                                        id={`letter-file-${field.id}`}
                                                                        type="file"
                                                                        accept=".pdf,.doc,.docx"
                                                                        className="sr-only"
                                                                        aria-label="Upload letter file"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0]
                                                                            if (file) {
                                                                                // Validate file type
                                                                                const validTypes = [
                                                                                    'application/pdf',
                                                                                    'application/msword',
                                                                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                                                                ]
                                                                                if (!validTypes.includes(file.type)) {
                                                                                    toast({
                                                                                        title: "Invalid file type",
                                                                                        description: "Please upload a PDF, DOC, or DOCX file.",
                                                                                        variant: "destructive",
                                                                                    })
                                                                                    return
                                                                                }
                                                                                // Validate file size (max 5MB)
                                                                                const maxSize = 5 * 1024 * 1024 // 5MB
                                                                                if (file.size > maxSize) {
                                                                                    toast({
                                                                                        title: "File too large",
                                                                                        description: "Please upload a file smaller than 5MB.",
                                                                                        variant: "destructive",
                                                                                    })
                                                                                    return
                                                                                }
                                                                                form.setValue(`letters.${index}.file`, file)
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-[hsl(var(--destructive))]"
                                                            onClick={() => remove(index)}
                                                            aria-label="Remove letter"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Remove</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="gap-1"
                                            onClick={() => append({ name: "", file: undefined })}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Letter
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" type="button" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button type="button" disabled={isSubmitting} onClick={handleSubmitCheck}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save
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
                                <DialogTitle className="text-lg font-semibold">Add Employee</DialogTitle>
                                <DialogDescription>
                                    Please review the details below before adding the employee. Click Confirm to proceed or Cancel to edit.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh] pr-4">
                                <div className="space-y-4 py-4">
                                    {formData && (
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">Personal Information</h3>
                                            {formData.avatar && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Avatar:</span>
                                                    <img
                                                        src={avatarPreview || ""}
                                                        alt="Avatar preview"
                                                        className="h-12 w-12 rounded-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <p><span className="font-medium">NIK:</span> {formData.nik}</p>
                                            <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                                            <p><span className="font-medium">Gender:</span> {formData.gender}</p>
                                            <p><span className="font-medium">Phone Number:</span> {formData.phoneNumber}</p>
                                            <p><span className="font-medium">Birth Place:</span> {formData.birthPlace}</p>
                                            <p><span className="font-medium">Birth Date:</span> {formData.birthDate ? format(formData.birthDate, "PPP") : "N/A"}</p>

                                            <h3 className="text-lg font-semibold mt-4">Employment Details</h3>
                                            <p><span className="font-medium">Branch:</span> {branches.find(b => b.value === formData.branch)?.label || formData.branch}</p>
                                            <p><span className="font-medium">Job Title:</span> {jobTitles.find(j => j.value === formData.jobTitle)?.label || formData.jobTitle}</p>
                                            <p><span className="font-medium">Grade:</span> {grades.find(g => g.value === formData.grade)?.label || formData.grade}</p>
                                            <p><span className="font-medium">Contract Type:</span> {contractTypes.find(c => c.value === formData.contractType)?.label || formData.contractType}</p>
                                            <p><span className="font-medium">SP Type:</span> {spTypes.find(s => s.value === formData.spType)?.label || formData.spType}</p>

                                            <h3 className="text-lg font-semibold mt-4">Banking Information</h3>
                                            <p><span className="font-medium">Bank:</span> {banks.find(b => b.value === formData.bank)?.label || formData.bank}</p>
                                            <p><span className="font-medium">Account Number:</span> {formData.accountNumber}</p>
                                            <p><span className="font-medium">Account Holder Name:</span> {formData.accountHolderName}</p>

                                            <h3 className="text-lg font-semibold mt-4">Check Clock</h3>
                                            <p><span className="font-medium">Setting:</span> {formData.checkClockSetting || "N/A"}</p>

                                            <h3 className="text-lg font-semibold mt-4">Letters</h3>
                                            {formData.letters.length > 0 ? (
                                                <ul className="list-disc pl-5">
                                                    {formData.letters.map((letter, index) => (
                                                        <li key={index}>
                                                            {letter.name} {letter.file ? `(File: ${letter.file.name})` : "(No file)"}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No letters added.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
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