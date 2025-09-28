import { Link } from '@tanstack/react-router'
import {
  CircleCheckBig,
  Globe,
  Loader2,
  Send,
  TriangleAlert,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { SOCIAL_STATUS } from '../config/constant'
import { InputPromptSocial } from '../models/Input-prompt.model'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Switch } from '../ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { WordRotate } from '../ui/word-rotate'
import { cn } from '../utils'

interface InputPromptProps {
  loading?: boolean
  placeholder?: string[]
  socials: InputPromptSocial[]
  hidePromptInfo?: boolean
  hideAllSocial?: boolean
  activeChannel?: string | null
  className?: string
  onChange: (content: string, search: boolean, channel: string | null) => void
}

export const InputPrompt: React.FC<InputPromptProps> = ({
  loading = false,
  placeholder = [],
  socials = [],
  hidePromptInfo = false,
  hideAllSocial = false,
  activeChannel = null,
  className,
  onChange,
}) => {
  // --- State ---
  const [value, setValue] = useState('')
  const [selectedSocial, setSelectedSocial] = useState<string | null>(null)
  const [searchEnabled, setSearchEnabled] = useState(false)

  // --- Ref ---
  const divRef = useRef<HTMLDivElement>(null)

  // --- Effect ---
  useEffect(() => {
    setSelectedSocial(activeChannel)
  }, [activeChannel])

  // Ensure a single social is always selected when hideAllSocial is true
  useEffect(() => {
    if (hideAllSocial) {
      // If none selected, default to first available social
      if (!selectedSocial) {
        setSelectedSocial(socials[0]?.text ?? null)
      }
    }
  }, [hideAllSocial, socials, selectedSocial])

  // --- Handler ---
  /**
   * Handle input change
   *
   * @param e - React.FormEvent<HTMLDivElement>
   */
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || ''
    setValue(text)
  }

  /**
   * Handle key down
   *
   * @param e - React.KeyboardEvent<HTMLDivElement>
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (loading) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGeneratePost()
    }
  }

  /**
   * Handle generate post
   */
  const handleGeneratePost = () => {
    if (loading) return

    if (value.trim()) {
      onChange(value.trim(), searchEnabled, selectedSocial)

      if (divRef.current) {
        divRef.current.textContent = ''
        setValue('')
      }
    }
  }

  return (
    <div className={cn('z-10 flex flex-col')}>
      <div
        className={cn(
          'bg-card relative flex flex-col rounded-xl border-1',
          className
        )}
      >
        {/* Input */}
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
              'dark:text-card-foreground max-h-40 min-h-18 min-w-72 overflow-y-auto px-3 py-4 text-sm font-medium text-gray-600 outline-none'
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
              className="pointer-events-none absolute top-4 left-3 text-sm font-medium text-gray-600 select-none dark:text-gray-300"
            />
          )}
        </div>

        {/* Prompt Controls */}
        <PromptControls
          loading={loading}
          socials={socials}
          selectedSocial={selectedSocial}
          setSelectedSocial={setSelectedSocial}
          searchEnabled={searchEnabled}
          setSearchEnabled={setSearchEnabled}
          handleGeneratePost={handleGeneratePost}
          hideAllSocial={hideAllSocial}
        />
      </div>

      {/* Prompt Info */}
      {!hidePromptInfo && (
        <PromptInfo socials={socials} selectedSocial={selectedSocial} />
      )}
    </div>
  )
}

interface PromptControlsProps {
  loading: boolean
  socials: InputPromptSocial[]
  selectedSocial: string | null
  setSelectedSocial: (social: string | null) => void
  searchEnabled: boolean
  setSearchEnabled: (search: boolean) => void
  handleGeneratePost: () => void
  hideAllSocial: boolean
}

const PromptControls: React.FC<PromptControlsProps> = ({
  loading,
  socials,
  selectedSocial,
  setSelectedSocial,
  searchEnabled,
  setSearchEnabled,
  handleGeneratePost,
  hideAllSocial,
}) => {
  return (
    <div className="flex items-center justify-between p-2 pt-0">
      {/** Left Side */}
      <div className="flex items-center gap-2">
        <Switch
          className="cursor-pointer"
          checked={searchEnabled}
          onCheckedChange={() => setSearchEnabled(!searchEnabled)}
        />
        <span
          className={cn(
            'flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors ease-in-out dark:font-medium dark:text-gray-300',
            searchEnabled && 'text-gray-700 dark:text-gray-100'
          )}
        >
          <span className="hidden sm:block">Web search</span>
          <Globe className="size-4" />
        </span>
      </div>

      {/** Right Side */}
      <div className="flex items-center">
        {/* Select Socials */}
        <Select
          value={
            hideAllSocial
              ? (selectedSocial ?? socials[0]?.text ?? '')
              : (selectedSocial ?? '__ALL__')
          }
          onValueChange={val =>
            hideAllSocial
              ? setSelectedSocial(val)
              : setSelectedSocial(val === '__ALL__' ? null : val)
          }
        >
          <SelectTrigger
            size="sm"
            className={cn(
              'gap-0.5 bg-transparent! font-semibold text-gray-500 dark:text-gray-300',
              selectedSocial && 'text-gray-700 dark:text-gray-100'
            )}
            style={{ boxShadow: 'none', outline: 'none', border: 0 }}
          >
            <SelectValue
              placeholder={hideAllSocial ? 'Select social' : 'All Socials'}
            />
          </SelectTrigger>
          <SelectContent className="font-semibold text-gray-500 dark:text-gray-300">
            {!hideAllSocial && (
              <SelectItem value="__ALL__">All Socials</SelectItem>
            )}
            {socials.map((social, idx) => (
              <SelectItem key={idx} value={social.text}>
                {social.text}
                {social.status === SOCIAL_STATUS.WARNING && (
                  <Tooltip>
                    <TooltipTrigger>
                      <TriangleAlert className="size-3 text-yellow-600 dark:text-yellow-300" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{social.tooltip} not connected</span>
                    </TooltipContent>
                  </Tooltip>
                )}
                {social.status === SOCIAL_STATUS.OK && (
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleCheckBig className="size-3 text-green-600 dark:text-green-300" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{social.tooltip} connected</span>
                    </TooltipContent>
                  </Tooltip>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Send Button */}
        <Button
          variant="default"
          size="icon"
          className={cn('h-8 text-xs')}
          onClick={handleGeneratePost}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

const PromptInfo = ({
  socials,
  selectedSocial,
}: {
  socials: InputPromptSocial[]
  selectedSocial: string | null
}) => {
  // --- Variables ---
  const commonClassNames =
    'mx-auto w-[96%] rounded-b-md border-1 border-t-0 px-2 py-1 text-xs inline-flex items-center gap-1'
  const successClassNames =
    'bg-brand-background-success border-brand-border-success text-brand-text-success'
  const warningClassNames =
    'bg-brand-background-warning border-brand-border-warning text-brand-text-warning'

  if (socials.length === 0) return null

  const allSocialsReady = socials.every(
    social => social.status === SOCIAL_STATUS.OK
  )

  // If selected social is not null
  if (selectedSocial) {
    const social = socials.find(social => social.text === selectedSocial)

    if (!social) return null

    // If selected social is connected
    if (social.status === SOCIAL_STATUS.OK) {
      return (
        <div className={cn(commonClassNames, successClassNames)}>
          <CircleCheckBig className="size-3 animate-pulse text-green-700" />
          {social.text} connection established
        </div>
      )
    }

    // If selected social is not connected
    return (
      <div className={cn(commonClassNames, warningClassNames)}>
        <TriangleAlert className="size-3 animate-pulse text-yellow-700" />
        {social?.text} is not configured, please
        <span className="font-semibold underline">
          <Link to="/settings" search={{ tabs: 'socials' }}>
            connect
          </Link>
        </span>
      </div>
    )
  }

  // If all socials are connected
  if (allSocialsReady) {
    return (
      <div className={cn(commonClassNames, successClassNames)}>
        <CircleCheckBig className="size-3 animate-pulse text-green-700" />
        All connections are ready
      </div>
    )
  }

  // If some socials are not connected
  return (
    <div className={cn(commonClassNames, warningClassNames)}>
      <TriangleAlert className="size-3 animate-pulse text-yellow-700" />
      Some socials are not configured, please
      <Link to="/settings" search={{ tabs: 'socials' }}>
        <span className="font-semibold underline">connect</span>
      </Link>
    </div>
  )
}
