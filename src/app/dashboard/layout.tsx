"use client"

import type React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavUser } from "@/components/nav-user";
import { useBreadcrumbSegments } from "@/hooks/use-breadcrumbs";

interface UserDataFromApi {
  id: string;
  email: string;
  is_admin: boolean;
  name: string;
  // avatar?: string;
}

interface NavUserProps {
  name: string;
  level: string;
  avatar: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [navUserData, setNavUserData] = useState<NavUserProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const authToken = localStorage.getItem("authToken");
      console.log("Token dari localStorage:", authToken);

      if (!authToken) {
        console.error(
          "No authentication token found in localStorage. Redirecting to login."
        );
        // window.location.href = "/login";
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get<UserDataFromApi>(
          "/api/admin/user",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/json",
            },
            withCredentials: true, // kirim cookie jika Sanctum/self-host auth membutuhkan
          }
        );

        setNavUserData({
          name: data.name,
          level: data.is_admin ? "admin" : "employee",
          avatar: "/avatars/shadcn.jpg", // TODO ganti dengan data.avatar bila backend support
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            console.error(
              "Authentication failed, token might be invalid or expired. Redirecting to login..."
            );
            // window.location.href = "/login";
          } else {
            console.error(
              "Failed to fetch user data:",
              err.response?.data || err.message
            );
          }
        } else {
          console.error("Unexpected error fetching user data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const segments = useBreadcrumbSegments();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!navUserData) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Error loading user data. Please try again or login.</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-auto h-screen scrollbar-none">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {segments.map(({ label, href, isLast }) => (
                  <div key={href} className="flex items-center gap-1">
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={href}>{label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="w-fit">
            <NavUser user={navUserData} />
          </div>
        </header>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
