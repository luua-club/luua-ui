import { Icon, IconProps } from '@tabler/icons-react'
import {
  CircleCheckBig,
  Loader2,
  SendHorizontal,
  TriangleAlert,
} from 'lucide-react'
import React, { useRef, useState } from 'react'

import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { WordRotate } from '../ui/word-rotate'
import { cn } from '../utils'

interface InputPromptProps {
  loading?: boolean | undefined
  placeholder?: string[]
  socialStatus: 'OK' | 'WARNING'
  socials: {
    icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
    tooltip: string
  }[]
  onChange: (value: string) => void
}

export const InputPrompt: React.FC<InputPromptProps> = ({
  loading = false,
  placeholder = [],
  socialStatus,
  socials = [],
  onChange,
}) => {
  const [value, setValue] = useState('')
  const divRef = useRef<HTMLDivElement>(null)

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || ''
    setValue(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onChange(value.trim())
      }
    }
  }

  return (
    <div className={'relative flex flex-col rounded-sm border-1'}>
      <div className="relative">
        <div
          ref={divRef}
          contentEditable={!loading}
          role="textbox"
          aria-multiline="true"
          spellCheck={true}
          tabIndex={0}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className={cn(
            'max-h-70 min-h-24 min-w-72 overflow-y-auto px-3 py-4 text-sm outline-none',
            loading ? 'text-gray-400' : 'text-gray-600'
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
      ></PromptControls>
    </div>
  )
}

type PromptControlsType = Omit<InputPromptProps, 'placeholder' | 'onChange'>

const PromptControls: React.FC<PromptControlsType> = ({
  loading,
  socialStatus,
  socials,
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
        {socialStatus === 'OK' ? (
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
      >
        Generate Post
        {loading ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <SendHorizontal className="size-3" />
        )}
      </Button>
    </div>
  )
}
