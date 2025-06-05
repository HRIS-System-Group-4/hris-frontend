"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { loginAdmin, loginEmployee } from "@/services/authService";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

// Schema untuk Admin
const formAdminSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

// Schema untuk Employee
const formEmployeeSchema = z.object({
  company: z
    .string({ required_error: "Company username is required" })
    .min(1, "Company username is required"),
  employeeId: z
    .string({ required_error: "Employee ID is required" })
    .min(1, "Employee ID is required"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

// Union type untuk form data
type AdminFormValues = z.infer<typeof formAdminSchema>;
type EmployeeFormValues = z.infer<typeof formEmployeeSchema>;
type FormData = AdminFormValues | EmployeeFormValues;

export function LoginTabs({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<"admin" | "employee">("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inisialisasi form dengan schema berdasarkan tab aktif
  const form = useForm<FormData>({
    resolver: zodResolver(activeTab === "admin" ? formAdminSchema as any : formEmployeeSchema as any),
    defaultValues:
      activeTab === "admin"
        ? { email: "", password: "" }
        : { company: "", employeeId: "", password: "" },
  });

  // Reset form saat tab berubah
  const handleTabChange = (value: string) => {
    setActiveTab(value as "admin" | "employee");
    setErrorMessage(null);
    form.reset(
      value === "admin"
        ? { email: "", password: "" }
        : { company: "", employeeId: "", password: "" }
    );
  };

  // Handle submit untuk kedua form
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      let res;
      if (activeTab === "admin") {
        const { email, password } = data as AdminFormValues;
        res = await loginAdmin(email, password);
      } else {
        const { company, employeeId, password } = data as EmployeeFormValues;
        res = await loginEmployee(company, employeeId, password);
      }

      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        router.push("/dashboard");
      } else {
        console.error("Token gagal disimpan");
        form.setError("root", { message: "Login failed. Please try again." });
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      const status = err.response?.status;
      let errorMsg = "An error occurred during login.";

      if (status === 422 || status === 404 || status === 444) {
        // Validasi gagal
        errorMsg =
          activeTab === "admin"
            ? "Incorrect email or password."
            : "Incorrect company or employee ID or password.";
      } else {
        // Error lainnya
        errorMsg = errorData?.message || errorMsg;
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn("w-full max-w-md", className)}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="admin">Admin</TabsTrigger>
        <TabsTrigger value="employee">Employee</TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold leading-4">Login to your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your details below to login to your account
            </p>
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6">
            {activeTab === "admin" ? (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          // type="email"
                          placeholder="example@mail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input id="password" type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Username</FormLabel>
                      <FormControl>
                        <Input id="company" type="text" placeholder="hris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input
                          id="employee_id"
                          type="text"
                          placeholder="EMP01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input id="password" type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>

            {form.formState.errors.root && (
              <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Login
            </Button>
          </div>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </form>
      </Form>
    </Tabs>
  );
}