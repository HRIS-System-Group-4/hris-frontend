"use client"

import {
  IconChevronDown,
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { getInitials, toTitleCase } from "@/lib/strings"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { get } from "http"
import { login, logout } from "@/lib/features/authSlice"
import { useRouter } from "next/navigation"
import { fetchUser, logoutUser } from "@/services/authService"
import { useEffect, useState } from "react"
import { set } from "date-fns"
import { SkeletonNavUser } from "./skeletons/skeleton-nav-user"

export function NavUser({
}: {
  }) {
  const { isMobile } = useSidebar()
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  async function loadUser() {
    try {
      const data = await fetchUser()
      console.log("User authenticated", data)
      dispatch(login(data))
      setIsLoading(false)
    } catch (error) {
      console.error("User not authenticated", error)
    } finally {
      setIsLoggingOut(true)
    }
  }

  useEffect(() => {
    if (user === null && !isLoggingOut!) {
      loadUser()
    }
    if (user) {
      setIsLoading(false)
    }
  }, [dispatch, user, isLoggingOut])


  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logoutUser()
      dispatch(logout())
      router.push("/auth/login")
    } catch (error) {
      console.error("logoutUser", error)
    }
  }

  if (isLoading) return <SkeletonNavUser />

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback className="rounded-lg">{user?.name ? getInitials(user!.name) : ""}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight pr-4">
                <span className="truncate font-medium">{user?.name ? toTitleCase(user.name) : ""}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.is_admin ? 'Admin' : 'Employee'}
                </span>
              </div>
              <IconChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback className="rounded-lg">{user?.name ? getInitials(user!.name) : ""}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name ? toTitleCase(user.name) : ""}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.is_admin ? 'Admin' : 'Employee'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
