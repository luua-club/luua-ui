import { Building2, Loader, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { LinkedInAccountType, ProjectSocial } from '@/core/models/social.model'
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

type LinkedInTargetSelectorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  linkedInChannel?: ProjectSocial
  isSubmitting?: boolean
  onSubmit: (payload: {
    account_type: LinkedInAccountType
    organization_id: string | null
  }) => void
}

function LinkedInTargetSelectorDialog({
  open,
  onOpenChange,
  linkedInChannel,
  isSubmitting,
  onSubmit,
}: LinkedInTargetSelectorDialogProps) {
  const options = useMemo(
    () => [
      {
        id: 'personal',
        accountType: 'personal' as const,
        organizationId: null,
        name: linkedInChannel?.user_name || 'Personal profile',
        subtitle: 'Personal profile',
        profileImage: linkedInChannel?.user_profile_picture,
        viewLabel: 'View profile',
        viewUrl: 'https://www.linkedin.com/in/me/',
      },
      ...((linkedInChannel?.meta?.pages ?? []).map(page => ({
        id: `page:${page.id}`,
        accountType: 'page' as const,
        organizationId: page.id,
        name: page.name,
        subtitle: 'LinkedIn Page',
        profileImage: page.profile_image,
        viewLabel: 'View page',
        viewUrl: `https://www.linkedin.com/company/${encodeURIComponent(page.id)}/`,
      })) || []),
    ],
    [linkedInChannel]
  )

  const initialValue = useMemo(() => {
    if (
      linkedInChannel?.meta?.account_type === 'page' &&
      linkedInChannel?.meta.organization_id
    ) {
      return `page:${linkedInChannel.meta.organization_id}`
    }
    return 'personal'
  }, [linkedInChannel?.meta])

  const [selectedOptionId, setSelectedOptionId] = useState(initialValue)

  useEffect(() => {
    if (open) {
      setSelectedOptionId(initialValue)
    }
  }, [initialValue, open])

  const selectedOption = options.find(option => option.id === selectedOptionId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card w-[calc(100vw-2rem)] max-w-lg p-5 md:w-full">
        <DialogHeader>
          <DialogTitle>Select LinkedIn Account Type</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Choose where Luua should publish your LinkedIn posts.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={selectedOptionId}
          onValueChange={setSelectedOptionId}
          className="mt-4 gap-3"
        >
          {options.map(option => (
            <Label
              key={option.id}
              htmlFor={option.id}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded-xl border p-3',
                selectedOptionId === option.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={option.profileImage ?? undefined} />
                  <AvatarFallback>
                    {extractUserInitial(option.name || 'LinkedIn')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {option.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {option.subtitle}
                  </p>
                  {option.viewUrl && (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(option.viewUrl, '_blank')
                      }}
                    >
                      {option.viewLabel}
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {option.accountType === 'personal' ? (
                  <UserRound className="text-muted-foreground size-4" />
                ) : (
                  <Building2 className="text-muted-foreground size-4" />
                )}
                <RadioGroupItem id={option.id} value={option.id} />
              </div>
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
              if (!selectedOption) return
              onSubmit({
                account_type: selectedOption.accountType,
                organization_id: selectedOption.organizationId,
              })
            }}
            disabled={!selectedOption || isSubmitting}
          >
            {isSubmitting && <Loader className="size-4 animate-spin" />}
            Save selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LinkedInTargetSelectorDialog
