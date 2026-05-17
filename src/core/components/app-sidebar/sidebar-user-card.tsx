import { useRouter } from '@tanstack/react-router'
import {
  ChevronsUpDown,
  Download,
  LogOut,
  LucideMoon,
  LucideSun,
  MessageCircleQuestionMark,
  Receipt,
  Settings,
} from 'lucide-react'

import { CurrentUserPlanAvatar } from '@/core/components/billing'
import { EXTERNAL_URLS } from '@/core/config/constant'
import { type UserState } from '@/core/models/user.model'
import { useTheme } from '@/shared/provider/theme-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar'

interface UserSidebarCardProps {
  user: UserState | null
}

export function UserSidebarCard({ user }: UserSidebarCardProps) {
  // --- Hook ---
  const { isMobile, toggleSidebar } = useSidebar()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  // --- Early return ---
  if (!user) {
    return null
  }

  const openSettingsPage = (tab: 'account' | 'billing' = 'account') => {
    void router.navigate({
      to: '/settings',
      search: { tab },
    })

    if (isMobile) {
      toggleSidebar()
    }
  }

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <UserCardDropdownTrigger user={user} />
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align="end"
          sideOffset={4}
        >
          {/* Option:1 - User info */}
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <CurrentUserPlanAvatar
                name={user.name}
                profileImage={user.profile_image}
                plan={user.plan}
                avatarClassName="h-8 w-8"
                fallbackClassName="rounded-lg"
              />

              {/* Username and email */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          {/* Option:2 - General options */}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <LucideSun /> : <LucideMoon />}
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} mode
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {/* Option:3 - Settings and billing */}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => openSettingsPage('account')}
            >
              <Settings />
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => openSettingsPage('billing')}
            >
              <Receipt />
              Billing
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {/* Option:4 - External Links */}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <a
                href={EXTERNAL_URLS.contactUs}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2"
              >
                <MessageCircleQuestionMark />
                Contact Us
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <a
                href={EXTERNAL_URLS.chromeExt}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2"
              >
                <Download />
                Get Chrome Extension
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {/* Option:5 - Logout */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={user.logout}
            variant="destructive"
            className="cursor-pointer"
          >
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

/**
 * When this is clicked, it should open the dropdown menu
 */
interface UserCardDropdownProps {
  user: UserState
}

const UserCardDropdownTrigger = ({ user }: UserCardDropdownProps) => {
  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer focus-visible:ring-0"
      >
        {/** Avatar with plan badge */}
        <CurrentUserPlanAvatar
          name={user.name}
          profileImage={user.profile_image}
          plan={user.plan}
          avatarClassName="h-8 w-8"
          fallbackClassName="rounded-lg"
        />

        {/** Username and email */}
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>

        {/** Chevron */}
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  )
}
