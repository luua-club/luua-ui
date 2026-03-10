import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MailPlus, ShieldOff, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { invitationApi } from '@/core/api/invitation.api'
import { orgApi } from '@/core/api/org.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { Member } from '@/core/models/org.model'
import { UserState } from '@/core/models/user.model'
import { extractUserInitial } from '@/core/utils/common.util'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'

type MemberRole = 'owner' | 'admin' | 'member'

const inviteSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['admin', 'member']),
})
type InviteFormValues = z.infer<typeof inviteSchema>

/** Roles that the viewer can assign, given their own role */
function assignableRoles(viewerRole: string): Array<'admin' | 'member'> {
  if (viewerRole === 'owner') return ['admin', 'member']
  if (viewerRole === 'admin') return ['member']
  return []
}

/** Whether the viewer can perform actions on the target member */
function canAct(viewerRole: string, targetRole: string): boolean {
  if (viewerRole === 'owner') return targetRole !== 'owner'
  if (viewerRole === 'admin') return targetRole === 'member'
  return false
}

function roleBadgeVariant(
  role: string
): 'default' | 'secondary' | 'outline' | 'destructive' {
  if (role === 'owner') return 'default'
  if (role === 'admin') return 'secondary'
  return 'outline'
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function MemberRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3">
      <Skeleton className="size-9 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

function OrgMembers(_props: { user: UserState }) {
  const user = useUserState()
  const queryClient = useQueryClient()
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null)
  const [showInviteForm, setShowInviteForm] = useState(false)

  const viewerRole: MemberRole =
    (user?.currentOrg?.org_role as MemberRole) ?? 'member'
  const canInvite = viewerRole === 'owner' || viewerRole === 'admin'
  const invitableRoles = assignableRoles(viewerRole)
  const roles = invitableRoles
  const hasActions = roles.length > 0

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.orgMembers],
    queryFn: () => orgApi.getOrgMembers(),
    staleTime: 0,
  })

  const removeMutation = useMutation({
    mutationFn: (userId: string) => orgApi.removeMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.orgMembers] })
      toast.success('Member removed')
    },
    onError: () => toast.error('Failed to remove member'),
    onSettled: () => setRemoveTarget(null),
  })

  const changeRoleMutation = useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string
      role: 'admin' | 'member'
    }) => orgApi.changeMemberRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.orgMembers] })
      toast.success('Role updated')
    },
    onError: () => toast.error('Failed to update role'),
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', role: 'admin' },
  })

  const inviteMutation = useMutation({
    mutationFn: (data: InviteFormValues) => invitationApi.invite(data),
    onSuccess: (_, variables) => {
      toast.success(`Invitation sent to ${variables.email}`)
      reset()
      setShowInviteForm(false)
    },
    onError: () => toast.error('Failed to send invitation'),
  })

  const members = data?.data ?? []

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-lg font-medium">Members</h1>
        {canInvite && (
          <Button
            variant={showInviteForm ? 'outline' : 'default'}
            size="sm"
            className="gap-2"
            onClick={() => {
              setShowInviteForm(v => !v)
              if (showInviteForm) reset()
            }}
          >
            {showInviteForm ? (
              <>
                <X className="size-4" />
                Cancel
              </>
            ) : (
              <>
                <UserPlus className="size-4" />
                Invite member
              </>
            )}
          </Button>
        )}
      </div>
      <Separator />

      {/* Invite form */}
      {showInviteForm && (
        <div className="border-border bg-muted/30 mt-4 rounded-lg border p-4">
          <p className="mb-3 text-sm font-medium">Invite to organisation</p>
          <form
            onSubmit={handleSubmit(d => inviteMutation.mutate(d))}
            className="space-y-2"
          >
            <div className="flex gap-2">
              <Input
                className="flex-1"
                type="email"
                placeholder="colleague@example.com"
                {...register('email')}
              />
              <Select
                value="admin"
                onValueChange={v => setValue('role', v as 'admin' | 'member')}
                disabled
              >
                <SelectTrigger className="w-32 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {invitableRoles.map(r => (
                    <SelectItem key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="submit"
                disabled={inviteMutation.isPending}
                className="shrink-0 gap-2"
              >
                <MailPlus className="size-4" />
                Send invite
              </Button>
            </div>
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </form>
        </div>
      )}

      {/* No permission notice */}
      {!canInvite && (
        <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
          <ShieldOff className="size-4 shrink-0" />
          Only admins and owners can invite members.
        </div>
      )}

      <div className="py-4">
        {isLoading ? (
          <div className="divide-border divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <MemberRowSkeleton key={i} />
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No members found.
          </p>
        ) : (
          <div className="divide-border divide-y">
            {members.map(member => {
              const actionsAllowed = canAct(viewerRole, member.role)
              return (
                <div
                  key={member.id}
                  className="flex flex-wrap items-center gap-3 py-3"
                >
                  {/* Avatar */}
                  <Avatar className="size-9 shrink-0">
                    <AvatarImage
                      src={member.profile_image ?? undefined}
                      alt={member.name}
                    />
                    <AvatarFallback className="bg-muted text-sm font-medium">
                      {extractUserInitial(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name + email */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {member.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {member.email}
                    </p>
                  </div>

                  {/* Join date */}
                  <span className="text-muted-foreground hidden text-xs sm:block">
                    {formatDate(member.joined_at)}
                  </span>

                  {/* Role badge / role select */}
                  {actionsAllowed && hasActions ? (
                    <Select
                      value={member.role}
                      onValueChange={role =>
                        changeRoleMutation.mutate({
                          userId: member.id,
                          role: role as 'admin' | 'member',
                        })
                      }
                      disabled
                    >
                      <SelectTrigger size="sm" className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(r => (
                          <SelectItem key={r} value={r}>
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={roleBadgeVariant(member.role)}>
                      {member.role.charAt(0).toUpperCase() +
                        member.role.slice(1)}
                    </Badge>
                  )}

                  {/* Remove button */}
                  {actionsAllowed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive shrink-0"
                      onClick={() => setRemoveTarget(member)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Remove confirmation dialog */}
      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={open => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.name ?? 'member'}?`}
        description="They will lose access to this organisation immediately."
        confirmLabel="Remove"
        confirmDisabled={removeMutation.isPending}
        onConfirm={() => removeTarget && removeMutation.mutate(removeTarget.id)}
      />
    </>
  )
}

export default OrgMembers
