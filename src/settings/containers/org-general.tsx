import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { orgApi } from '@/core/api/org.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { usePermission } from '@/core/hooks/use-permission'
import { useUserState } from '@/core/hooks/user-state.hook'
import { UserState } from '@/core/models/user.model'
import { Permission } from '@/core/rbac'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Separator } from '@/shared/ui/separator'

import EntityDetailSection from '../components/entity-detail-section'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
})
type FormValues = z.infer<typeof schema>

function OrgGeneral(_props: { user: UserState }) {
  const user = useUserState()
  const { can } = usePermission()
  const queryClient = useQueryClient()
  const canManageOrg = can(Permission.ORG_MANAGE_ORGANIZATION)

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
  const otherOrgs = organizations.filter(o => o.id !== currentOrg.id)

  return (
    <>
      {/* Header */}
      <div className="py-4">
        <h1 className="text-lg font-medium">General</h1>
      </div>
      <Separator />

      {/* Current org detail card */}
      <div className="py-4">
        <EntityDetailSection
          label="Organisation"
          name={currentOrg.name}
          role={currentOrg.org_role}
          plan={currentOrg.plan}
          seatUsed={currentOrg.seat_used}
          seatLimit={currentOrg.seat_limit}
        >
          {canManageOrg && (
            <form
              onSubmit={handleSubmit(d => mutation.mutate(d))}
              className="max-w-sm space-y-3"
            >
              <label className="text-muted-foreground text-sm font-medium">
                Rename organisation
              </label>
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
          )}
        </EntityDetailSection>
      </div>

      {/* Other organisations */}
      {otherOrgs.length > 0 && (
        <>
          <div className="pt-2 pb-3">
            <h2 className="text-muted-foreground text-sm font-medium">
              Other organisations
            </h2>
          </div>

          <div className="divide-border divide-y">
            {otherOrgs.map(org => (
              <div key={org.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{org.name}</p>
                  <p className="text-muted-foreground text-xs capitalize">
                    {org.org_role}
                  </p>
                </div>

                {org.no_projects_assigned ? (
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
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default OrgGeneral
