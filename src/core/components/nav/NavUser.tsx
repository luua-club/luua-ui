import { IconBrandChrome } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import {
  LucideChevronsUpDown,
  LucideLogOut,
  LucideSparkles,
  MessageCircleQuestionMark,
  Receipt,
  UserCog,
} from 'lucide-react'

import { EXTERNAL_URLS } from '@/core/config/constant'
import { UserState } from '@/core/models/user.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Skeleton } from '@/shared/ui/skeleton'

interface INavUserProps {
  user: UserState | null
}

export function NavUser({ user }: INavUserProps) {
  if (!user) {
    return (
      <div className="flex h-full items-center gap-2 px-3 focus-visible:ring-0 lg:w-50">
        <Skeleton className="size-8 rounded-full" />
        <div className="hidden flex-1 gap-1 text-left text-sm leading-tight lg:grid">
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      {/* Trigger - the button that opens the dropdown */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="h-12 cursor-pointer border-none focus-visible:ring-0"
        >
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={user.profile_image} alt={user.name} />
            <AvatarFallback>{extractUserInitial(user.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden flex-1 text-left text-sm leading-tight lg:grid">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs font-medium text-gray-400">
              {user.email}
            </span>
          </div>
          <LucideChevronsUpDown className="ml-auto hidden size-4 text-gray-400 lg:block" />
        </Button>
      </DropdownMenuTrigger>
      {/* Content - the dropdown menu */}
      <NavUserDropdownContent user={user} />
    </DropdownMenu>
  )
}

const NavUserDropdownContent = ({ user }: { user: UserState }) => {
  const isProPlan = user.plan === 'Pro'

  return (
    <DropdownMenuContent
      className="dark:bg-sidebar w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      side={'bottom'}
      align="end"
    >
      {/* Plan Benefits */}
      {isProPlan && (
        <>
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <LucideSparkles />
              <Link to="/payments" className="w-full">
                Go Pro
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </>
      )}

      {/* Account and Subscription */}
      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer">
          <UserCog />
          <Link to="/settings" className="w-full">
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Receipt />
          <Link to="/settings" search={{ tabs: 'billing' }} className="w-full">
            Subscription
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />

      {/* Contact Us */}
      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer">
          <MessageCircleQuestionMark />
          <a
            href={EXTERNAL_URLS.contactUs}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            Contact Us
          </a>
        </DropdownMenuItem>

        {/* TODO: Add link for  Chrome Extension */}
        <DropdownMenuItem className="cursor-pointer">
          <IconBrandChrome />
          <a
            href={EXTERNAL_URLS.contactUs}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            Download Chrome Extension
          </a>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      {/* Log out */}
      <DropdownMenuItem
        onClick={user.logout}
        variant="destructive"
        className="cursor-pointer"
      >
        <LucideLogOut />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
