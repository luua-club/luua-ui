import { Home, Pencil, Plus, X } from 'lucide-react'

import RenameDraftPopover from '@/creation/components/rename-draft-popover'
import {
  CreationSavedDraftTab,
  CreationTabId,
} from '@/creation/models/creation-tab.model'
import { cn } from '@/shared/utils'

interface CreationTabsBarProps {
  activeTabId: CreationTabId
  hasUntitled: boolean
  savedDrafts: CreationSavedDraftTab[]
  onHomeClick: () => void
  onUntitledClick: () => void
  onCloseUntitled: () => void
  onSavedDraftClick: (draftId: string) => void
  onCloseSavedDraft: (draftId: string) => void
  onRenameSavedDraft: (draftId: string, name: string) => void
  isRenaming?: boolean
  onOpenNew: () => void
}

function CreationTabsBar({
  activeTabId,
  hasUntitled,
  savedDrafts,
  onHomeClick,
  onUntitledClick,
  onCloseUntitled,
  onSavedDraftClick,
  onCloseSavedDraft,
  onRenameSavedDraft,
  isRenaming = false,
  onOpenNew,
}: CreationTabsBarProps) {
  return (
    <div className="bg-background sticky top-0 z-10 border-b">
      {/* Row 1: Browser-style tab strip */}
      <div className="bg-muted/40 flex items-stretch">
        {/* Home tab */}
        <button
          onClick={onHomeClick}
          className={cn(
            'flex h-9 min-w-12 cursor-pointer items-center justify-center border-r px-4 text-sm transition-colors',
            activeTabId === 'home'
              ? 'bg-background text-foreground'
              : 'text-muted-foreground hover:bg-background/60'
          )}
        >
          <Home className="size-4" />
        </button>

        {/* Untitled tab */}
        {hasUntitled && (
          <button
            onClick={onUntitledClick}
            className={cn(
              'group flex h-9 max-w-52 min-w-36 cursor-pointer items-center gap-2 border-r px-3 text-sm transition-colors',
              activeTabId === 'untitled'
                ? 'bg-background text-foreground'
                : 'text-muted-foreground hover:bg-background/60'
            )}
          >
            <span className="flex-1 truncate text-left">Untitled</span>
            <button
              type="button"
              aria-label="Close untitled tab"
              onClick={e => {
                e.stopPropagation()
                onCloseUntitled()
              }}
              className="hover:bg-muted ml-auto cursor-pointer rounded p-0.5"
            >
              <X className="size-3" />
            </button>
          </button>
        )}

        {/* Saved draft tabs */}
        {savedDrafts.map(draft => (
          <div
            key={draft.id}
            role="button"
            tabIndex={0}
            onClick={e => {
              if (e.defaultPrevented) return
              onSavedDraftClick(draft.id)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSavedDraftClick(draft.id)
              }
            }}
            className={cn(
              'focus-visible:ring-ring flex h-9 max-w-52 min-w-36 cursor-pointer items-center gap-2 border-r px-3 text-sm transition-colors focus-visible:ring-1 focus-visible:outline-none',
              activeTabId === `draft:${draft.id}`
                ? 'bg-background text-foreground'
                : 'text-muted-foreground hover:bg-background/60'
            )}
          >
            <span className="flex-1 truncate text-left">
              {draft.name || 'Untitled'}
            </span>
            <RenameDraftPopover
              initialName={draft.name || 'Untitled'}
              isSaving={isRenaming}
              onSave={name => onRenameSavedDraft(draft.id, name)}
            >
              <button
                type="button"
                aria-label="Rename tab"
                onPointerDown={e => {
                  e.stopPropagation()
                }}
                onMouseDown={e => {
                  e.stopPropagation()
                }}
                onClick={e => {
                  e.stopPropagation()
                }}
                className="hover:bg-muted cursor-pointer rounded p-0.5"
              >
                <Pencil className="size-3" />
              </button>
            </RenameDraftPopover>
            <button
              type="button"
              aria-label="Close tab"
              onClick={e => {
                e.stopPropagation()
                onCloseSavedDraft(draft.id)
              }}
              className="hover:bg-muted ml-auto cursor-pointer rounded p-0.5"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}

        {/* New tab button */}
        {!hasUntitled && savedDrafts.length === 0 && (
          <button
            onClick={onOpenNew}
            className="bg-primary/2 text-primary hover:bg-primary/5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border-r transition-colors"
          >
            <Plus className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default CreationTabsBar
