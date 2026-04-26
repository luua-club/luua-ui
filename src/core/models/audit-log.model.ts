/**
 * Mirrors backend `app/audit/models.py::AuditEventType` and `app/audit/schemas.py`.
 */

export type AuditEventType =
  // Content generation
  | 'post.generated'
  | 'reply.generated'
  | 'image.generated'
  // Draft lifecycle
  | 'draft.published'
  | 'draft.scheduled'
  // Post lifecycle
  | 'post.published'
  | 'post.failed'
  // Autopilot
  | 'autopilot.settings_updated'
  | 'autopilot.draft_generated'
  | 'autopilot.no_inspiration_notified'
  // Inspirations
  | 'inspiration.created'
  | 'inspiration.updated'
  | 'inspiration.deleted'
  // Organization & project
  | 'org.created'
  | 'org.updated'
  | 'project.created'
  | 'project.updated'
  // Style
  | 'style.updated'
  // Social & OAuth
  | 'social.connected'
  // Membership
  | 'project.member_added'
  | 'project.member_removed'
  | 'project.member_role_changed'
  | 'member.added'
  | 'member.removed'
  | 'member.role_changed'
  | 'member.invited'
  // Billing
  | 'plan.changed'

export interface AuditLogItem {
  id: string
  actor_id: string
  actor_email?: string | null
  org_id: string
  project_id?: string | null
  event_type: string
  resource_type: string
  resource_id?: string | null
  credits_used?: number | null
  is_system: boolean
  details: Record<string, unknown>
  created_at: string
}

export interface AuditLogsResponse {
  logs: AuditLogItem[]
  total: number
  limit: number
  offset: number
}

export const AuditCategory = {
  ALL: 'all',
  CONTENT: 'content',
  PUBLISHING: 'publishing',
  TEAM: 'team',
  AUTOPILOT: 'autopilot',
  INSPIRATIONS: 'inspirations',
  SETTINGS: 'settings',
  BILLING: 'billing',
  SOCIAL: 'social',
} as const
export type AuditCategory = (typeof AuditCategory)[keyof typeof AuditCategory]

export const CATEGORY_LABEL: Record<AuditCategory, string> = {
  all: 'All activity',
  content: 'Content',
  publishing: 'Publishing',
  team: 'Team',
  autopilot: 'Autopilot',
  inspirations: 'Inspirations',
  settings: 'Settings',
  billing: 'Billing',
  social: 'Social',
}

/**
 * Map each event type to a category. Events not listed fall back to `settings`.
 */
export const EVENT_CATEGORY: Record<AuditEventType, AuditCategory> = {
  'post.generated': 'content',
  'reply.generated': 'content',
  'image.generated': 'content',
  'draft.published': 'publishing',
  'draft.scheduled': 'publishing',
  'post.published': 'publishing',
  'post.failed': 'publishing',
  'autopilot.settings_updated': 'autopilot',
  'autopilot.draft_generated': 'autopilot',
  'autopilot.no_inspiration_notified': 'autopilot',
  'inspiration.created': 'inspirations',
  'inspiration.updated': 'inspirations',
  'inspiration.deleted': 'inspirations',
  'org.created': 'settings',
  'org.updated': 'settings',
  'project.created': 'settings',
  'project.updated': 'settings',
  'style.updated': 'settings',
  'social.connected': 'social',
  'project.member_added': 'team',
  'project.member_removed': 'team',
  'project.member_role_changed': 'team',
  'member.added': 'team',
  'member.removed': 'team',
  'member.role_changed': 'team',
  'member.invited': 'team',
  'plan.changed': 'billing',
}

/**
 * Human-readable label for each event type.
 */
export const EVENT_LABEL: Record<AuditEventType, string> = {
  'post.generated': 'Post generated',
  'reply.generated': 'Reply generated',
  'image.generated': 'Image generated',
  'draft.published': 'Draft published',
  'draft.scheduled': 'Draft scheduled',
  'post.published': 'Post published',
  'post.failed': 'Post failed',
  'autopilot.settings_updated': 'Autopilot settings updated',
  'autopilot.draft_generated': 'Autopilot draft generated',
  'autopilot.no_inspiration_notified': 'Autopilot inspiration notice',
  'inspiration.created': 'Inspiration added',
  'inspiration.updated': 'Inspiration updated',
  'inspiration.deleted': 'Inspiration removed',
  'org.created': 'Organisation created',
  'org.updated': 'Organisation updated',
  'project.created': 'Project created',
  'project.updated': 'Project updated',
  'style.updated': 'Style updated',
  'social.connected': 'Social account connected',
  'project.member_added': 'Project member added',
  'project.member_removed': 'Project member removed',
  'project.member_role_changed': 'Project role changed',
  'member.added': 'Org member added',
  'member.removed': 'Org member removed',
  'member.role_changed': 'Org role changed',
  'member.invited': 'Member invited',
  'plan.changed': 'Plan changed',
}

export const ALL_EVENT_TYPES = Object.keys(EVENT_LABEL) as AuditEventType[]

/** Event types in a UI category, for server-side `$in` filtering. */
export function getEventTypesForCategory(
  category: AuditCategory
): AuditEventType[] {
  if (category === 'all') return []
  return ALL_EVENT_TYPES.filter(e => EVENT_CATEGORY[e] === category)
}
