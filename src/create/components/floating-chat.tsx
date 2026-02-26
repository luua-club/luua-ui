import { ArrowUp, Check, ChevronDown, Globe, Loader2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import luuaIcon from '@/assets/logos/luua-icon-logo.svg'
import { generateApi } from '@/core/api/generate-post.api'
import { AppIconLogo } from '@/core/components/app-logo'
import { SOCIAL_PLATFORM } from '@/core/config/constant'
import {
  linkedinPrompts,
  standardPrompts,
  twitterPrompts,
  youtubePrompts,
} from '@/core/config/example-prompts.config'
import type { channelType } from '@/core/models/social.model'
import PromptChip from '@/shared/components/prompt-chip'
import { Button } from '@/shared/ui/button'
import { NoiseBackground } from '@/shared/ui/noise-background'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from '@/shared/ui/prompt-input'
import { Switch } from '@/shared/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

// ── Dummy response for testing ────────────────────────────────────────────────
const DUMMY_RESPONSE = {
  message: `## Great insights on this topic!

**Here's a quick breakdown:**
- AI writing tools reduce content creation time by up to **70%**
- Consistent posting on LinkedIn increases profile views by **5x**
- Short-form threads on X drive **3x** more engagement than single posts

### Suggested approach:
1. Start with a compelling hook in the first line
2. Use bullet points for scannability
3. End with a clear call-to-action

Want me to generate a full post based on this?`,
  is_error: false,
}

// ── Types ─────────────────────────────────────────────────────────────────────
type ChannelFilter = channelType | 'all'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  isError?: boolean
}

// ── Sub-components ────────────────────────────────────────────────────────────
function PlatformAvatar({
  channel,
  size = 22,
}: {
  channel: channelType
  size?: number
}) {
  const platform = SOCIAL_PLATFORM.find(p => p.name === channel)
  if (!platform) return null
  const Logo = platform.logo
  return (
    <span
      className="bg-background ring-border flex shrink-0 items-center justify-center rounded-full ring-1"
      style={{ width: size, height: size }}
    >
      <Logo width={size * 0.55} height={size * 0.55} />
    </span>
  )
}

function StackedIcons({ size = 22 }: { size?: number }) {
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
          >
            <Logo width={size * 0.55} height={size * 0.55} />
          </span>
        )
      })}
    </div>
  )
}

const THINKING_LABELS = [
  'Thinking…',
  'Coalescing…',
  'Crafting…',
  'Brewing ideas…',
  'Processing…',
  'Weaving words…',
  'Generating…',
  'Analyzing…',
  'Composing…',
  'Almost there…',
]

function ThinkingIndicator() {
  const [label, setLabel] = useState(
    () => THINKING_LABELS[Math.floor(Math.random() * THINKING_LABELS.length)]
  )

  useEffect(() => {
    const cycle = () => {
      setLabel(
        THINKING_LABELS[Math.floor(Math.random() * THINKING_LABELS.length)]
      )
    }
    const interval = setInterval(cycle, 1800 + Math.random() * 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.p
      key={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="text-muted-foreground px-1 py-2 text-xs"
    >
      {label}
    </motion.p>
  )
}

// Minimal inline markdown renderer — handles ## headers, **bold**, - bullets, 1. lists
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  )
}

function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        if (line.startsWith('## '))
          return (
            <p key={idx} className="text-foreground mt-2 text-xs font-semibold">
              {renderInline(line.slice(3))}
            </p>
          )
        if (line.startsWith('### '))
          return (
            <p
              key={idx}
              className="text-foreground mt-1.5 text-xs font-semibold tracking-wide uppercase"
            >
              {renderInline(line.slice(4))}
            </p>
          )
        if (line.startsWith('- '))
          return (
            <div key={idx} className="flex gap-1.5">
              <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
              <span>{renderInline(line.slice(2))}</span>
            </div>
          )
        const numbered = line.match(/^(\d+)\. (.+)/)
        if (numbered)
          return (
            <div key={idx} className="flex gap-1.5">
              <span className="text-muted-foreground shrink-0 tabular-nums">
                {numbered[1]}.
              </span>
              <span>{renderInline(numbered[2])}</span>
            </div>
          )
        if (line.trim() === '') return <div key={idx} className="h-1" />
        return <p key={idx}>{renderInline(line)}</p>
      })}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
interface FloatingChatProps {
  onPostsGenerated?: (content: string, channel: channelType) => void
  onGeneratingChange?: (isGenerating: boolean) => void
  channel?: ChannelFilter
  onChannelChange?: (channel: ChannelFilter) => void
}

export function FloatingChat({
  onPostsGenerated,
  onGeneratingChange,
  channel = 'all',
  onChannelChange,
}: FloatingChatProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [channelOpen, setChannelOpen] = useState(false)

  const setChannel = (value: ChannelFilter) => onChannelChange?.(value)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const selectedPlatform =
    channel !== 'all' ? SOCIAL_PLATFORM.find(p => p.name === channel) : null

  // Auto-scroll to bottom on new messages / loading
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSubmit = async () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return

    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', content: trimmed },
    ])
    setValue('')
    setIsLoading(true)
    onGeneratingChange?.(true)

    try {
      const res = await generateApi.generatePost({
        user_prompt: trimmed,
        is_search_enabled: searchEnabled,
        post_channels: channel === 'all' ? undefined : [channel],
      })

      // Populate post editors with generated content
      if (res.data.generated_linkedin_post?.content) {
        onPostsGenerated?.(res.data.generated_linkedin_post.content, 'LinkedIn')
      }
      if (res.data.generated_twitter_post?.content) {
        onPostsGenerated?.(res.data.generated_twitter_post.content, 'Twitter')
      }

      // llm_response not yet in API — hardcode a confirmation message
      const channels = [
        res.data.generated_linkedin_post && 'LinkedIn',
        res.data.generated_twitter_post && 'X / Twitter',
      ]
        .filter(Boolean)
        .join(' & ')

      const llm = res.data.llm_response ?? {
        message: channels
          ? `Done! I've generated your **${channels}** post${channels.includes('&') ? 's' : ''}. Check the editor above.`
          : (res.data.fallback_message ?? DUMMY_RESPONSE.message),
        is_error: false,
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: llm.message,
          isError: llm.is_error,
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
      onGeneratingChange?.(false)
    }
  }

  const hasMessages = messages.length > 0

  return (
    <TooltipProvider>
      {/* FAB */}
      {!open && (
        <motion.div
          className="fixed right-6 bottom-6 z-50"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
        >
          <NoiseBackground
            containerClassName="w-fit rounded-full p-2"
            gradientColors={[
              'rgb(255, 100, 150)',
              'rgb(100, 150, 255)',
              'rgb(255, 200, 100)',
            ]}
          >
            <button
              onClick={() => setOpen(prev => !prev)}
              className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 py-1 text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
              aria-label="Open AI chat"
              type="button"
            >
              <span className="inline-flex items-center gap-2 text-xs">
                <AppIconLogo className="!size-3" />
                Generate with Luua AI
              </span>
            </button>
          </NoiseBackground>
        </motion.div>
      )}

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="floating-chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'fixed right-4 bottom-4 z-50',
              'min-h-[480px] w-[380px] md:w-[460px]',
              'bg-card rounded-xl border shadow-xl',
              'flex flex-col overflow-hidden'
            )}
          >
            {/* Close */}
            <div className="flex justify-end px-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground size-7"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Body — welcome or chat thread */}
            <AnimatePresence mode="wait">
              {!hasMessages ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 flex-col gap-5 px-5 pb-4"
                >
                  <div className="flex flex-col items-start gap-3">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-full border select-none">
                      <img src={luuaIcon} alt="Luua" className="size-5" />
                    </div>
                    <p className="text-foreground text-base font-semibold">
                      How can I help you today?
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <PromptChip
                      data={standardPrompts}
                      onChipClick={v => setValue(v)}
                    />
                    <PromptChip
                      data={youtubePrompts}
                      onChipClick={v => setValue(v)}
                    />
                    <PromptChip
                      data={linkedinPrompts}
                      onChipClick={v => setValue(v)}
                    />
                    <PromptChip
                      data={twitterPrompts}
                      onChipClick={v => setValue(v)}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  ref={scrollRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex max-h-[420px] flex-1 flex-col gap-3 overflow-y-auto px-4 pt-2 pb-2"
                >
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-2.5',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.role === 'assistant' && (
                        <div className="bg-muted mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border select-none">
                          <img src={luuaIcon} alt="Luua" className="size-3.5" />
                        </div>
                      )}

                      <div
                        className={cn(
                          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs break-all',
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : msg.isError
                              ? 'bg-destructive/10 text-destructive border-destructive/20 border'
                              : 'bg-muted/60 text-foreground',
                          msg.role === 'assistant' && 'bg-muted'
                        )}
                      >
                        {msg.role === 'assistant' && !msg.isError ? (
                          <MarkdownMessage content={msg.content} />
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start gap-2.5">
                      <div className="bg-muted mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs select-none">
                        ✦
                      </div>
                      <div className="bg-muted rounded-2xl px-3.5 py-1">
                        <ThinkingIndicator />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="px-3 pt-2 pb-3">
              <PromptInput
                value={value}
                onValueChange={setValue}
                onSubmit={handleSubmit}
                maxHeight={160}
                className="border-input bg-muted/40 rounded-xl px-1 py-1 shadow-none"
              >
                <PromptInputTextarea
                  placeholder="Do anything with AI..."
                  className="px-2 text-xs"
                />

                <PromptInputActions className="items-center justify-between px-2 pb-1">
                  {/* Channel filter */}
                  <Popover open={channelOpen} onOpenChange={setChannelOpen}>
                    <PopoverTrigger asChild>
                      <button className="hover:bg-accent text-foreground flex cursor-pointer items-center gap-1.5 rounded-md border bg-transparent px-2 py-1 text-xs font-medium transition-colors outline-none">
                        {selectedPlatform ? (
                          <PlatformAvatar channel={selectedPlatform.name} />
                        ) : (
                          <StackedIcons />
                        )}
                        <span>
                          {selectedPlatform ? selectedPlatform.label : 'All'}
                        </span>
                        <ChevronDown className="text-muted-foreground size-3" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="bg-popover w-44 border p-1.5 shadow-lg"
                      align="start"
                      side="top"
                    >
                      <button
                        onClick={() => {
                          setChannel('all')
                          setChannelOpen(false)
                        }}
                        className={cn(
                          'text-foreground flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-xs transition-colors',
                          channel === 'all' ? 'bg-accent' : 'hover:bg-accent/60'
                        )}
                      >
                        <StackedIcons />
                        <span className="flex-1 text-left font-medium">
                          All
                        </span>
                        {channel === 'all' && (
                          <Check className="size-3.5 shrink-0" />
                        )}
                      </button>
                      {SOCIAL_PLATFORM.map(platform => (
                        <button
                          key={platform.name}
                          onClick={() => {
                            setChannel(platform.name)
                            setChannelOpen(false)
                          }}
                          className={cn(
                            'text-foreground flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-xs transition-colors',
                            channel === platform.name
                              ? 'bg-accent'
                              : 'hover:bg-accent/60'
                          )}
                        >
                          <PlatformAvatar channel={platform.name} />
                          <span className="flex-1 text-left font-medium">
                            {platform.label}
                          </span>
                          {channel === platform.name && (
                            <Check className="size-3.5 shrink-0" />
                          )}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>

                  {/* Right */}
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5">
                          <Switch
                            className="h-4 w-7 cursor-pointer"
                            checked={searchEnabled}
                            onCheckedChange={setSearchEnabled}
                          />
                          <Globe
                            className={cn(
                              'size-3.5 transition-colors',
                              searchEnabled
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">Web Search</TooltipContent>
                    </Tooltip>

                    <Button
                      size="icon"
                      className="size-7 rounded-full"
                      disabled={!value.trim() || isLoading}
                      onClick={handleSubmit}
                    >
                      {isLoading ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <ArrowUp className="size-4" />
                      )}
                    </Button>
                  </div>
                </PromptInputActions>
              </PromptInput>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  )
}
