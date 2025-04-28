'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axiosInstance from '@/lib/axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { loginAdmin } from '@/services/authService';

export function LoginTabs({ className }: { className?: string }) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [companyUsername, setCompanyUsername] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Sending login data:', { email, password });
    try {

      const res = await axiosInstance.post('/login', {
        company: companyUsername,
        login: employeeId,
        password: password,
      });

      const options = rememberMe ? { expires: 7 } : {}; // 7 hari jika Remember Me
      Cookies.set('access_token', res.data.access_token, options);
      Cookies.set('user', JSON.stringify(res.data.user), options);

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Sending login data:', { email, password });
    try {

      const res = await loginAdmin(email, password, rememberMe);

      console.log('res', res);

      const options = rememberMe ? { expires: 7 } : {}; // 7 hari jika Remember Me
      Cookies.set('access_token', res.access_token, options);
      Cookies.set('user', JSON.stringify(res.user), options);

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Tabs defaultValue="admin" className={cn("w-full max-w-md", className)}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="admin">Admin</TabsTrigger>
        <TabsTrigger value="employee">Employee</TabsTrigger>
      </TabsList>

      {/* EMPLOYEE FORM */}
      <TabsContent value="employee">
        <form className="flex flex-col gap-6" onSubmit={handleSubmitEmployee}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="companyUsername">Company Username</Label>
              <Input
                id="companyUsername"
                type="text"
                placeholder="hris"
                value={companyUsername}
                onChange={(e) => setCompanyUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
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
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Login
            </Button>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </form>
      </TabsContent>

      {/* ADMIN FORM */}
      <TabsContent value="admin">
        <form className="flex flex-col gap-6" onSubmit={handleSubmitAdmin}>
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
                type="email"
                placeholder="example@mail.com or 0821312433"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
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
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Login
            </Button>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <Button variant="outline" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Login with Google
            </Button>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  )
}
