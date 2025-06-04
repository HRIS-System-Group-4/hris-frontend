"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { companySchema, CompanyFormData } from "@/schemas/company-schema"

interface CompanyFormProps {
    onSubmit: (data: CompanyFormData) => void
    onBack?: () => void
    defaultValues?: Partial<CompanyFormData>
    isLoading?: boolean
}

export function CompanyForm({ onSubmit, onBack, defaultValues, isLoading }: CompanyFormProps) {
    const form = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            companyName: "",
            companyUsername: "",
            ...defaultValues,
        },
    })

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. PT Maju Sejahtera" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="companyUsername"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Username</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. majusejahtera" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:flex md:w-full gap-6">
                        {onBack && (
                            <Button type="button" variant="outline" onClick={onBack}>
                                Back
                            </Button>
                        )}
                        <Button type="submit" disabled={isLoading} className="flex flex-1">
                            {isLoading ? "Saving..." : "Continue"}
                        </Button>
                </div>
            </form>
        </Form>
    )
}
