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
import axios from "axios";
import { addCheckClockSetting } from "@/services/checkClockService";

const types = [
  { label: "WFO", value: "wfo" },
  { label: "WFA", value: "wfa" },
  { label: "Off-day", value: "off-day" },
];

const typeMap: Record<string, number> = {
  wfo: 1,
  wfa: 2,
  "off-day": 3,
} as const;


const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

// type Day = typeof days[number];
type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type WorkType = keyof typeof typeMap;

interface DayData {
  type: "wfo" | "wfa" | "off-day";
  startTime: Date;
  endTime: Date;
  breakStart: Date;
  breakEnd: Date;
  breakDuration: number;
  lateTolerance: number;
}

// interface FormValues {
//   name: string;
//   type: WorkType; 
//   monday: DayData;
//   tuesday: DayData;
//   wednesday: DayData;
//   thursday: DayData;
//   friday: DayData;
//   saturday: DayData;
//   sunday: DayData;
// }


const typeLabelMap = {
  wfo: "WFO",
  wfa: "WFA",
  "off-day": "Off-day",
} as const;

const dayDataSchema = z.object({
  type: z.enum(["wfo", "wfa", "off-day"]),
  startTime: z.date(),
  endTime: z.date(),
  breakStart: z.date(),
  breakEnd: z.date(),
  breakDuration: z.number(),
  lateTolerance: z.number(),
});

const dailySettingSchema = z.object({
  type: z.enum(["wfo", "wfa", "off-day"]),
  startTime: z.date(),
  endTime: z.date(),
  breakStart: z.date(),
  breakEnd: z.date(),
  breakDuration: z.number().min(0),
  lateTolerance: z.number().min(0),
});

const formSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["wfo", "wfa", "off-day"]),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "wfo",
      monday: baseDayDefault(),
      tuesday: baseDayDefault(),
      wednesday: baseDayDefault(),
      thursday: baseDayDefault(),
      friday: baseDayDefault(),
      saturday: baseDayOffDefault(),
      sunday: baseDayOffDefault(),
    },
  });

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setIsDialogOpen(false);
    try {
      const values = form.getValues();
      // const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

      // type DayKey = Exclude<keyof FormValues, "name">;
      type DayKeys = typeof days[number];
      const days = [
        'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      ] as const;

      const payload = {
        name: values.name,
        // type: "wfo",
        // type: values.type === "wfo" ? 1 : 2,
        type: typeMap[values.type],
        days: days.map((day) => {
          // const data = values[day as keyof FormValues];
          console.log("Type:", values.type); // Harusnya "wfo", "wfa", atau "off-day"
          console.log("Mapped Type:", typeMap[values.type]); // Harusnya 1, 2, atau 3

          const data = values[day as DayKeys];
          const isOff = data.type === 'off-day';
          const dummyEnd = '23:59';
          return {
            day,
            // clock_in: data.type === "off-day" ? "00:00" : format(data.startTime, "HH:mm"),
            // clock_out: data.type === "off-day" ? "00:00" : format(data.endTime, "HH:mm"),
            // break_start: data.type === "off-day" ? "00:00" : format(data.breakStart, "HH:mm"),
            // break_end: data.type === "off-day" ? "00:00" : format(data.breakEnd, "HH:mm"),
            // late_tolerance: data.lateTolerance,
            clock_in: isOff ? '00:00' : format(data.startTime, 'HH:mm'),
            clock_out: isOff ? dummyEnd : format(data.endTime, 'HH:mm'),
            break_start: isOff ? '00:00' : format(data.breakStart, 'HH:mm'),
            break_end: isOff ? dummyEnd : format(data.breakEnd, 'HH:mm'),
            late_tolerance: data.lateTolerance,
          };
        }),
      };

      await addCheckClockSetting(payload)

      // const res = await axios.post("http://localhost:8000/api/add/check-clock-settings", {
      //   method: "POST",
      //   credentials: 'include',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Accept: "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(payload),
      // });

      // if (!res.ok) throw new Error("Failed to add check clock");

      toast({ title: "Check clock added successfully" });
      router.push("/dashboard/check-clock");
    } catch (err) {
      toast({ title: "Error", description: "Failed to submit data", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDailySettings = (day: Day, label: string) => (
    <AccordionItem value={day}>
      <AccordionTrigger>{label}</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name={`${day}.type`} render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Work Type</FormLabel>
              {/* <Select onValueChange={field.onChange} defaultValue={field.value as string}> */}
              <Select value={field.value as string} onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {types.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormItem>
          )} />

          {(["startTime", "endTime", "breakStart", "breakEnd"] as const).map((timeField) => (
            <FormField key={timeField} control={form.control} name={`${day}.${timeField}`} render={({ field }) => (
              <FormItem>
                <FormLabel>{toTitleCase(timeField.replace("Time", " Time"))}</FormLabel>
                <FormControl>
                  <TimePickerDemo
                    date={field.value}
                    setDate={(newDate) => {
                      if (newDate) {
                        const updated = new Date(0, 0, 0, newDate.getHours(), newDate.getMinutes());
                        field.onChange(updated);
                      } else {
                        field.onChange(null);
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )} />
          ))}

          <FormField control={form.control} name={`${day}.breakDuration`} render={({ field }) => (
            <FormItem><FormLabel>Break Duration (minutes)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name={`${day}.lateTolerance`} render={({ field }) => (
            <FormItem><FormLabel>Late Tolerance (minutes)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
            </FormItem>
          )} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Add Check Clock</CustomPageTitle>
        </CustomPageTitleContainer>
      </CustomPageHeader>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => setIsDialogOpen(true))} className="space-y-6">
              <Accordion type="multiple" defaultValue={["monday"]}>
                <AccordionItem value="name">
                  <AccordionTrigger>Settings</AccordionTrigger>
                  <AccordionContent>
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Enter name"{...field} /></FormControl></FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>
                {renderDailySettings("monday", "Monday")}
                {renderDailySettings("tuesday", "Tuesday")}
                {renderDailySettings("wednesday", "Wednesday")}
                {renderDailySettings("thursday", "Thursday")}
                {renderDailySettings("friday", "Friday")}
                {renderDailySettings("saturday", "Saturday")}
                {renderDailySettings("sunday", "Sunday")}
              </Accordion>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" onClick={handleConfirm} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CustomPage>
  );
}

// function baseDayDefault() {
//   return {
//     type: "wfo",
//     startTime: new Date(0, 0, 0, 8, 0),
//     endTime: new Date(0, 0, 0, 17, 0),
//     breakStart: new Date(0, 0, 0, 12, 0),
//     breakEnd: new Date(0, 0, 0, 13, 0),
//     breakDuration: 60,
//     lateTolerance: 10,
//   };
// }

function baseDayOffDefault() {
  return {
    type: "off-day",
    startTime: new Date(0, 0, 0, 0, 0),
    endTime: new Date(0, 0, 0, 0, 0),
    breakStart: new Date(0, 0, 0, 0, 0),
    breakEnd: new Date(0, 0, 0, 0, 0),
    breakDuration: 0,
    lateTolerance: 0,
  } as const;
}
function baseDayDefault() {
  return {
    type: "wfo",
    startTime: new Date(0, 0, 0, 8, 0),
    endTime: new Date(0, 0, 0, 17, 0),
    breakStart: new Date(0, 0, 0, 12, 0),
    breakEnd: new Date(0, 0, 0, 13, 0),
    breakDuration: 60,
    lateTolerance: 10,
  } as const;
}

