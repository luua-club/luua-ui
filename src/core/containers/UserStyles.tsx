import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import SelectionChip from '@/shared/components/selection-chip'
import { WritingStyleChip } from '@/shared/models/style-chip.model'
import { Separator } from '@/shared/ui/separator'
import { cn } from '@/shared/utils'

import { userApi } from '../api/user.api'
import { QUERY_KEYS } from '../config/constant'
import { writingStyles } from '../config/user-preferences.config'
import {
  IUserStyleRequest,
  UserStyleResponseSchema,
  userStyleResponseType,
} from '../models/user.model'

interface UserStylesProps {
  data?: userStyleResponseType
  isLoading?: boolean
  initialGridCol?: number
  customHeader?: React.ReactNode
  hideHeader?: boolean
  onChange?: (writing_style: string[]) => void
}

function UserStyles({
  data,
  isLoading = false,
  initialGridCol = 3,
  customHeader,
  hideHeader = false,
  onChange,
}: UserStylesProps) {
  // ---- State ----
  const [selectedStyles, setSelectedStyles] = useState<WritingStyleChip[]>([])

  // ---- Hooks ----
  const queryClient = useQueryClient()
  const setUserStyleMutation = useMutation({
    mutationFn: (payload: IUserStyleRequest) => userApi.setUserStyle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userStyle] })
    },
    onError: () => {
      toast.error('Failed to update user style')
    },
  })

  // ---- Effects ----
  /**
   * Sets the selected styles based on the data prop.
   */
  useEffect(() => {
    if (data) {
      const parse = UserStyleResponseSchema.safeParse(data)

      if (parse.success) {
        setSelectedStyles(parse.data.writing_style ?? [])
      }
    }
  }, [data])

  // ---- Functions ----
  /**
   * Submits the selected styles to the API.
   */
  const submitSelectedStyles = () => {
    if (onChange) {
      return
    }

    setUserStyleMutation.mutate({
      writing_style: selectedStyles.map(i => i.id),
    })
  }

  /**
   * Handles the selection of a writing style chip.
   */
  const handleSelection = (item: WritingStyleChip) => {
    const items = selectedStyles.includes(item)
      ? selectedStyles.filter(i => i !== item)
      : [...selectedStyles, item]

    setSelectedStyles(items)

    if (onChange) {
      onChange(items.map(i => i.id))
    }
  }

  return (
    <>
      {!hideHeader && (
        <>
          {customHeader ? (
            customHeader
          ) : (
            <>
              <div className="py-4">
                <h1 className="text-lg font-medium">User Styles</h1>
              </div>
              <Separator />
            </>
          )}
        </>
      )}

      <div className="mt-4">
        {UserStylesChips(
          selectedStyles,
          writingStyles,
          isLoading || setUserStyleMutation.isPending,
          handleSelection,
          submitSelectedStyles,
          initialGridCol,
          Boolean(onChange)
        )}
      </div>
    </>
  )
}

/**
 * Render user styles chips.
 */
const UserStylesChips = (
  selectedItems: WritingStyleChip[],
  items: WritingStyleChip[],
  isLoading: boolean,
  onSelect: (item: WritingStyleChip) => void,
  onSubmit: () => void,
  initialGridCol?: number,
  hideSaveButton?: boolean
) => {
  return (
    <div
      className={cn(
        `mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-${initialGridCol}`,
        isLoading && 'opacity-50'
      )}
    >
      {items.map(item => (
        <SelectionChip
          key={item.title}
          chip={item}
          isSelected={!!selectedItems.find(i => i.id === item.id)}
          disabled={isLoading}
          onSelect={() => onSelect(item)}
        />
      ))}
      {!hideSaveButton && (
        <div
          className={cn(
            'bg-card flex cursor-pointer items-center justify-center gap-2 rounded-lg border-1 text-lg font-medium hover:bg-gray-100 dark:hover:bg-black',
            isLoading && 'cursor-not-allowed'
          )}
          onClick={!isLoading ? onSubmit : undefined}
        >
          Save
          {isLoading ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <Save className="size-5" />
          )}
        </div>
      )}
    </div>
  )
}

export default UserStyles
