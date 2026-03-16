import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { orgApi } from '@/core/api/org.api'
import { projectApi } from '@/core/api/project.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { Member } from '@/core/models/org.model'
import { UserState } from '@/core/models/user.model'
import { extractUserInitial } from '@/core/utils/common.util'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'

type ProjectRole = 'project_admin' | 'editor' | 'viewer'

/** Roles that the viewer can assign when changing existing members */
function assignableRoles(viewerRole: string): ProjectRole[] {
  if (viewerRole === 'project_admin')
    return ['project_admin', 'editor', 'viewer']
  return []
}

/** Roles the viewer can assign when adding new members */
function addableRoles(viewerRole: string): ProjectRole[] {
  if (viewerRole === 'project_admin')
    return ['project_admin', 'editor', 'viewer']
  if (viewerRole === 'editor') return ['editor', 'viewer']
  return []
}

/** Whether the viewer can perform actions on the target member */
function canAct(
  viewerRole: string,
  targetRole: string,
  isSelf: boolean
): boolean {
  if (isSelf) return false
  if (viewerRole === 'project_admin') return true
  return false
}

function roleBadgeVariant(
  role: string
): 'default' | 'secondary' | 'outline' | 'destructive' {
  if (role === 'project_admin') return 'default'
  if (role === 'editor') return 'secondary'
  return 'outline'
}

function roleLabel(role: string): string {
  if (role === 'project_admin') return 'Admin'
  if (role === 'editor') return 'Editor'
  return 'Viewer'
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

function ProjectMembers(_props: { user: UserState }) {
  const user = useUserState()
  const queryClient = useQueryClient()
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null)
  const [addRoles, setAddRoles] = useState<Record<string, ProjectRole>>({})

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.projectMembers],
    queryFn: () => projectApi.getProjectMembers(),
    staleTime: 0,
  })

  const members = data?.data ?? []
  const profileProject = user?.projects?.find(
    p => p.id === user?.currentProject?.id
  )
  const viewerRole: ProjectRole =
    (profileProject?.project_role as ProjectRole) ?? 'viewer'

  const canAdd = viewerRole === 'project_admin' || viewerRole === 'editor'

  const { data: orgMembersData } = useQuery({
    queryKey: [QUERY_KEYS.orgMembers],
    queryFn: () => orgApi.getOrgMembers(),
    staleTime: 0,
  })

  // Build a set of org owner IDs so we can show them as "Owner" in the project team
  const orgOwnerIds = new Set(
    (orgMembersData?.data ?? []).filter(m => m.role === 'owner').map(m => m.id)
  )

  const removeMutation = useMutation({
    mutationFn: (userId: string) => projectApi.removeProjectMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projectMembers] })
      toast.success('Member removed')
    },
    onError: () => toast.error('Failed to remove member'),
    onSettled: () => setRemoveTarget(null),
  })

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: ProjectRole }) =>
      projectApi.changeProjectMemberRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projectMembers] })
      toast.success('Role updated')
    },
    onError: () => toast.error('Failed to update role'),
  })

  const addMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: ProjectRole }) =>
      projectApi.addProjectMember(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projectMembers] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.orgMembers] })
      toast.success('Member added')
    },
    onError: () => toast.error('Failed to add member'),
  })

  const roles = assignableRoles(viewerRole)
  const hasActions = roles.length > 0
  const availableAddRoles = addableRoles(viewerRole)
  const defaultAddRole: ProjectRole =
    viewerRole === 'project_admin' ? 'editor' : 'viewer'

  const projectMemberIds = new Set(members.map(m => m.id))
  const orgMembers = orgMembersData?.data ?? []
  const unassignedMembers = orgMembers.filter(m => !projectMemberIds.has(m.id))

  return (
    <>
      {/* Header */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Team</h1>
      </div>
      <Separator />

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
              const isSelf = member.id === user?.id
              const isOrgOwner = orgOwnerIds.has(member.id)
              const actionsAllowed =
                !isOrgOwner && canAct(viewerRole, member.role, isSelf)
              const displayRole = isOrgOwner ? 'Owner' : roleLabel(member.role)
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
                          role: role as ProjectRole,
                        })
                      }
                      disabled={changeRoleMutation.isPending}
                    >
                      <SelectTrigger size="sm" className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(r => (
                          <SelectItem key={r} value={r}>
                            {roleLabel(r)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant={
                        isOrgOwner ? 'default' : roleBadgeVariant(member.role)
                      }
                    >
                      {displayRole}
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

      {/* Add from organization */}
      {canAdd && unassignedMembers.length > 0 && (
        <>
          <Separator />
          <div className="py-4">
            <h2 className="text-muted-foreground mb-3 text-sm font-medium">
              Add from organization
            </h2>
            <div className="divide-border divide-y">
              {unassignedMembers.map(member => {
                const selectedRole: ProjectRole =
                  addRoles[member.id] ?? defaultAddRole
                return (
                  <div
                    key={member.id}
                    className="flex flex-wrap items-center gap-3 py-3"
                  >
                    <Avatar className="size-9 shrink-0">
                      <AvatarImage
                        src={member.profile_image ?? undefined}
                        alt={member.name}
                      />
                      <AvatarFallback className="bg-muted text-sm font-medium">
                        {extractUserInitial(member.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {member.name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {member.email}
                      </p>
                    </div>

                    <Select
                      value={selectedRole}
                      onValueChange={role =>
                        setAddRoles(prev => ({
                          ...prev,
                          [member.id]: role as ProjectRole,
                        }))
                      }
                    >
                      <SelectTrigger size="sm" className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAddRoles.map(r => (
                          <SelectItem key={r} value={r}>
                            {roleLabel(r)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      disabled={addMutation.isPending}
                      onClick={() =>
                        addMutation.mutate({
                          userId: member.id,
                          role: selectedRole,
                        })
                      }
                    >
                      Add
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Remove confirmation dialog */}
      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={open => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.name ?? 'member'}?`}
        description="They will lose access to this project immediately."
        confirmLabel="Remove"
        confirmDisabled={removeMutation.isPending}
        onConfirm={() => removeTarget && removeMutation.mutate(removeTarget.id)}
      />
    </>
  )
}

export default ProjectMembers
