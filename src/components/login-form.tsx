"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, loginEmployee } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LoginTabs({ className }: { className?: string }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // Handle login for Admin
  const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();  // Mencegah halaman reload saat form disubmit
  
    const email = (document.querySelector("#email") as HTMLInputElement).value;
    const password = (document.querySelector("#password") as HTMLInputElement).value;
  
    try {
      const res = await loginAdmin(email, password);  // Memanggil API login
      console.log(res); // Pastikan respons yang Anda terima
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);  // Menyimpan token ke localStorage
        router.push("/dashboard");  // Navigasi ke dashboard setelah login
      }
    } catch (err: any) {
      console.error(err.message);
      alert(err.message); // Tampilkan pesan error jika login gagal
    }
  };  
  
  
  

  // Handle login for Employee
  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await loginEmployee(company, employeeId, password);
      localStorage.setItem("token", res.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="admin" className={cn("w-full max-w-md", className)}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="admin">Admin</TabsTrigger>
        <TabsTrigger value="employee">Employee</TabsTrigger>
      </TabsList>

      {/* Admin Login Form */}
      <TabsContent value="admin">
        <form onSubmit={handleAdminLogin} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email or Phone Number</Label>
              <Input
                id="email"
                type="text"
                placeholder="example@mail.com or 0821312433"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </div>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </form>
      </TabsContent>

      {/* Employee Login Form */}
      <TabsContent value="employee">
        <form onSubmit={handleEmployeeLogin} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="company">Company Username</Label>
              <Input
                id="company"
                type="text"
                placeholder="hris"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                type="text"
                placeholder="0821312433"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </div>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
}
