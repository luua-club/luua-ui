import { useMutation } from '@tanstack/react-query'
import { LogOut, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { userApi } from '@/core/api/user.api'
import { API_CONSTANTS } from '@/core/config/constant'
import { ApiError } from '@/core/models/api.model'
import { UserState } from '@/core/models/user.model'
import { extractUserInitial } from '@/core/utils/common.util'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

function Account({ user }: { user: UserState }) {
  // --- State ---
  const [confirmOpen, setConfirmOpen] = useState(false)

  // --- Mutation ---
  /**
   * Handle account deletion with subscription validation
   */
  const deleteAccountMutation = useMutation({
    mutationFn: () => userApi.deleteAccount(),
    onSuccess: () => {
      user.logout()
    },
    onError: (error: ApiError) => {
      // Check if user has active subscription and show appropriate error
      if (
        typeof error.detail === 'object' &&
        error.detail?.error_code ===
          API_CONSTANTS.errorCode.activeSubscriptionFound
      ) {
        toast.error(
          'You are currently subscribed to a plan. Please cancel your subscription before deleting your account.',
          {
            icon: null,
            duration: 8000,
            closeButton: true,
          }
        )
        return
      }

      toast.error('Failed to delete account')
    },
    onSettled: () => {
      setConfirmOpen(false)
    },
  })

  // --- Functions ---
  /**
   * Handle account deletion
   */
  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate()
  }

  return (
    <>
      {/* Profile Section Header */}
      <div className="py-4">
        <h1 className="text-lg font-medium">My Profile</h1>
      </div>
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

      {/* Delete Account Option (requires no active subscription) */}
      <div className="flex items-center justify-between py-3">
        <div>
          <h3 className="font-medium">Delete my account</h3>
          <p className="text-muted-foreground text-sm">
            Permanently delete the account and remove all data.
          </p>
        </div>
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          <Trash2 className="mr-2 size-4" />
          Delete Account
        </Button>
      </div>

      {/* Confirmation Dialog for Account Deletion */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete account?"
        description="This action cannot be undone. This will permanently delete your account and remove all data."
        confirmLabel="Delete"
        confirmDisabled={deleteAccountMutation.isPending}
        onConfirm={() => {
          handleDeleteAccount()
        }}
      />
    </>
  )
}

export default Account
