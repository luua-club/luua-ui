import { LogOut, Trash2 } from 'lucide-react'

import { UserState } from '@/core/models/user.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

const Account = ({ user }: { user: UserState }) => {
  const handleDeleteAccount = () => {
    // TODO:Implement delete account logic here
    // Add confirmation dialog and deletion logic
  }

  return (
    <>
      {/* Heading */}
      <div className="py-4">
        <h1 className="text-lg font-medium">My Profile</h1>
      </div>
      <Separator />

      {/* User Profile */}
      <div className="py-8">
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarImage src={user.profile_image} alt={user.name} />
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

      {/* Heading */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Account</h1>
      </div>
      <Separator />

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

      {/* Delete Account */}
      <div className="flex items-center justify-between py-3">
        <div>
          <h3 className="font-medium">Delete my account</h3>
          <p className="text-muted-foreground text-sm">
            Permanently delete the account and remove all data.
          </p>
        </div>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          <Trash2 className="mr-2 size-4" />
          Delete Account
        </Button>
      </div>
    </>
  )
}

export default Account
