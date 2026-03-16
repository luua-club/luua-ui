import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { projectApi } from '@/core/api/project.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { usePermission } from '@/core/hooks/use-permission'
import { useUserState } from '@/core/hooks/user-state.hook'
import { UserState } from '@/core/models/user.model'
import { Permission } from '@/core/rbac'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Separator } from '@/shared/ui/separator'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
})
type FormValues = z.infer<typeof schema>

function ProjectGeneral(_props: { user: UserState }) {
  const user = useUserState()
  const { can } = usePermission()
  const queryClient = useQueryClient()
  const canEditProject = can(Permission.PROJECT_EDIT_DRAFT)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.currentProject?.name ?? '' },
  })

  useEffect(() => {
    if (user?.currentProject?.name) {
      reset({ name: user.currentProject.name })
    }
  }, [user?.currentProject?.name, reset])

  const mutation = useMutation({
    mutationFn: (data: FormValues) => projectApi.updateProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
      toast.success('Project name updated')
    },
    onError: () => toast.error('Failed to update project name'),
  })

  if (!user || !user.currentProject) return null

  const { currentProject, orgProjects } = user

  return (
    <>
      {/* Header */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Overview</h1>
      </div>
      <Separator />

      {/* Projects list */}
      <div className="py-4">
        <h2 className="text-sm font-medium">Projects</h2>
      </div>

      <div className="divide-border divide-y">
        {orgProjects.map(project => {
          const isCurrent = project.id === currentProject.id
          return (
            <div key={project.id} className="flex items-center gap-3 py-3">
              {isCurrent ? (
                <CheckCircle2 className="text-primary size-4 shrink-0" />
              ) : (
                <div className="size-4 shrink-0" />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{project.name}</p>
                <p className="text-muted-foreground text-xs capitalize">
                  {project.project_role}
                </p>
              </div>

              {isCurrent ? (
                <Badge variant="secondary">Current</Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => user.changeProject(project.id)}
                >
                  Switch
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Rename current project — only for project_admin / editor */}
      {canEditProject && (
        <>
          <div className="mt-4 py-4">
            <h2 className="text-sm font-medium">Rename current project</h2>
          </div>
          <Separator />

          <form
            onSubmit={handleSubmit(d => mutation.mutate(d))}
            className="max-w-sm space-y-4 py-6"
          >
            <div>
              <Input {...register('name')} placeholder="Project name" />
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
      )}
    </>
  )
}

export default ProjectGeneral
