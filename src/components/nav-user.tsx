"use client"

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

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
import { toTitleCase } from "@/lib/strings"
import axiosInstance from '@/lib/axios'
import { logout as logoutService } from '@/services/authService' // rename logout API call
import { logout } from '@/lib/features/authSlice' // import logout action dari redux slice kamu

export function NavUser({
  user,
}: {
  user: {
    name: string,
    email: string,
    is_admin: number
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const dispatch = useDispatch() // <== Tambahkan useDispatch di sini

  const handleLogout = async () => {
    try {
      const res = await logoutService(); // <== Pastikan ini await ya
      console.log('res', res);

      if (res.status === 200) {
        Cookies.remove('access_token');
        Cookies.remove('user');

        dispatch(logout());

        router.push('/auth/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed. Please try again.');
    }
  };

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
                <AvatarImage src="/avatars/shadcn.jpg" alt="AB" />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight pr-4">
                <span className="truncate font-medium">{toTitleCase(user.name)}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {toTitleCase(user.is_admin === 1 ? "Admin" : "Employee")}
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
                  <AvatarImage src="/avatars/shadcn.jpg" alt="AB" />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{toTitleCase(user.name)}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {toTitleCase(user.is_admin === 1 ? "Admin" : "Employee")}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
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
            <DropdownMenuSeparator />
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
