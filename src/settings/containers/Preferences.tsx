import { Icon, IconProps } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Frown } from 'lucide-react'
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'

import { userApi } from '@/core/api/user.api'
import {
  toneStyles,
  ToneStyleType,
  writingStyles,
  WritingStyleType,
} from '@/core/config/user-preferences'
import {
  IUserStyleRequest,
  UserStyleResponseSchema,
} from '@/core/models/user.model'
import SelectionChip from '@/shared/components/selection-chip'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import debounce from '@/shared/utils/debounce'

import Summary from '../components/Summary'
import { queryKeys } from '../utils'
import Advanced from './Advanced'

const Preferences = () => {
  const [selectedStyles, setSelectedStyles] = useState<WritingStyleType[]>([])
  const [selectedTones, setSelectedTones] = useState<ToneStyleType[]>([])

  const queryClient = useQueryClient()

  const { data, status, isLoading, isError } = useQuery({
    queryKey: [queryKeys.userStyle],
    queryFn: () => userApi.getUserStyle(),
    refetchOnMount: true,
  })

  const setUserStyleMutation = useMutation({
    mutationFn: (payload: IUserStyleRequest) => userApi.setUserStyle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.userStyle] })
    },
    onError: () => {
      toast.error('Failed to update user style')
    },
  })

  useEffect(() => {
    if (data && status === 'success') {
      const parse = UserStyleResponseSchema.safeParse(data.data)

      if (parse.success) {
        setSelectedStyles(parse.data.writing_style ?? [])
        setSelectedTones(parse.data.tone ?? [])
      }
    }
  }, [data, status])

  const debouncedMutate = useRef(
    debounce((type: keyof IUserStyleRequest, items: string[]) => {
      setUserStyleMutation.mutate({ [type]: items })
    }, 500)
  ).current

  const handleSelection = <T extends string>(
    item: T,
    selectedItems: T[],
    setSelectedItems: React.Dispatch<React.SetStateAction<T[]>>,
    type: keyof IUserStyleRequest
  ) => {
    const items = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item]

    setSelectedItems(items)
    debouncedMutate(type, items)
  }

  if (isError) {
    return (
      <div className="flex min-h-16 items-center justify-center rounded-lg border-1 border-dashed p-4">
        <Frown className="mr-2 size-4" />
        Something went wrong, Please try again later
      </div>
    )
  }

  return (
    <>
      <Summary data={data?.data} isLoading={isLoading} />
      <div className="mt-4">
        <Advanced />
      </div>
      <div className="mt-4 py-4">
        <h1 className="text-lg font-medium">User Styles</h1>
      </div>
      <Separator />
      <div className="mt-4">
        {renderSelectionGrid(
          'Writing Styles',
          writingStyles,
          selectedStyles,
          isLoading,
          setUserStyleMutation.isPending,
          style =>
            handleSelection<WritingStyleType>(
              style,
              selectedStyles,
              setSelectedStyles,
              'writing_style'
            )
        )}
      </div>
      <div className="mt-8 mb-10">
        {renderSelectionGrid(
          'Tone Styles',
          toneStyles,
          selectedTones,
          isLoading,
          setUserStyleMutation.isPending,
          style =>
            handleSelection<ToneStyleType>(
              style,
              selectedTones,
              setSelectedTones,
              'tone'
            )
        )}
      </div>
    </>
  )
}

const renderSelectionGrid = <T extends string>(
  title: string,
  items: readonly {
    title: T
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
  }[],
  selectedItems: T[],
  isLoading: boolean,
  disabled: boolean,
  onSelect: (item: T) => void
) => {
  return (
    <div>
      <h6 className="text-base font-medium">{title}</h6>
      {isLoading ? (
        <Skeleton className="mt-4 h-20 w-full rounded-md" />
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {items.map(item => (
            <SelectionChip
              key={item.title}
              title={item.title}
              icon={item.icon}
              isSelected={selectedItems.includes(item.title)}
              disabled={disabled}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Preferences
