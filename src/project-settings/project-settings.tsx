import { createLazyRoute } from '@tanstack/react-router'

import { useOrgProject } from '@/core/hooks/org-project.hook'

function ProjectSettings() {
  const { selectedProject, selectedOrg } = useOrgProject()

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Project Settings</h1>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-medium">General</h2>
        <div className="space-y-4">
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Name
            </label>
            <p className="mt-1 text-sm">{selectedProject?.name ?? '-'}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Slug
            </label>
            <p className="mt-1 text-sm">{selectedProject?.slug ?? '-'}</p>
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
            <p className="mt-1 text-sm capitalize">
              {selectedProject?.status ?? '-'}
            </p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Your Role
            </label>
            <p className="mt-1 text-sm capitalize">
              {selectedProject?.project_role ?? '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createLazyRoute('/project-settings')({
  component: ProjectSettings,
})

export default ProjectSettings
