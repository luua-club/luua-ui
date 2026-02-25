import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Check, Loader2, Pencil, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { projectApi } from '@/core/api/project.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useOrgProject } from '@/core/hooks/org-project.hook'
import { Member } from '@/core/models/org.model'
import { extractUserInitial } from '@/core/utils/common.util'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'

const formatRole = (role: string) =>
  role
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

function ProjectSettings() {
  const { selectedOrg } = useOrgProject()
  const queryClient = useQueryClient()

  const [isEditing, setIsEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')

  const { data: projectDetails, isLoading: detailsLoading } = useQuery({
    queryKey: [QUERY_KEYS.projectDetails],
    queryFn: () => projectApi.getProjectDetails(),
  })

  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: [QUERY_KEYS.projectMembers],
    queryFn: () => projectApi.getProjectMembers(),
  })

  const project = projectDetails?.data
  const members: Member[] = membersData?.data ?? []

  const canEdit =
    project?.project_role === 'owner' || project?.project_role === 'admin'

  const updateMutation = useMutation({
    mutationFn: (data: { name: string }) => projectApi.updateProject(data),
    onSuccess: () => {
      toast.success('Project name updated')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projectDetails] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
      setIsEditing(false)
    },
    onError: () => {
      toast.error('Failed to update project name')
    },
  })

  const startEditing = () => {
    setNameInput(project?.name ?? '')
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setNameInput('')
  }

  const saveName = () => {
    const trimmed = nameInput.trim()
    if (!trimmed || trimmed === project?.name) {
      cancelEditing()
      return
    }
    updateMutation.mutate({ name: trimmed })
  }

  if (detailsLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Loader2 className="text-muted-foreground size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Project Settings</h1>

      {/* General info */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-medium">General</h2>
        <div className="space-y-4">
          {/* Name (editable) */}
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Name
            </label>
            {isEditing ? (
              <div className="mt-1 flex items-center gap-2">
                <Input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveName()
                    if (e.key === 'Escape') cancelEditing()
                  }}
                  className="h-8 max-w-xs"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  onClick={saveName}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  onClick={cancelEditing}
                  disabled={updateMutation.isPending}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm">{project?.name ?? '-'}</p>
                {canEdit && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    onClick={startEditing}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Organization
            </label>
            <p className="mt-1 text-sm">{selectedOrg?.name ?? '-'}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Status
            </label>
            <p className="mt-1 text-sm capitalize">{project?.status ?? '-'}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Your Role
            </label>
            <p className="mt-1 text-sm">
              {project?.project_role ? formatRole(project.project_role) : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-medium">Members</h2>
        {membersLoading ? (
          <div className="flex min-h-20 items-center justify-center">
            <Loader2 className="text-muted-foreground size-5 animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <p className="text-muted-foreground text-sm">No members found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src={member.profile_image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {extractUserInitial(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{formatRole(member.role)}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(member.joined_at), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/project-settings')({
  component: ProjectSettings,
})

export default ProjectSettings
