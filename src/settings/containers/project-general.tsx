import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Separator } from '@/shared/ui/separator'

import EntityDetailSection from '../components/entity-detail-section'

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
  const profileProject = user.projects?.find(p => p.id === currentProject.id)
  const otherProjects = orgProjects.filter(p => p.id !== currentProject.id)

  return (
    <>
      {/* Header */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Overview</h1>
      </div>
      <Separator />

      {/* Current project detail card */}
      <div className="py-4">
        <EntityDetailSection
          label="Project"
          name={currentProject.name}
          role={profileProject?.project_role}
        >
          {canEditProject && (
            <form
              onSubmit={handleSubmit(d => mutation.mutate(d))}
              className="max-w-sm space-y-3"
            >
              <label className="text-muted-foreground text-sm font-medium">
                Rename project
              </label>
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
          )}
        </EntityDetailSection>
      </div>

      {/* Other projects */}
      {otherProjects.length > 0 && (
        <>
          <div className="pt-2 pb-3">
            <h2 className="text-muted-foreground text-sm font-medium">
              Other projects
            </h2>
          </div>

          <div className="divide-border divide-y">
            {otherProjects.map(project => (
              <div key={project.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{project.name}</p>
                  <p className="text-muted-foreground text-xs capitalize">
                    {project.project_role}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => user.changeProject(project.id)}
                >
                  Switch
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default ProjectGeneral
