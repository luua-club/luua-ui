import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'

import { InstagramAccount } from '@/core/models/social.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Label } from '@/shared/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import { cn } from '@/shared/utils'

type InstagramPageSelectorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: InstagramAccount[]
  selectedAccountId?: string | null
  isSubmitting?: boolean
  onSubmit: (instagram_account_id: string) => void
}

function InstagramPageSelectorDialog({
  open,
  onOpenChange,
  accounts,
  selectedAccountId,
  isSubmitting,
  onSubmit,
}: InstagramPageSelectorDialogProps) {
  const [selectedId, setSelectedId] = useState(
    () => selectedAccountId ?? accounts[0]?.instagram_business_account_id ?? ''
  )

  useEffect(() => {
    if (open) {
      setSelectedId(
        selectedAccountId ?? accounts[0]?.instagram_business_account_id ?? ''
      )
    }
  }, [open, selectedAccountId, accounts])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card w-[calc(100vw-2rem)] max-w-lg p-5 md:w-full">
        <DialogHeader>
          <DialogTitle>Select Instagram Account</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Choose which Instagram Business account Luua should publish to.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={selectedId}
          onValueChange={setSelectedId}
          className="mt-4 gap-3"
        >
          {accounts.map(account => (
            <Label
              key={account.instagram_business_account_id}
              htmlFor={account.instagram_business_account_id}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded-xl border p-3',
                selectedId === account.instagram_business_account_id
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={account.ig_profile_picture_url ?? undefined}
                  />
                  <AvatarFallback>
                    {extractUserInitial(account.ig_name || account.ig_username)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {account.ig_name || account.ig_username}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    @{account.ig_username}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {account.page_name}
                  </p>
                </div>
              </div>

              <RadioGroupItem
                id={account.instagram_business_account_id}
                value={account.instagram_business_account_id}
              />
            </Label>
          ))}
        </RadioGroup>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Later
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (selectedId) onSubmit(selectedId)
            }}
            disabled={!selectedId || isSubmitting}
          >
            {isSubmitting && <Loader className="size-4 animate-spin" />}
            Save selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InstagramPageSelectorDialog
