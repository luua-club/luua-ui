import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { SOCIAL_PLATFORM } from '@/core/config/constant'
import type { channelType } from '@/core/models/social.model'
import { useCalendar } from '@/posts-view/contexts/calendar-context'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

function PlatformAvatar({
  channel,
  size = 28,
}: {
  channel: channelType
  size?: number
}) {
  const platform = SOCIAL_PLATFORM.find(p => p.name === channel)
  if (!platform) return null
  const Logo = platform.logo
  return (
    <span
      className="bg-background ring-border flex shrink-0 items-center justify-center rounded-full ring-2"
      style={{ width: size, height: size }}
    >
      <Logo width={size * 0.55} height={size * 0.55} />
    </span>
  )
}

function StackedIcons({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center">
      {SOCIAL_PLATFORM.map((platform, i) => {
        const Logo = platform.logo
        return (
          <span
            key={platform.name}
            className="bg-background border-border flex shrink-0 items-center justify-center rounded-full border"
            style={{
              width: size,
              height: size,
              marginLeft: i === 0 ? 0 : -(size * 0.25),
            }}
            title={platform.tooltip}
          >
            <Logo width={size * 0.55} height={size * 0.55} />
          </span>
        )
      })}
    </div>
  )
}

export function SocialFilter() {
  const { selectedChannel, setSelectedChannel } = useCalendar()
  const [open, setOpen] = useState(false)

  const selectedPlatform =
    selectedChannel !== 'all'
      ? SOCIAL_PLATFORM.find(p => p.name === selectedChannel)
      : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="bg-background text-foreground hover:bg-accent/40 flex h-9 cursor-pointer items-center gap-2 rounded-sm border px-3 shadow-xs transition-colors">
          {selectedPlatform ? (
            <PlatformAvatar channel={selectedPlatform.name} size={24} />
          ) : (
            <StackedIcons size={24} />
          )}
          <span className="text-foreground text-sm font-medium">
            {selectedPlatform ? selectedPlatform.name : 'All'}
          </span>
          <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="bg-popover text-popover-foreground w-52 border p-1.5 shadow-lg"
        align="start"
        sideOffset={6}
      >
        {/* All option */}
        <button
          onClick={() => {
            setSelectedChannel('all')
            setOpen(false)
          }}
          className={`text-foreground flex w-full cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors ${
            selectedChannel === 'all' ? 'bg-accent' : 'hover:bg-accent/60'
          }`}
        >
          <StackedIcons size={26} />
          <span className="flex-1 text-left font-medium">All</span>
          {selectedChannel === 'all' && (
            <Check className="text-foreground h-4 w-4 shrink-0" />
          )}
        </button>

        {/* Individual platform options */}
        {SOCIAL_PLATFORM.map(platform => (
          <button
            key={platform.name}
            onClick={() => {
              setSelectedChannel(platform.name)
              setOpen(false)
            }}
            className={`text-foreground flex w-full cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors ${
              selectedChannel === platform.name
                ? 'bg-accent'
                : 'hover:bg-accent/60'
            }`}
          >
            <PlatformAvatar channel={platform.name} size={26} />
            <span className="flex-1 text-left font-medium">
              {platform.name}
            </span>
            {selectedChannel === platform.name && (
              <Check className="text-foreground h-4 w-4 shrink-0" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
