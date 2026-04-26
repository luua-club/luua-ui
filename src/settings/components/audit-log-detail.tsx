import { useState } from 'react'

import { AuditLogItem } from '@/core/models/audit-log.model'

type DetailField = { label: string; value: React.ReactNode; tone?: 'error' }

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  return null
}

function asArray<T = unknown>(value: unknown): T[] | null {
  return Array.isArray(value) ? (value as T[]) : null
}

function fieldsForEvent(item: AuditLogItem): DetailField[] {
  const d = item.details ?? {}
  const fields: DetailField[] = []

  switch (item.event_type) {
    case 'post.generated':
    case 'reply.generated':
    case 'image.generated': {
      const prompt = asString(d.prompt)
      if (prompt) fields.push({ label: 'Prompt', value: prompt })
      if (typeof d.search_enabled === 'boolean') {
        fields.push({
          label: 'Web search',
          value: d.search_enabled ? 'On' : 'Off',
        })
      }
      if (typeof item.credits_used === 'number') {
        fields.push({ label: 'Credits used', value: item.credits_used })
      }
      break
    }
    case 'post.published':
    case 'draft.published': {
      const channel = asString(d.channel)
      if (channel) fields.push({ label: 'Channel', value: channel })
      const externalId = asString(d.external_id)
      if (externalId) fields.push({ label: 'External ID', value: externalId })
      const postIds = asArray<string>(d.post_ids)
      if (postIds && postIds.length > 0) {
        fields.push({ label: 'Post IDs', value: postIds.join(', ') })
      }
      break
    }
    case 'draft.scheduled': {
      const channel = asString(d.channel)
      if (channel) fields.push({ label: 'Channel', value: channel })
      const scheduledAt = asString(d.scheduled_at)
      if (scheduledAt) {
        fields.push({
          label: 'Scheduled for',
          value: new Date(scheduledAt).toLocaleString(),
        })
      }
      break
    }
    case 'post.failed': {
      const channel = asString(d.channel)
      if (channel) fields.push({ label: 'Channel', value: channel })
      const error = asString(d.error_message) ?? asString(d.error)
      if (error) fields.push({ label: 'Error', value: error, tone: 'error' })
      break
    }
    case 'member.added':
    case 'project.member_added':
    case 'member.invited': {
      const email = asString(d.email)
      if (email) fields.push({ label: 'Email', value: email })
      const role = asString(d.role)
      if (role) fields.push({ label: 'Role', value: role })
      break
    }
    case 'member.removed':
    case 'project.member_removed': {
      const email = asString(d.email)
      if (email) fields.push({ label: 'Email', value: email })
      break
    }
    case 'member.role_changed':
    case 'project.member_role_changed': {
      const email = asString(d.email)
      if (email) fields.push({ label: 'Email', value: email })
      const oldRole = asString(d.old_role)
      const newRole = asString(d.new_role)
      if (oldRole && newRole) {
        fields.push({ label: 'Role change', value: `${oldRole} → ${newRole}` })
      }
      break
    }
    case 'org.created':
    case 'org.updated': {
      const name = asString(d.org_name) ?? asString(d.name)
      if (name) fields.push({ label: 'Organisation', value: name })
      const plan = asString(d.plan)
      if (plan) fields.push({ label: 'Plan', value: plan })
      break
    }
    case 'project.created':
    case 'project.updated': {
      const name = asString(d.project_name) ?? asString(d.name)
      if (name) fields.push({ label: 'Project', value: name })
      break
    }
    case 'style.updated': {
      if (typeof d.has_text === 'boolean') {
        fields.push({ label: 'Has text', value: d.has_text ? 'Yes' : 'No' })
      }
      if (typeof d.doc_count === 'number') {
        fields.push({ label: 'Documents', value: d.doc_count })
      }
      break
    }
    case 'autopilot.settings_updated':
    case 'autopilot.draft_generated':
    case 'autopilot.no_inspiration_notified': {
      const inspirationId = asString(d.inspiration_id)
      if (inspirationId) {
        fields.push({ label: 'Inspiration ID', value: inspirationId })
      }
      if (typeof d.doc_count === 'number') {
        fields.push({ label: 'Documents', value: d.doc_count })
      }
      if (typeof d.has_text === 'boolean') {
        fields.push({ label: 'Has text', value: d.has_text ? 'Yes' : 'No' })
      }
      break
    }
    case 'inspiration.created':
    case 'inspiration.updated':
    case 'inspiration.deleted': {
      const name = asString(d.name) ?? asString(d.title)
      if (name) fields.push({ label: 'Name', value: name })
      const url = asString(d.url)
      if (url) fields.push({ label: 'URL', value: url })
      break
    }
    case 'social.connected': {
      const channel = asString(d.channel)
      if (channel) fields.push({ label: 'Channel', value: channel })
      const handle = asString(d.handle) ?? asString(d.account)
      if (handle) fields.push({ label: 'Account', value: handle })
      break
    }
    case 'plan.changed': {
      const from = asString(d.old_plan) ?? asString(d.from)
      const to = asString(d.new_plan) ?? asString(d.to)
      if (from && to)
        fields.push({ label: 'Plan change', value: `${from} → ${to}` })
      break
    }
    default:
      break
  }

  return fields
}

function genericFields(details: Record<string, unknown>): DetailField[] {
  return Object.entries(details).map(([key, value]) => ({
    label: key.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()),
    value:
      typeof value === 'object'
        ? JSON.stringify(value)
        : (asString(value) ?? '—'),
  }))
}

interface AuditLogDetailProps {
  item: AuditLogItem
}

function AuditLogDetail({ item }: AuditLogDetailProps) {
  const [showRaw, setShowRaw] = useState(false)
  const fields = fieldsForEvent(item)
  const hasDetails = fields.length > 0
  const fallbackFields = !hasDetails ? genericFields(item.details ?? {}) : []
  const renderable = hasDetails ? fields : fallbackFields

  return (
    <div className="bg-muted/30 border-border space-y-3 rounded-md border p-3 text-sm">
      {item.resource_type && (
        <div className="text-muted-foreground flex gap-2 text-xs">
          <span className="font-medium">Resource</span>
          <span>{item.resource_type}</span>
          {item.resource_id && (
            <>
              <span>·</span>
              <span className="font-mono">{item.resource_id}</span>
            </>
          )}
        </div>
      )}
      {renderable.length === 0 ? (
        <p className="text-muted-foreground text-xs">No additional details.</p>
      ) : (
        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5">
          {renderable.map(field => (
            <div key={field.label} className="contents">
              <dt className="text-muted-foreground text-xs font-medium">
                {field.label}
              </dt>
              <dd
                className={
                  field.tone === 'error'
                    ? 'text-destructive text-xs break-words'
                    : 'text-xs break-words'
                }
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      <div>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground text-xs underline"
          onClick={() => setShowRaw(v => !v)}
        >
          {showRaw ? 'Hide raw' : 'Show raw'}
        </button>
        {showRaw && (
          <pre className="bg-background mt-2 max-h-64 overflow-auto rounded border p-2 text-xs">
            {JSON.stringify(item, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

export default AuditLogDetail
