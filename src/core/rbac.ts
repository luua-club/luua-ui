// rbac.ts — mirrors backend app/core/rbac.py

export const OrgRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
} as const
export type OrgRole = (typeof OrgRole)[keyof typeof OrgRole]

export const ProjectRole = {
  PROJECT_ADMIN: 'project_admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const
export type ProjectRole = (typeof ProjectRole)[keyof typeof ProjectRole]

export const Permission = {
  ORG_MANAGE_BILLING: 'org.manage_billing',
  ORG_MANAGE_MEMBERS: 'org.manage_members',
  ORG_MANAGE_ORGANIZATION: 'org.manage_projects',
  ORG_MANAGE_PROJECTS: 'org.manage_projects',
  PROJECT_UPSERT_DRAFT: 'project.upsert_draft',
  PROJECT_EDIT_DRAFT: 'project.edit_draft',
  PROJECT_DELETE_DRAFT: 'project.delete_draft',
  PROJECT_VIEW_CONTENT: 'project.view_content',
  PROJECT_CREATE_IMAGE: 'project.create_image',
  PROJECT_DELETE_IMAGE: 'project.delete_image',
  PROJECT_VIEW_IMAGE: 'project.view_image',
  PROJECT_MANAGE_AUTOPILOT: 'project.manage_autopilot',
  PROJECT_MANAGE_USER_STYLE: 'project.manage_user_style',
  PROJECT_MANAGE_SOCIAL_OAUTH: 'project.manage_social_oauth',
  PROJECT_UPSERT_INSPIRATION: 'project.upsert_inspiration',
  PROJECT_DELETE_INSPIRATION: 'project.delete_inspiration',
  PROJECT_VIEW_INSPIRATION: 'project.view_inspiration',
  PROJECT_VIEW_AUDIT_LOGS: 'project.view_audit_logs',
} as const
export type Permission = (typeof Permission)[keyof typeof Permission]

// --- Role → Permission mappings ---

export const ORG_ROLE_PERMISSIONS: Record<OrgRole, Set<Permission>> = {
  [OrgRole.OWNER]: new Set([
    Permission.ORG_MANAGE_BILLING,
    Permission.ORG_MANAGE_MEMBERS,
    Permission.ORG_MANAGE_ORGANIZATION,
    Permission.ORG_MANAGE_PROJECTS,
  ]),
  [OrgRole.ADMIN]: new Set([
    Permission.ORG_MANAGE_ORGANIZATION,
    Permission.ORG_MANAGE_MEMBERS,
    Permission.ORG_MANAGE_PROJECTS,
  ]),
  [OrgRole.MEMBER]: new Set(),
}

export const PROJECT_ROLE_PERMISSIONS: Record<ProjectRole, Set<Permission>> = {
  [ProjectRole.PROJECT_ADMIN]: new Set([
    Permission.PROJECT_UPSERT_DRAFT,
    Permission.PROJECT_EDIT_DRAFT,
    Permission.PROJECT_DELETE_DRAFT,
    Permission.PROJECT_VIEW_CONTENT,
    Permission.PROJECT_MANAGE_AUTOPILOT,
    Permission.PROJECT_MANAGE_USER_STYLE,
    Permission.PROJECT_MANAGE_SOCIAL_OAUTH,
    Permission.PROJECT_UPSERT_INSPIRATION,
    Permission.PROJECT_DELETE_INSPIRATION,
    Permission.PROJECT_VIEW_INSPIRATION,
    Permission.PROJECT_CREATE_IMAGE,
    Permission.PROJECT_DELETE_IMAGE,
    Permission.PROJECT_VIEW_IMAGE,
    Permission.PROJECT_VIEW_AUDIT_LOGS,
  ]),
  [ProjectRole.EDITOR]: new Set([
    Permission.PROJECT_UPSERT_DRAFT,
    Permission.PROJECT_EDIT_DRAFT,
    Permission.PROJECT_VIEW_CONTENT,
    Permission.PROJECT_MANAGE_USER_STYLE,
    Permission.PROJECT_UPSERT_INSPIRATION,
    Permission.PROJECT_VIEW_INSPIRATION,
    Permission.PROJECT_CREATE_IMAGE,
    Permission.PROJECT_DELETE_IMAGE,
    Permission.PROJECT_VIEW_IMAGE,
  ]),
  [ProjectRole.VIEWER]: new Set([
    Permission.PROJECT_VIEW_CONTENT,
    Permission.PROJECT_VIEW_INSPIRATION,
    Permission.PROJECT_VIEW_IMAGE,
  ]),
}

// --- Helpers ---

export function resolvePermissions(
  orgRole: OrgRole,
  projectRole: ProjectRole
): Set<Permission> {
  return new Set([
    ...(ORG_ROLE_PERMISSIONS[orgRole] ?? []),
    ...(PROJECT_ROLE_PERMISSIONS[projectRole] ?? []),
  ])
}

export function hasPermission(
  orgRole: OrgRole,
  projectRole: ProjectRole,
  permission: Permission
): boolean {
  return resolvePermissions(orgRole, projectRole).has(permission)
}
