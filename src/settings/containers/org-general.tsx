import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { orgApi } from '@/core/api/org.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { UserState } from '@/core/models/user.model'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Separator } from '@/shared/ui/separator'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
})
type FormValues = z.infer<typeof schema>

function OrgGeneral(_props: { user: UserState }) {
  const user = useUserState()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.currentOrg?.name ?? '' },
  })

  useEffect(() => {
    if (user?.currentOrg?.name) {
      reset({ name: user.currentOrg.name })
    }
  }, [user?.currentOrg?.name, reset])

  const mutation = useMutation({
    mutationFn: (data: FormValues) => orgApi.updateOrg(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
      toast.success('Organisation name updated')
    },
    onError: () => toast.error('Failed to update organisation name'),
  })

  if (!user || !user.currentOrg) return null

  const { currentOrg, organizations } = user
  const seatPercent =
    currentOrg.seat_limit > 0
      ? Math.min(
          100,
          Math.round((currentOrg.seat_used / currentOrg.seat_limit) * 100)
        )
      : 0

  return (
    <>
      {/* Header */}
      <div className="py-4">
        <h1 className="text-lg font-medium">General</h1>
      </div>
      <Separator />

      {/* Organisations list */}
      <div className="py-4">
        <h2 className="text-sm font-medium">Organisations</h2>
      </div>

      <div className="divide-border divide-y">
        {organizations.map(org => {
          const isCurrent = org.id === currentOrg.id
          return (
            <div key={org.id} className="flex items-center gap-3 py-3">
              {isCurrent ? (
                <CheckCircle2 className="text-primary size-4 shrink-0" />
              ) : (
                <div className="size-4 shrink-0" />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{org.name}</p>
                <p className="text-muted-foreground text-xs capitalize">
                  {org.org_role}
                </p>
              </div>

              {isCurrent ? (
                <Badge variant="secondary">Current</Badge>
              ) : org.no_projects_assigned ? (
                <Badge variant="outline">No projects assigned</Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => user.changeOrg(org.id)}
                >
                  Switch
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Plan + Seat usage for current org */}
      <div className="mt-4 space-y-4 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Current Plan</span>
          <Badge variant={currentOrg.plan === 'Pro' ? 'default' : 'secondary'}>
            {currentOrg.plan}
          </Badge>
        </div>

        <div className="max-w-sm space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Seats</span>
            <span className="text-muted-foreground">
              {currentOrg.seat_used} / {currentOrg.seat_limit}
            </span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${seatPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rename current org */}
      <div className="py-4">
        <h2 className="text-sm font-medium">Rename current organisation</h2>
      </div>
      <Separator />

      <form
        onSubmit={handleSubmit(d => mutation.mutate(d))}
        className="max-w-sm space-y-4 py-6"
      >
        <div>
          <Input {...register('name')} placeholder="Organisation name" />
          {errors.name && (
            <p className="text-destructive mt-1 text-xs">
              {errors.name.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={!isDirty || mutation.isPending}>
          Save changes
        </Button>
      </form>
    </>
  )
}

export default OrgGeneral
