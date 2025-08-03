import { Icon, IconProps } from '@tabler/icons-react'
import { ForwardRefExoticComponent, RefAttributes, useState } from 'react'

import {
  toneStyles,
  ToneStyleType,
  writingStyles,
  WritingStyleType,
} from '@/core/config/user-preferences'
import SelectionChip from '@/shared/components/selection-chip'
import { Separator } from '@/shared/ui/separator'

import Advanced from './Advanced'
import Summary from './Summary'

const Preferences = () => {
  const [selectedStyles, setSelectedStyles] = useState<WritingStyleType[]>([
    'Casual',
  ])
  const [selectedTones, setSelectedTones] = useState<ToneStyleType[]>([
    'Friendly',
  ])

  const handleSelection = <T extends string>(
    item: T,
    selectedItems: T[],
    setSelectedItems: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    const isCurrentlySelected = selectedItems.includes(item)
    if (isCurrentlySelected) {
      if (selectedItems.length > 1) {
        setSelectedItems(prev => prev.filter(i => i !== item))
      }
    } else {
      setSelectedItems(prev => [...prev, item])
    }
  }

  return (
    <>
      <Summary />
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
          style => handleSelection(style, selectedStyles, setSelectedStyles)
        )}
      </div>
      <div className="mt-8 mb-10">
        {renderSelectionGrid('Tone Styles', toneStyles, selectedTones, tone =>
          handleSelection(tone, selectedTones, setSelectedTones)
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
  onSelect: (item: T) => void
) => (
  <div>
    <h6 className="text-base font-medium">{title}</h6>
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {items.map(item => (
        <SelectionChip
          key={item.title}
          title={item.title}
          icon={item.icon}
          isSelected={selectedItems.includes(item.title)}
          onSelect={onSelect}
        />
      ))}
    </div>
  </div>
)

export default Preferences
