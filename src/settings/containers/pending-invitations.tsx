import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Clock } from 'lucide-react'
import { toast } from 'sonner'

import { invitationApi, PendingInviteItem } from '@/core/api/invitation.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { UserState } from '@/core/models/user.model'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'

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

function PendingInvitations(_props: { user: UserState }) {
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: [QUERY_KEYS.orgInvitations],
    queryFn: () => invitationApi.getPendingInvites(),
    staleTime: 0,
  })

  const pendingInvites = pendingData?.data?.invitations ?? []

  return (
    <>
      <div className="py-4">
        <h1 className="text-lg font-medium">Pending Invitations</h1>
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

export default PendingInvitations
