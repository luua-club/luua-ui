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
  oneCol?: boolean
}

function UserStyles({
  data,
  isLoading = false,
  oneCol = false,
}: UserStylesProps) {
  const [selectedStyles, setSelectedStyles] = useState<WritingStyleChip[]>([])
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

  useEffect(() => {
    if (data) {
      const parse = UserStyleResponseSchema.safeParse(data)

      if (parse.success) {
        setSelectedStyles(parse.data.writing_style ?? [])
      }
    }
  }, [data])

  const submitSelectedStyles = () => {
    setUserStyleMutation.mutate({
      writing_style: selectedStyles.map(i => i.id),
    })
  }

  const handleSelection = (item: WritingStyleChip) => {
    const items = selectedStyles.includes(item)
      ? selectedStyles.filter(i => i !== item)
      : [...selectedStyles, item]

    setSelectedStyles(items)
  }

  return (
    <>
      <div className="py-4">
        <h1 className="text-lg font-medium">User Styles</h1>
      </div>
      <Separator />
      <div className="mt-4">
        {UserStylesChips(
          selectedStyles,
          writingStyles,
          isLoading || setUserStyleMutation.isPending,
          handleSelection,
          submitSelectedStyles,
          oneCol
        )}
      </div>
    </>
  )
}

const UserStylesChips = (
  selectedItems: WritingStyleChip[],
  items: WritingStyleChip[],
  isLoading: boolean,
  onSelect: (item: WritingStyleChip) => void,
  onSubmit: () => void,
  oneCol?: boolean
) => {
  return (
    <div
      className={cn(
        'mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
        isLoading && 'opacity-50',
        oneCol && '!grid-cols-1'
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
      <div
        className={cn(
          'flex cursor-pointer items-center justify-center gap-2 rounded-lg border-1 text-lg font-medium hover:bg-gray-100',
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
    </div>
  )
}

export default UserStyles
