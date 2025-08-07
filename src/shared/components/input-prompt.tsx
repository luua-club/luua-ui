import { Icon, IconProps } from '@tabler/icons-react'
import {
  CircleCheckBig,
  Loader2,
  SendHorizontal,
  TriangleAlert,
} from 'lucide-react'
import React, { useRef, useState } from 'react'

import { SOCIAL_STATUS } from '../constant'
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
}) => {
  const [value, setValue] = useState('')
  const divRef = useRef<HTMLDivElement>(null)

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
      <div className="relative">
        <div
          ref={divRef}
          contentEditable={true}
          role="textbox"
          aria-multiline="true"
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
            words={placeholder}
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
      ></PromptControls>
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
