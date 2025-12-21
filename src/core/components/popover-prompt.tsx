import { Globe, Loader2, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { RainbowButton } from '@/shared/ui/rainbow-button'
import { Switch } from '@/shared/ui/switch'
import { Textarea } from '@/shared/ui/textarea'
import { WordRotate } from '@/shared/ui/word-rotate'
import { cn } from '@/shared/utils'

import { EDIT_PROMPT_TEXT, SUGGESTED_PROMPT_TEXT } from '../config/constant'

interface PopoverPromptProps {
  disabled?: boolean
  isUserAgainGenerating: boolean
  loading: boolean
  onSubmit: (value: string, isSearchEnabled: boolean) => void
}

function PopoverPrompt(props: PopoverPromptProps) {
  // --- State ---
  const [prompt, setPrompt] = useState('')
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [hoverPreview, setHoverPreview] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  // --- Functions ---
  const handleSubmit = (value: string) => {
    props.onSubmit(value, searchEnabled)
    setPrompt('')
    setSearchEnabled(false)
    setHoverPreview(null)
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={isOpen => !props.loading && setOpen(isOpen)}
    >
      {/** Trigger for popover */}
      <PopoverTrigger asChild>
        <RainbowButton
          variant={'default'}
          size="sm"
          className="rounded-sm"
          disabled={props.disabled}
        >
          {props.loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              <Sparkles className="size-3.5" /> Luua AI
            </>
          )}
        </RainbowButton>
      </PopoverTrigger>

      {/** Content for popover */}
      <PopoverContent className="w-min min-w-72 p-0 shadow-lg sm:w-md">
        <div className="relative">
          {/** Textarea for prompt */}
          <motion.div
            animate={{
              opacity: hoverPreview && !prompt ? 0 : 1,
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Textarea
              className={cn(
                'min-h-32 resize-none p-4 text-sm',
                'border-0',
                'caret-primary selection:bg-black selection:text-white',
                'transition-colors duration-200',
                'focus:border-0 focus:shadow-none focus:ring-0 focus:outline-none',
                'focus-visible:border-0 focus-visible:border-none focus-visible:shadow-none focus-visible:ring-0',
                'max-h-60 overflow-y-auto'
              )}
              value={prompt}
              onChange={e => {
                setPrompt(e.target.value)
              }}
            />
          </motion.div>

          {/** Placeholder for prompt */}
          <AnimatePresence>
            {!prompt && !hoverPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="pointer-events-none absolute top-4 left-3 px-1"
              >
                <WordRotate
                  words={
                    props.loading
                      ? ['Generating AI post...', 'Hold still...']
                      : props.isUserAgainGenerating
                        ? SUGGESTED_PROMPT_TEXT
                        : EDIT_PROMPT_TEXT
                  }
                  duration={3000}
                  className="text-sm text-gray-400 select-none dark:text-gray-300"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/** Preview for prompt */}
          <AnimatePresence>
            {hoverPreview && !prompt && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={cn(
                  'pointer-events-none absolute inset-0 px-4 py-4 text-sm font-medium select-none',
                  'text-primary/70 dark:text-primary/60',
                  'overflow-hidden'
                )}
                style={
                  {
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical' as const,
                  } as React.CSSProperties
                }
              >
                {hoverPreview}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/** Divider */}
        <hr />

        {/** Prompt Actions */}
        <div className="flex items-center justify-between p-2">
          {/** Search Switch */}
          <div className="flex items-center gap-2">
            <Switch
              className="cursor-pointer"
              checked={searchEnabled}
              onCheckedChange={() => setSearchEnabled(!searchEnabled)}
            />
            <span
              className={cn(
                'flex items-center gap-2 text-xs font-semibold text-gray-500 transition-colors ease-in-out dark:font-medium dark:text-gray-300',
                searchEnabled && 'text-gray-700 dark:text-gray-100'
              )}
            >
              <span className="hidden sm:block">Web Search</span>
              <Globe className="size-3.5" />
            </span>
          </div>

          {/** Submit Button */}
          <Button
            size={'sm'}
            className="text-xs"
            onClick={() => handleSubmit(prompt)}
          >
            Go <Sparkles className="size-3.5" />
          </Button>
        </div>

        {/** Divider */}
        <hr />

        {/** TODO: Commenting for now, Example Prompts */}
        {/*<p className="text-foreground px-3 pt-3 text-xs font-medium">
          Out of ideas? Steal one of ours 😎
        </p>

        <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2">
          <PromptChip
            data={standardPrompts}
            onChipClick={value => handleSubmit(value)}
            onHoverPreview={setHoverPreview}
          />
          <PromptChip
            data={youtubePrompts}
            onChipClick={value => handleSubmit(value)}
            onHoverPreview={setHoverPreview}
          />
          <PromptChip
            data={linkedinPrompts}
            onChipClick={value => handleSubmit(value)}
            onHoverPreview={setHoverPreview}
          />
          <PromptChip
            data={twitterPrompts}
            onChipClick={value => handleSubmit(value)}
            onHoverPreview={setHoverPreview}
          />
        </div>*/}
      </PopoverContent>
    </Popover>
  )
}

export default PopoverPrompt
