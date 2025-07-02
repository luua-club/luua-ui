import { Link } from '@tanstack/react-router'
import {
  LucideBell,
  LucideChevronsUpDown,
  LucideLogOut,
  LucideSettings,
  LucideSparkles,
} from 'lucide-react'

import { logout } from '@/core/config/utils/common.util'
import { IUser } from '@/core/models/user.model'
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

export type INavUser = Pick<IUser, 'name' | 'email' | 'profile_image'>

interface INavUserProps {
  user: INavUser
}

export function NavUser({ user }: INavUserProps) {
  return (
    <DropdownMenu>
      {/* Trigger - the button that opens the dropdown */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="h-12 cursor-pointer border-1 border-dashed focus-visible:ring-0"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              className="rounded-full"
              src={user.profile_image}
              alt={user.name}
            />
            <AvatarFallback className="rounded-full">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs font-medium text-gray-400">
              {user.email}
            </span>
          </div>
          <LucideChevronsUpDown className="ml-auto size-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      {/* Content - the dropdown menu */}
      <NavUserDropdownContent />
    </DropdownMenu>
  )
}

const NavUserDropdownContent = () => {
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
