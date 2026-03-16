import { LogOut } from 'lucide-react'

import { UserState } from '@/core/models/user.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

function Account({ user }: { user: UserState }) {
  return (
    <>
      {/* Profile Section Header */}
      <h1 className="pb-4 text-lg font-medium">My Profile</h1>

      <Separator />

      {/* User Profile Display */}
      <div className="py-8">
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarImage
              src={user.profile_image ?? undefined}
              alt={user.name}
            />
            <AvatarFallback className="bg-muted text-base font-medium">
              {extractUserInitial(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-base font-medium">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Account Management Section Header */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Account</h1>
      </div>
      <Separator />

      {/* Sign Out Option */}
      <div className="flex items-center justify-between py-3">
        <div>
          <h3 className="font-medium">Sign Out</h3>
          <p className="text-muted-foreground text-sm">
            Log out from the application
          </p>
        </div>
        <Button variant="outline" onClick={user.logout}>
          <LogOut className="mr-2 size-4" />
          Log out
        </Button>
      </div>
    </>
  )
}

export default Account
