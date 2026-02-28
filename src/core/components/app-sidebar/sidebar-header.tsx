import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import {
  Check,
  ChevronsUpDown,
  Loader,
  Plus,
  Search,
  Settings,
  UserPlus,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { projectApi } from '@/core/api/project.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Input } from '@/shared/ui/input'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'

const formatRole = (role: string) =>
  role
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

function AppSidebarHeader() {
  const userState = useUserState()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [projectSearch, setProjectSearch] = useState('')
  const [orgSearch, setOrgSearch] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const createProjectMutation = useMutation({
    mutationFn: (name: string) => projectApi.createProject({ name }),
    onSuccess: () => {
      toast.success('Project created')
      setCreateDialogOpen(false)
      setNewProjectName('')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
    },
    onError: () => {
      toast.error('Failed to create project')
    },
  })

  if (!userState) return null

  const {
    organizations,
    orgProjects: projects,
    selectedOrg,
    selectedProject,
    changeOrg,
    changeProject,
  } = userState

  const displayName = selectedProject?.name ?? selectedOrg?.name ?? 'Select'

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  )
  const filteredOrgs = organizations.filter(o =>
    o.name.toLowerCase().includes(orgSearch.toLowerCase())
  )

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newProjectName.trim()
    if (!trimmed) return
    createProjectMutation.mutate(trimmed)
  }

  const openCreateDialog = () => {
    setNewProjectName('')
    setCreateDialogOpen(true)
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu
            onOpenChange={() => {
              setProjectSearch('')
              setOrgSearch('')
            }}
          >
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="bg-transparent group-data-[collapsible=icon]:p-1.5! hover:cursor-pointer hover:bg-transparent"
              >
                <span className="bg-primary text-primary-foreground inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-[10px] font-semibold">
                  {displayName.charAt(0)}
                </span>
                <span className="min-w-0 truncate font-semibold transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0">
                  {displayName}
                </span>
                <ChevronsUpDown className="ml-auto size-4 opacity-70 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="right"
              align="start"
              className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-64"
            >
              {/* ── PROJECT SECTION ── */}
              <DropdownMenuLabel className="text-muted-foreground flex items-center justify-between text-xs tracking-[0.16em] uppercase">
                <span>Project</span>
                <Plus
                  className="size-3.5 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={openCreateDialog}
                />
              </DropdownMenuLabel>

              {/* Project switcher sub-menu */}
              {selectedProject && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2">
                    <span className="bg-primary text-primary-foreground inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-[10px] font-semibold">
                      {selectedProject.name.charAt(0)}
                    </span>
                    <span className="flex-1 truncate">
                      {selectedProject.name}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="min-w-56 p-0">
                      {/* Search */}
                      <div className="flex items-center gap-2 border-b px-3 py-2">
                        <Search className="text-muted-foreground size-4 shrink-0" />
                        <input
                          className="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
                          placeholder="Search projects..."
                          value={projectSearch}
                          onChange={e => setProjectSearch(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          onKeyDown={e => e.stopPropagation()}
                        />
                      </div>
                      {/* Project list */}
                      <div className="p-1">
                        {filteredProjects.map(project => (
                          <DropdownMenuItem
                            key={project.id}
                            onClick={() => changeProject(project.id)}
                            className="justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Check
                                className={
                                  project.id === selectedProject?.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                }
                              />
                              <span>{project.name}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {formatRole(project.project_role)}
                            </span>
                          </DropdownMenuItem>
                        ))}
                        {filteredProjects.length === 0 && (
                          <p className="text-muted-foreground px-2 py-1.5 text-sm">
                            No projects found
                          </p>
                        )}
                      </div>
                      {/* New project */}
                      <div className="border-t p-1">
                        <DropdownMenuItem onClick={openCreateDialog}>
                          <Plus className="size-4" />
                          <span>New project</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              )}

              {/* Project actions */}
              <DropdownMenuItem>
                <UserPlus className="size-4" />
                <span>Invite members</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.navigate({ to: '/settings' })}
              >
                <Settings className="size-4" />
                <span>Project settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* ── ORGANIZATION SECTION ── */}
              <DropdownMenuLabel className="text-muted-foreground flex items-center justify-between text-xs tracking-[0.16em] uppercase">
                <span>Organization</span>
              </DropdownMenuLabel>

              {/* Org switcher sub-menu */}
              {selectedOrg && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2">
                    <span className="bg-primary text-primary-foreground inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-[10px] font-semibold">
                      {selectedOrg.name.charAt(0)}
                    </span>
                    <span className="flex-1 truncate">{selectedOrg.name}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="min-w-56 p-0">
                      {/* Search */}
                      <div className="flex items-center gap-2 border-b px-3 py-2">
                        <Search className="text-muted-foreground size-4 shrink-0" />
                        <input
                          className="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
                          placeholder="Search organizations..."
                          value={orgSearch}
                          onChange={e => setOrgSearch(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          onKeyDown={e => e.stopPropagation()}
                        />
                      </div>
                      {/* Org list */}
                      <div className="p-1">
                        {filteredOrgs.map(org => (
                          <DropdownMenuItem
                            key={org.id}
                            onClick={() => changeOrg(org.id)}
                            className="justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Check
                                className={
                                  org.id === selectedOrg?.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                }
                              />
                              <span>{org.name}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {formatRole(org.org_role)}
                            </span>
                          </DropdownMenuItem>
                        ))}
                        {filteredOrgs.length === 0 && (
                          <p className="text-muted-foreground px-2 py-1.5 text-sm">
                            No organizations found
                          </p>
                        )}
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              )}

              {/* Org actions */}
              <DropdownMenuItem
                onClick={() => router.navigate({ to: '/settings' })}
              >
                <Settings className="size-4" />
                <span>Organization settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* ── CREATE PROJECT DIALOG ── */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-background w-full max-w-md p-6">
          <DialogClose disabled={createProjectMutation.isPending} />
          <DialogHeader className="mb-4">
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription className="text-sm">
              Add a new project to {selectedOrg?.name ?? 'your organization'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <Input
              placeholder="Project name"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              autoFocus
              disabled={createProjectMutation.isPending}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={createProjectMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !newProjectName.trim() || createProjectMutation.isPending
                }
              >
                {createProjectMutation.isPending ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AppSidebarHeader
