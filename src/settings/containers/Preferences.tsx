import { useState } from 'react'

import {
  toneStyles,
  ToneStyleType,
  writingStyles,
  WritingStyleType,
} from '@/core/config/user-preferences'
import SelectionChip from '@/shared/components/selection-chip'
import { Separator } from '@/shared/ui/separator'

const Preferences = () => {
  const [selectedStyle, setSelectedStyle] = useState<WritingStyleType>('Casual')
  const [selectedTone, setSelectedTone] = useState<ToneStyleType>('Friendly')

  const handleStyleSelect = (styleTitle: string) => {
    setSelectedStyle(styleTitle as WritingStyleType)
  }

  const handleToneSelect = (toneTitle: string) => {
    setSelectedTone(toneTitle as ToneStyleType)
  }

  return (
    <>
      {/* Heading */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Preferences</h1>
      </div>
      <Separator />

      {/* Writing Styles Selection */}
      <div className="py-8">
        <h1 className="text-lg font-medium">Customize your writing style</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Select the style and tone that best suits your needs. This will help
          us tailor our suggestions to match your preferences.
        </p>

        <h6 className="text-lg font-medium">Writing Styles</h6>
        {/* Selectable Cards Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {writingStyles.map(style => {
            const isSelected = selectedStyle === style.title

            return (
              <SelectionChip
                key={style.title}
                title={style.title}
                icon={style.icon}
                isSelected={isSelected}
                handleStyleSelect={handleStyleSelect}
              />
            )
          })}
        </div>

        <h6 className="mt-8 text-lg font-medium">Tone Styles</h6>
        {/* Selectable Cards Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {toneStyles.map(tone => {
            const isSelected = selectedTone === tone.title

            return (
              <SelectionChip
                key={tone.title}
                title={tone.title}
                icon={tone.icon}
                isSelected={isSelected}
                handleStyleSelect={handleToneSelect}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Preferences
