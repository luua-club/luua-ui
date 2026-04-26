import { ChevronDown } from 'lucide-react'

import { AuditLogItem, CATEGORY_LABEL } from '@/core/models/audit-log.model'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/collapsible'

import {
  extractEmailInitial,
  formatAbsoluteTime,
  formatRelativeTime,
  getCategoryForEvent,
  humanizeEventType,
} from '../utils/audit-log.helper'
import AuditLogDetail from './audit-log-detail'

const CATEGORY_DOT: Record<string, string> = {
  content: 'bg-blue-500',
  publishing: 'bg-emerald-500',
  team: 'bg-purple-500',
  autopilot: 'bg-amber-500',
  inspirations: 'bg-pink-500',
  settings: 'bg-slate-500',
  billing: 'bg-rose-500',
  social: 'bg-cyan-500',
  all: 'bg-slate-500',
}

function highlightFor(item: AuditLogItem): string | null {
  const d = item.details ?? {}
  switch (item.event_type) {
    case 'post.published':
    case 'draft.published':
    case 'post.failed':
    case 'social.connected':
    case 'draft.scheduled':
      return typeof d.channel === 'string' ? d.channel : null
    case 'post.generated':
    case 'reply.generated':
    case 'image.generated':
      return typeof item.credits_used === 'number'
        ? `${item.credits_used} credit${item.credits_used === 1 ? '' : 's'}`
        : null
    case 'member.role_changed':
    case 'project.member_role_changed':
      return typeof d.old_role === 'string' && typeof d.new_role === 'string'
        ? `${d.old_role} → ${d.new_role}`
        : null
    case 'member.added':
    case 'project.member_added':
    case 'member.invited':
    case 'member.removed':
    case 'project.member_removed':
      return typeof d.email === 'string' ? d.email : null
    case 'plan.changed':
      return typeof d.old_plan === 'string' && typeof d.new_plan === 'string'
        ? `${d.old_plan} → ${d.new_plan}`
        : null
    default:
      return null
  }
}

interface AuditLogRowProps {
  item: AuditLogItem
}

function AuditLogRow({ item }: AuditLogRowProps) {
  const category = getCategoryForEvent(item.event_type)
  const dot = CATEGORY_DOT[category] ?? CATEGORY_DOT.settings
  const highlight = highlightFor(item)
  const actorLabel = item.is_system
    ? 'System'
    : (item.actor_email ?? item.actor_id)

  return (
    <Collapsible className="group">
      <CollapsibleTrigger className="hover:bg-muted/40 group flex w-full items-center gap-3 rounded-md px-2 py-3 text-left transition-colors">
        {/* Time */}
        <span
          className="text-muted-foreground w-24 shrink-0 text-xs tabular-nums"
          title={formatAbsoluteTime(item.created_at)}
        >
          {formatRelativeTime(item.created_at)}
        </span>

        {/* Actor */}
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          {item.is_system ? (
            <Badge variant="outline" className="text-xs">
              System
            </Badge>
          ) : (
            <>
              <Avatar className="size-6 shrink-0">
                <AvatarFallback className="bg-muted text-[10px] font-medium">
                  {extractEmailInitial(item.actor_email)}
                </AvatarFallback>
              </Avatar>
              <span className="text-foreground hidden max-w-[12rem] truncate text-xs sm:block">
                {actorLabel}
              </span>
            </>
          )}
        </div>

        {/* Category dot + event */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className={`size-2 shrink-0 rounded-full ${dot}`}
            aria-hidden="true"
            title={CATEGORY_LABEL[category]}
          />
          <span className="text-foreground truncate text-sm font-medium">
            {humanizeEventType(item.event_type)}
          </span>
          {highlight && (
            <span className="text-muted-foreground hidden truncate text-xs md:inline">
              · {highlight}
            </span>
          )}
        </div>

        <ChevronDown className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent className="px-2 pt-1 pb-3">
        <AuditLogDetail item={item} />
      </CollapsibleContent>
    </Collapsible>
  )
}

export default AuditLogRow
