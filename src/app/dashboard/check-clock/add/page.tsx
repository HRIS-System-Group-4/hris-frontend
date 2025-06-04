"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CustomPage, CustomPageHeader, CustomPageTitle, CustomPageTitleContainer } from "@/components/ui/custom-page";
import { TimePickerDemo } from "@/components/time-picker-demo";
import { format } from "date-fns/format";
import { DetailContainer, DetailGroup, DetailItem } from "@/components/ui/custom-detail";
import { toTitleCase } from "@/lib/strings";

// Work type options
const types = [
  { label: "WFO", value: "wfo" },
  { label: "WFA", value: "wfa" },
  { label: "Off-day", value: "off-day" },
] as const;

const typeLabelMap = {
  wfo: "WFO",
  wfa: "WFA",
  "off-day": "Off-day",
} as const;

// Define the days array with proper typing
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
type DayKey = typeof DAYS[number];

// Schema for daily settings
const dailySettingSchema = z.object({
  type: z.enum(["wfo", "wfa", "off-day"]),
  startTime: z.date(),
  endTime: z.date(),
  breakDuration: z.number().min(0, "Break duration cannot be negative"),
  lateTolerance: z.number().min(0, "Late tolerance cannot be negative"),
}).superRefine((data, ctx) => {
  if (data.type !== "off-day") {
    if (!data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time is required for WFO or WFA",
      });
    }
    if (!data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time is required for WFO or WFA",
      });
    }
  }
});

// Form schema
const formSchema = z.object({
  name: z.string().min(2, "Check clock name must be at least 2 characters"),
  monday: dailySettingSchema,
  tuesday: dailySettingSchema,
  wednesday: dailySettingSchema,
  thursday: dailySettingSchema,
  friday: dailySettingSchema,
  saturday: dailySettingSchema,
  sunday: dailySettingSchema,
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCheckClockPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      monday: { type: "wfo", startTime: new Date(0, 0, 0, 8, 0), endTime: new Date(0, 0, 0, 17, 0), breakDuration: 60, lateTolerance: 10 },
      tuesday: { type: "wfo", startTime: new Date(0, 0, 0, 8, 0), endTime: new Date(0, 0, 0, 17, 0), breakDuration: 60, lateTolerance: 10 },
      wednesday: { type: "wfo", startTime: new Date(0, 0, 0, 8, 0), endTime: new Date(0, 0, 0, 17, 0), breakDuration: 60, lateTolerance: 10 },
      thursday: { type: "wfo", startTime: new Date(0, 0, 0, 8, 0), endTime: new Date(0, 0, 0, 17, 0), breakDuration: 60, lateTolerance: 10 },
      friday: { type: "wfo", startTime: new Date(0, 0, 0, 8, 0), endTime: new Date(0, 0, 0, 17, 0), breakDuration: 60, lateTolerance: 10 },
      saturday: { type: "off-day", startTime: new Date(0, 0, 0, 0, 0), endTime: new Date(0, 0, 0, 0, 0), breakDuration: 60, lateTolerance: 10 },
      sunday: { type: "off-day", startTime: new Date(0, 0, 0, 0, 0), endTime: new Date(0, 0, 0, 0, 0), breakDuration: 60, lateTolerance: 10 },
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    console.log("onSubmit data:", data);
    if (form.formState.isValid) {
      setIsDialogOpen(true);
    } else {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setIsDialogOpen(false);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Check clock added successfully",
        description: `has been added to the system.`,
      });

      router.push("/dashboard/check-clock");
    } catch (error) {
      toast({
        title: "Error adding check clock",
        description: "There was an error adding the check clock. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCheck = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setIsDialogOpen(true);
    } else {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  // Type guard to check if a key is a day key
  const isDayKey = (key: string): key is DayKey => {
    return DAYS.includes(key as DayKey);
  };

  // Render daily settings for a given day
  const renderDailySettings = (day: DayKey, label: string) => {
    return (
      <AccordionItem value={day} key={day}>
        <AccordionTrigger className="text-lg font-medium">{label}</AccordionTrigger>
        <AccordionContent className={cn("space-y-4 animate-fade-slide")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name={`${day}.type`}
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Work Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${day}.startTime`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <TimePickerDemo
                      date={field.value}
                      setDate={(newDate: Date | undefined) => {
                        if (newDate) {
                          const currentDate = field.value || new Date();
                          const updatedDate = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            currentDate.getDate(),
                            newDate.getHours(),
                            newDate.getMinutes(),
                            newDate.getSeconds()
                          );
                          field.onChange(updatedDate);
                        } else {
                          field.onChange(null);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${day}.endTime`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <TimePickerDemo
                      date={field.value}
                      setDate={(newDate: Date | undefined) => {
                        if (newDate) {
                          const currentDate = field.value || new Date();
                          const updatedDate = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            currentDate.getDate(),
                            newDate.getHours(),
                            newDate.getMinutes(),
                            newDate.getSeconds()
                          );
                          field.onChange(updatedDate);
                        } else {
                          field.onChange(null);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${day}.breakDuration`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Break Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${day}.lateTolerance`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Late Tolerance (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Add Check Clock</CustomPageTitle>
        </CustomPageTitleContainer>
      </CustomPageHeader>
      <Card className="w-full pt-0">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Accordion
                type="multiple"
                className="w-full"
                defaultValue={["checkClockSetting", "monday", "tuesday", "wednesday", "thursday", "friday"]}
              >
                {/* Check Clock Settings */}
                <AccordionItem value="checkClockSetting">
                  <AccordionTrigger className="text-lg font-medium">Check Clock Settings</AccordionTrigger>
                  <AccordionContent className={cn("space-y-4 animate-fade-slide")}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check Clock Name</FormLabel>
                            <FormControl className="w-full">
                              <Input placeholder="Enter Check Clock Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Daily Settings */}
                {DAYS.map((day) => renderDailySettings(day, toTitleCase(day)))}
              </Accordion>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="button" disabled={isSubmitting} onClick={handleSubmitCheck}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Check Clock
                </Button>
              </div>
            </form>
          </Form>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className={cn(isDialogOpen && "animate-fade-slide")}>
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Add Check Clock</DialogTitle>
                <DialogDescription>
                  Please review the details below before adding the check clock. Click Confirm to proceed or Cancel to edit.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4">
                <DetailGroup title="Check Clock Setting">
                  <DetailContainer>
                    <DetailItem label="Check Clock Name" layout={"column"} >
                      <div className="font-medium text-black">{form.getValues("name")}</div>
                    </DetailItem>
                  </DetailContainer>
                </DetailGroup>
                {DAYS.map((day) => (
                  <DetailGroup key={day} title={toTitleCase(day)} className="pt-4">
                    <DetailContainer>
                      <DetailItem label="Work Type" layout={"column"} >
                        <div className="font-medium text-black">
                          {typeLabelMap[form.getValues(`${day}.type`) as keyof typeof typeLabelMap]}
                        </div>
                      </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                      <DetailItem label="Start Time" layout={"column"} >
                        <div className="font-medium text-black">
                          {form.getValues(`${day}.startTime`) ? format(form.getValues(`${day}.startTime`), "HH:mm") : "N/A"}
                        </div>
                      </DetailItem>
                      <DetailItem label="End Time" layout={"column"} >
                        <div className="font-medium text-black">
                          {form.getValues(`${day}.endTime`) ? format(form.getValues(`${day}.endTime`), "HH:mm") : "N/A"}
                        </div>
                      </DetailItem>
                    </DetailContainer>
                    <DetailContainer>
                      <DetailItem label="Break Duration" layout={"column"} >
                        <div className="font-medium text-black">{form.getValues(`${day}.breakDuration`)} minutes</div>
                      </DetailItem>
                      <DetailItem label="Late Tolerance" layout={"column"} >
                        <div className="font-medium text-black">{form.getValues(`${day}.lateTolerance`)} minutes</div>
                      </DetailItem>
                    </DetailContainer>
                  </DetailGroup>
                ))}
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
  );
}