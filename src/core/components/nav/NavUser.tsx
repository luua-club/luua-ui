import { Link } from '@tanstack/react-router'
import {
  LucideBell,
  LucideChevronsUpDown,
  LucideLogOut,
  LucideSettings,
  LucideSparkles,
} from 'lucide-react'

import { IUserState } from '@/core/models/user.model'
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
  user: IUserState | null
}

export function NavUser({ user }: INavUserProps) {
  if (!user) {
    return (
      <div className="flex h-full items-center gap-2 rounded px-3 focus-visible:ring-0 lg:w-50 lg:border-1 lg:border-dashed">
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
          className="h-12 cursor-pointer focus-visible:ring-0 lg:border-1 lg:border-dashed"
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
      <NavUserDropdownContent logout={user.logout} />
    </DropdownMenu>
  )
}

const NavUserDropdownContent = ({ logout }: { logout: () => void }) => {
  return (
    <DropdownMenuContent
      className="dark:bg-sidebar w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      side={'bottom'}
      align="end"
    >
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <LucideSparkles />
          Go Pro <span className="text-xs text-gray-500">Coming Soon</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <LucideSettings />
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LucideBell />
          Notifications
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout}>
        <LucideLogOut />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
