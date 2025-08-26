import { Icon, IconProps } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CircleCheckBig,
  Loader2,
  SendHorizontal,
  TriangleAlert,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { SOCIAL_STATUS } from '../config/constant'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { WordRotate } from '../ui/word-rotate'
import { cn } from '../utils'

interface InputPromptProps {
  loading?: boolean | undefined
  placeholder?: string[]
  socialStatus: SOCIAL_STATUS
  socials: {
    icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
    tooltip: string
  }[]
  btnText?: string
  btnIcon?: React.ReactNode
  backdrop?: boolean
  onChange: (value: string) => void
  expandable?: boolean
}

export const InputPrompt: React.FC<InputPromptProps> = ({
  loading = false,
  placeholder = [],
  socialStatus,
  socials = [],
  btnText = 'Generate Post',
  btnIcon = <SendHorizontal className="size-3" />,
  backdrop = false,
  onChange,
  expandable = false,
}) => {
  const [value, setValue] = useState('')
  const divRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState<boolean>(!expandable)
  const fullContainerRef = useRef<HTMLDivElement>(null)

  // Autofocus the editable div when expanded
  useEffect(() => {
    if (expandable && expanded && divRef.current) {
      const t = setTimeout(() => divRef.current?.focus(), 0)
      return () => clearTimeout(t)
    }
  }, [expandable, expanded])

  // Collapse back to preview if focus moves outside the full container
  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!expandable) return
    const next = e.relatedTarget as Node | null
    const container = fullContainerRef.current
    if (container && next && container.contains(next)) return
    setExpanded(false)
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || ''
    setValue(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (loading) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGeneratePost()
    }
  }

  const handleGeneratePost = () => {
    if (loading) return

    if (value.trim()) {
      onChange(value.trim())

      if (divRef.current) {
        divRef.current.textContent = ''
        setValue('')
      }
    }
  }

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-sm border-1',
        backdrop &&
          'rounded-lg border border-gray-200/50 bg-white/80 shadow-lg shadow-black/5 backdrop-blur-md'
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        {expandable && !expanded ? (
          <motion.div
            key="preview"
            tabIndex={0}
            role="textbox"
            aria-label="Open prompt input"
            onClick={() => setExpanded(true)}
            className="flex cursor-pointer items-center justify-between rounded-sm px-0 py-2 pr-2 text-gray-600 md:px-3 md:pr-3"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.09, ease: 'easeOut', type: 'tween' }}
            style={{ willChange: 'opacity, transform' }}
          >
            <div className="flex items-center gap-2">
              <WordRotate
                words={
                  loading
                    ? ['Generating AI post...', 'Hold still...']
                    : placeholder
                }
                duration={3000}
                className="pointer-events-none hidden text-xs font-light select-none md:block"
              />
              <p className="text-xs font-light select-none md:hidden">
                {loading ? 'Hold still...' : 'Start with a prompt'}
              </p>
            </div>
            <Button
              variant={'outline'}
              size={'sm'}
              className={cn(
                'text-xs',
                loading ? 'bg-accent !cursor-default' : ''
              )}
            >
              {btnText}
              {loading ? <Loader2 className="size-3 animate-spin" /> : btnIcon}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.11, ease: 'easeOut', type: 'tween' }}
            style={{ willChange: 'opacity, transform' }}
            ref={fullContainerRef}
            onBlurCapture={handleContainerBlur}
            onAnimationComplete={() => {
              // Focus after the enter animation completes to ensure node is mounted
              if (expandable && expanded) divRef.current?.focus()
            }}
          >
            <div className="relative">
              <div
                ref={divRef}
                contentEditable={true}
                role="textbox"
                aria-multiline={true}
                spellCheck={true}
                tabIndex={0}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                className={cn(
                  'max-h-70 min-h-24 min-w-72 overflow-y-auto px-3 py-4 text-sm text-gray-600 outline-none'
                )}
                suppressContentEditableWarning
              />
              {!value && (
                <WordRotate
                  words={
                    loading
                      ? ['Generating AI post...', 'Hold still...']
                      : placeholder
                  }
                  duration={3000}
                  className="pointer-events-none absolute top-4 left-3 text-sm font-light text-gray-400 select-none"
                />
              )}
            </div>
            <hr />
            <PromptControls
              loading={loading}
              socialStatus={socialStatus}
              socials={socials}
              handleGeneratePost={handleGeneratePost}
              btnText={btnText}
              btnIcon={btnIcon}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type PromptControlsType = Omit<InputPromptProps, 'placeholder' | 'onChange'> & {
  handleGeneratePost: () => void
}

const PromptControls: React.FC<PromptControlsType> = ({
  loading,
  socialStatus,
  socials,
  handleGeneratePost,
  btnText,
  btnIcon,
}) => {
  return (
    <div className="flex justify-between p-2">
      <div className="flex items-center justify-center gap-1">
        <div className="flex -space-x-2">
          {socials.map((social, index) => (
            <Tooltip key={index}>
              <TooltipTrigger>
                <div className="rounded-full border-1 border-dashed p-2">
                  <social.icon className="size-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <span>{social.tooltip}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        {socialStatus === SOCIAL_STATUS.OK ? (
          <Tooltip>
            <TooltipTrigger>
              <CircleCheckBig className="size-3 animate-pulse text-green-600" />
            </TooltipTrigger>
            <TooltipContent>
              <span>Social connection - OK</span>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <TriangleAlert className="size-3 animate-pulse text-yellow-600" />
            </TooltipTrigger>
            <TooltipContent>
              <span>Warning: Issue with one or more social connection</span>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Button
        variant={'outline'}
        size={'sm'}
        className={cn('text-xs', loading ? 'bg-accent !cursor-default' : '')}
        onClick={handleGeneratePost}
      >
        {btnText}
        {loading ? <Loader2 className="size-3 animate-spin" /> : btnIcon}
      </Button>
    </div>
  )
}
