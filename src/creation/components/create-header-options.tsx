import {
  ArrowLeft,
  Eye,
  LayoutGrid,
  PencilLine,
  Rows3,
  SlidersHorizontal,
} from 'lucide-react'

import { SOCIAL_PLATFORM } from '@/core/config/constant'
import type { channelType } from '@/core/models/social.model'
import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Switch } from '@/shared/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { cn } from '@/shared/utils'

type SocialTab = channelType | 'all'
type PreviewMode = 'editor' | 'preview'
type LayoutMode = 'grid' | 'row'

interface CreateSocialTabsProps {
  selected?: SocialTab
  onChange?: (tab: SocialTab) => void
  previewMode?: PreviewMode
  onPreviewModeChange?: (mode: PreviewMode) => void
  layoutMode?: LayoutMode
  onLayoutModeChange?: (mode: LayoutMode) => void
  enabledChannels: channelType[]
  onChannelToggle?: (channel: channelType, enabled: boolean) => void
  onBackToDashboard?: () => void
}

export function CreateHeaderOptions({
  selected = 'all',
  onChange,
  previewMode = 'editor',
  onPreviewModeChange,
  layoutMode = 'grid',
  onLayoutModeChange,
  enabledChannels,
  onChannelToggle,
  onBackToDashboard,
}: CreateSocialTabsProps) {
  function handleSelect(tab: SocialTab) {
    onChange?.(tab)
  }

  const enabledSet = new Set(enabledChannels)

  return (
    <div className="border-border/60 bg-background/95 dark:bg-card/96 flex items-center justify-between gap-2 border-b px-3 py-2.5 sm:gap-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2 overflow-x-auto sm:gap-3 [&::-webkit-scrollbar]:hidden">
        <Button
          variant="link"
          size="sm"
          onClick={onBackToDashboard}
          className="text-foreground/80 hover:text-foreground shrink-0 px-1 text-xs"
        >
          <ArrowLeft className="size-3.5" />
          <span className="hidden lg:inline">Dashboard</span>
        </Button>

        <Tabs
          value={selected}
          onValueChange={v => handleSelect(v as SocialTab)}
          className="min-w-fit"
        >
          <TabsList className="bg-secondary rounded-md border p-1">
            {enabledChannels.length > 1 && (
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background rounded-sm px-3 font-semibold data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-black/5 dark:data-[state=active]:ring-white/15"
              >
                All
              </TabsTrigger>
            )}

            {SOCIAL_PLATFORM.filter(platform =>
              enabledSet.has(platform.name as channelType)
            ).map(platform => {
              const channel = platform.name as channelType
              const Logo = platform.logo

              return (
                <TabsTrigger
                  key={channel}
                  value={channel}
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background rounded-sm px-3 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-black/5 dark:data-[state=active]:ring-white/15"
                >
                  <Logo width={13} height={13} />
                  <span className="hidden lg:inline">{platform.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8"
              aria-label="Toggle socials"
            >
              <SlidersHorizontal className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-2">
            <div className="text-muted-foreground px-2 pb-1 text-xs font-medium">
              Show socials
            </div>
            <div className="space-y-1">
              {SOCIAL_PLATFORM.map(platform => {
                const channel = platform.name as channelType
                const enabled = enabledSet.has(channel)
                const isLastEnabled = enabled && enabledChannels.length === 1
                const Logo = platform.logo

                return (
                  <div
                    key={channel}
                    className="flex items-center justify-between rounded-md px-2 py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <Logo className="size-3.5" />
                      <span className="text-sm">{platform.label}</span>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={val => onChannelToggle?.(channel, val)}
                      disabled={isLastEnabled}
                    />
                  </div>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {selected === 'all' && enabledChannels.length > 2 && (
          <div className="bg-muted/60 dark:bg-card/80 hidden items-center gap-1 rounded-md border p-1 lg:flex">
            <Button
              type="button"
              size="sm"
              variant={layoutMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => onLayoutModeChange?.('grid')}
              className={cn(
                'h-7 px-2 text-xs',
                layoutMode === 'grid'
                  ? 'dark:bg-input/70 dark:text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={layoutMode === 'row' ? 'default' : 'ghost'}
              onClick={() => onLayoutModeChange?.('row')}
              className={cn(
                'h-7 px-2 text-xs',
                layoutMode === 'row'
                  ? 'dark:bg-input/70 dark:text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Rows3 className="size-3.5" />
            </Button>
          </div>
        )}

        <div className="bg-muted/60 dark:bg-card/80 flex items-center gap-1 rounded-md border p-1">
          <Button
            type="button"
            size="sm"
            variant={previewMode === 'editor' ? 'default' : 'ghost'}
            onClick={() => onPreviewModeChange?.('editor')}
            className={cn(
              'h-7 px-2 text-xs',
              previewMode === 'editor'
                ? 'dark:bg-input/70 dark:text-foreground'
                : 'text-muted-foreground'
            )}
          >
            <PencilLine className="size-3.5" />
            <span className="hidden lg:inline">Editor</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={previewMode === 'preview' ? 'default' : 'ghost'}
            onClick={() => onPreviewModeChange?.('preview')}
            className={cn(
              'h-7 px-2 text-xs',
              previewMode === 'preview'
                ? 'dark:bg-input/70 dark:text-foreground'
                : 'text-muted-foreground'
            )}
          >
            <Eye className="size-3.5" />
            <span className="hidden lg:inline">Preview</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
