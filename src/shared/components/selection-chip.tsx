import { Circle, CircleCheck } from 'lucide-react'

import { WritingStyleChip } from '../models/style-chip.model'
import { Card, CardContent } from '../ui/card'
import { cn } from '../utils'

interface SelectionChipProps {
  chip: WritingStyleChip
  isSelected: boolean
  disabled?: boolean
  className?: string
  onSelect: (chip: WritingStyleChip) => void
}

const SelectionChip = ({
  chip,
  isSelected,
  disabled,
  onSelect,
}: SelectionChipProps) => {
  return (
    <Card
      className={cn(
        'bg-card cursor-pointer border-2 p-0 shadow-none',
        isSelected ? 'border-gray-800' : 'border-gray-100 hover:border-gray-200'
      )}
      onClick={!disabled ? () => onSelect(chip) : undefined}
    >
      <CardContent className="flex flex-col gap-2 p-0">
        <div className="flex items-center gap-2 p-3 pb-0">
          <div
            className={cn(
              'flex size-8 items-center justify-center rounded-md',
              chip.color
            )}
          >
            <chip.icon className="size-5" />
          </div>

          <p
            className={cn(
              'text-card-foreground flex flex-1 items-center justify-between text-base font-medium',
              isSelected && 'text-gray-800'
            )}
          >
            {chip.title}
            {isSelected ? (
              <CircleCheck className="size-5" />
            ) : (
              <Circle className="size-5 text-gray-300" />
            )}
          </p>
        </div>

        <p
          className={cn(
            'text-muted-foreground px-3 text-sm text-balance',
            isSelected && 'text-gray-800'
          )}
        >
          {chip.description}
        </p>
        <p
          className={cn(
            'px-3 pb-2 text-xs text-gray-400',
            isSelected && 'text-gray-800'
          )}
        >
          {chip.llm_info}
        </p>
      </CardContent>
    </Card>
  )
}

export default SelectionChip
