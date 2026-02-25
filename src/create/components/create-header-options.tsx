import { ChevronDown, Save } from 'lucide-react'
import { type ComponentType, useState } from 'react'

import { SOCIAL_PLATFORM } from '@/core/config/constant'
import type { channelType } from '@/core/models/social.model'
import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Switch } from '@/shared/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

type SocialTab = channelType | 'all'

interface CreateSocialTabsProps {
  selected?: SocialTab
  onChange?: (tab: SocialTab) => void
}

interface TabItem {
  id: SocialTab
  label: string
  logo?: ComponentType<{ width?: number; height?: number }>
}

function SocialPickerPopover({
  enabled,
  onToggle,
}: {
  enabled: Set<channelType>
  onToggle: (name: channelType) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="bg-background border-border hover:bg-accent/40 flex cursor-pointer items-center gap-1.5 rounded-sm border px-2 py-1.5 shadow-xs transition-colors dark:bg-transparent">
          <div className="flex items-center">
            {SOCIAL_PLATFORM.filter(p =>
              enabled.has(p.name as channelType)
            ).map((platform, i) => {
              const Logo = platform.logo
              return (
                <span
                  key={platform.name}
                  className="bg-background border-border flex shrink-0 items-center justify-center rounded-full border"
                  style={{
                    width: 22,
                    height: 22,
                    marginLeft: i === 0 ? 0 : -5,
                  }}
                  title={platform.tooltip}
                >
                  <Logo width={12} height={12} />
                </span>
              )
            })}
            {enabled.size === 0 && (
              <span className="text-muted-foreground text-xs">None</span>
            )}
          </div>
          <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="bg-popover text-popover-foreground w-52 border p-1.5 shadow-lg"
        align="start"
        sideOffset={6}
      >
        {SOCIAL_PLATFORM.map(platform => {
          const Logo = platform.logo
          const isEnabled = enabled.has(platform.name as channelType)
          return (
            <div
              key={platform.name}
              className="flex items-center gap-3 rounded-md px-2.5 py-2"
            >
              <span
                className="bg-background border-border flex shrink-0 items-center justify-center rounded-full border"
                style={{ width: 26, height: 26 }}
              >
                <Logo width={14} height={14} />
              </span>
              <span className="text-foreground flex-1 text-sm font-medium">
                {platform.label}
              </span>
              <Switch
                checked={isEnabled}
                onCheckedChange={() => onToggle(platform.name as channelType)}
              />
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

export function CreateHeaderOptions({
  selected,
  onChange,
}: CreateSocialTabsProps) {
  const [enabledSocials, setEnabledSocials] = useState<Set<channelType>>(
    new Set(SOCIAL_PLATFORM.map(p => p.name as channelType))
  )
  const [activeTab, setActiveTab] = useState<SocialTab>(selected ?? 'all')

  function handleToggle(name: channelType) {
    setEnabledSocials(prev => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
        if (next.size === 1) {
          // Auto-switch to the only remaining social
          const remaining = [...next][0]
          setActiveTab(remaining)
          onChange?.(remaining)
        } else if (activeTab === name) {
          setActiveTab('all')
          onChange?.('all')
        }
      } else {
        next.add(name)
      }
      return next
    })
  }

  function handleSelect(tab: SocialTab) {
    setActiveTab(tab)
    onChange?.(tab)
  }

  const onlyOne = enabledSocials.size === 1

  const tabs: TabItem[] = [
    { id: 'all', label: 'All' },
    ...SOCIAL_PLATFORM.filter(p =>
      enabledSocials.has(p.name as channelType)
    ).map(p => ({ id: p.name as channelType, label: p.label, logo: p.logo })),
  ]

  return (
    <div className="bg-background dark:bg-card flex items-center gap-2 border-b px-3 py-2 sm:gap-3 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto sm:gap-3 [&::-webkit-scrollbar]:hidden">
        <SocialPickerPopover enabled={enabledSocials} onToggle={handleToggle} />

        <Tabs
          value={activeTab}
          onValueChange={v => handleSelect(v as SocialTab)}
        >
          <TabsList className="bg-muted dark:bg-card rounded-sm border">
            {tabs.map(tab => {
              const Logo = tab.logo
              const isAllDisabled = tab.id === 'all' && onlyOne
              const trigger = (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={isAllDisabled}
                  className="dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground rounded-sm"
                >
                  {Logo && <Logo width={13} height={13} />}
                  <span className={Logo ? 'hidden sm:inline' : undefined}>
                    {tab.label}
                  </span>
                </TabsTrigger>
              )

              if (isAllDisabled) {
                return (
                  <Tooltip key={tab.id}>
                    <TooltipTrigger asChild>
                      <span className="cursor-not-allowed">{trigger}</span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Enable at least 2 socials to use All
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return trigger
            })}
          </TabsList>
        </Tabs>
      </div>

      <Button variant="outline" size="sm" className="shrink-0">
        <Save className="size-3.5" /> Save
      </Button>
    </div>
  )
}
