import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Clock, MailPlus, ShieldOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { invitationApi, PendingInviteItem } from '@/core/api/invitation.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { UserState } from '@/core/models/user.model'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['admin', 'member']),
})
type FormValues = z.infer<typeof schema>

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

function PendingInviteRow({ invite }: { invite: PendingInviteItem }) {
  const queryClient = useQueryClient()

  const acceptMutation = useMutation({
    mutationFn: () => invitationApi.acceptInvite(invite.org_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.orgInvitations] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
      toast.success(`Joined ${invite.org_name}`)
    },
    onError: () => toast.error('Failed to accept invitation'),
  })

  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{invite.org_name}</p>
        <p className="text-muted-foreground truncate text-xs">
          Invited by {invite.invited_by_name} · expires{' '}
          {formatDate(invite.expires_at)}
        </p>
      </div>
      <Badge variant="outline" className="capitalize">
        {invite.role}
      </Badge>
      <Button
        size="sm"
        disabled={acceptMutation.isPending}
        onClick={() => acceptMutation.mutate()}
      >
        Accept
      </Button>
    </div>
  )
}

function OrgInvitations(_props: { user: UserState }) {
  const user = useUserState()

  const viewerRole = user?.currentOrg?.org_role ?? 'member'
  const canInvite = viewerRole === 'owner' || viewerRole === 'admin'
  const invitableRoles: Array<'admin' | 'member'> =
    viewerRole === 'owner' ? ['admin', 'member'] : ['member']

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', role: 'member' },
  })

  const inviteMutation = useMutation({
    mutationFn: (data: FormValues) => invitationApi.invite(data),
    onSuccess: (_, variables) => {
      toast.success(`Invitation sent to ${variables.email}`)
      reset()
    },
    onError: () => toast.error('Failed to send invitation'),
  })

  // Pending invitations received by this user
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: [QUERY_KEYS.orgInvitations],
    queryFn: () => invitationApi.getPendingInvites(),
    staleTime: 0,
  })

  const pendingInvites = pendingData?.data?.invitations ?? []

  if (!user || !user.currentOrg) return null

  return (
    <>
      {/* Header */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Invitations</h1>
      </div>
      <Separator />

      {/* Send invite */}
      <div className="py-4">
        <h2 className="text-sm font-medium">Invite to organisation</h2>
      </div>

      {canInvite ? (
        <form
          onSubmit={handleSubmit(d => inviteMutation.mutate(d))}
          className="max-w-sm space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invite-role">Role</Label>
            <Select
              value={watch('role')}
              onValueChange={v => setValue('role', v as 'admin' | 'member')}
            >
              <SelectTrigger id="invite-role" className="w-full">
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
          </div>

          <Button
            type="submit"
            disabled={inviteMutation.isPending}
            className="gap-2"
          >
            <MailPlus className="size-4" />
            Send invitation
          </Button>
        </form>
      ) : (
        <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
          <ShieldOff className="size-4 shrink-0" />
          Only admins and owners can invite members.
        </div>
      )}

      {/* Pending invitations received by the current user */}
      <div className="mt-6 py-4">
        <h2 className="text-sm font-medium">Pending invitations</h2>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Invitations you&apos;ve received from other organisations.
        </p>
      </div>
      <Separator />

      <div className="py-2">
        {pendingLoading ? (
          <div className="divide-border divide-y">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-52" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            ))}
          </div>
        ) : pendingInvites.length === 0 ? (
          <div className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
            <Clock className="size-4 shrink-0" />
            No pending invitations.
          </div>
        ) : (
          <div className="divide-border divide-y">
            {pendingInvites.map(invite => (
              <PendingInviteRow key={invite.id} invite={invite} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default OrgInvitations
