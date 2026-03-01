import { Link, useRouter } from '@tanstack/react-router'
import {
  ChevronsUpDown,
  Download,
  LogOut,
  LucideMoon,
  LucideSparkles,
  LucideSun,
  MessageCircleQuestionMark,
  Receipt,
  Settings,
} from 'lucide-react'

import { EXTERNAL_URLS } from '@/core/config/constant'
import { UserState } from '@/core/models/user.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { useTheme } from '@/shared/provider/theme-provider'
import { AnimatedGradientText } from '@/shared/ui/animated-gradient-text'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
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

  // --- Derived variables ---
  const isFreePlan = user.plan === 'Free'

  const openSettingsPage = (tab: 'account' | 'billing' = 'account') => {
    if (tab === 'billing') {
      void router.navigate({
        to: '/settings',
        search: { tabs: 'billing' },
      })
    } else {
      void router.navigate({
        to: '/settings',
        search: { tab: 'account' },
      })
    }

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
              {/* Avatar */}
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={user.profile_image ?? undefined}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg bg-amber-400 font-medium text-black">
                  {extractUserInitial(user.name)}
                </AvatarFallback>
              </Avatar>

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
            {isFreePlan && (
              <>
                <DropdownMenuGroup>
                  <Link to="/payments" className="w-full">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => isMobile && toggleSidebar()}
                    >
                      <LucideSparkles />
                      Go Pro
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </>
            )}
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
        <div className="relative">
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage
              src={user.profile_image ?? undefined}
              alt={user.name}
            />
            <AvatarFallback className="rounded-lg bg-amber-400 font-medium text-black">
              {extractUserInitial(user.name)}
            </AvatarFallback>
          </Avatar>
          {user.plan === 'Free' ? (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-xs border border-cyan-500 bg-cyan-300 px-1 py-px text-[9px] leading-none font-semibold text-black">
              Free
            </span>
          ) : (
            <span className="bg-card absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-xs border border-purple-200 px-1 py-px text-[9px] leading-none font-bold dark:border-purple-600">
              <AnimatedGradientText
                colorFrom="#ffaa40"
                colorTo="#9c40ff"
                speed={1.5}
              >
                Pro
              </AnimatedGradientText>
            </span>
          )}
        </div>

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
