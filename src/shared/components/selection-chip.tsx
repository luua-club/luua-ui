import { Icon, IconProps } from '@tabler/icons-react'

import { Card } from '../ui/card'
import { cn } from '../utils'

type SelectionChipProps<T extends string> = {
  title: T
  isSelected: boolean
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
  onSelect: (title: T) => void
}

const SelectionChip = <T extends string>({
  title,
  isSelected,
  icon: Icon,
  onSelect,
}: SelectionChipProps<T>) => {
  return (
    <Card
      className={cn(
        'relative flex cursor-pointer flex-row items-center justify-start rounded-md border-2 p-2 shadow-none transition-all duration-200',
        isSelected ? 'border-black' : 'border-gray-100 hover:border-gray-200'
      )}
      onClick={() => onSelect(title)}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex size-7 items-center justify-center rounded-full',
          isSelected
            ? 'bg-brand-accent-yellow border-1 border-black'
            : 'bg-gray-100'
        )}
      >
        <Icon className="size-4" />
      </div>

      {/* Title */}
      <h3
        className={cn(
          'text-sm font-medium',
          isSelected ? 'text-black' : 'text-gray-900'
        )}
      >
        {title}
      </h3>
    </Card>
  )
}

export default SelectionChip
