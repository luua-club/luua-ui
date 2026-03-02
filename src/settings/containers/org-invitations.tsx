import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { MailPlus, ShieldOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { invitationApi } from '@/core/api/invitation.api'
import { useUserState } from '@/core/hooks/user-state.hook'
import { UserState } from '@/core/models/user.model'
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

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['admin', 'member']),
})
type FormValues = z.infer<typeof schema>

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
    </>
  )
}

export default OrgInvitations
