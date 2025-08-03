import {
  Icon,
  IconBriefcase,
  IconBulb,
  IconGymnastics,
  IconHandLoveYou,
  IconMoodHappy,
  IconMoodNeutral,
  IconMoodSmileBeam,
  IconProps,
  IconRulerMeasure2,
  IconSchool,
  IconTie,
} from '@tabler/icons-react'

export type WritingStyleType =
  | 'Casual'
  | 'Formal'
  | 'Academic'
  | 'Creative'
  | 'Technical'

export type ToneStyleType =
  | 'Friendly'
  | 'Professional'
  | 'Assertive'
  | 'Neutral'
  | 'Humorous'

export interface ISelectionChip<T extends string> {
  title: T
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
}

export const writingStyles: ISelectionChip<WritingStyleType>[] = [
  {
    title: 'Casual',
    icon: IconHandLoveYou,
  },
  {
    title: 'Formal',
    icon: IconTie,
  },
  {
    title: 'Academic',
    icon: IconSchool,
  },
  {
    title: 'Creative',
    icon: IconBulb,
  },
  {
    title: 'Technical',
    icon: IconRulerMeasure2,
  },
]

export const toneStyles: ISelectionChip<ToneStyleType>[] = [
  {
    title: 'Friendly',
    icon: IconMoodSmileBeam,
  },
  {
    title: 'Professional',
    icon: IconBriefcase,
  },
  {
    title: 'Assertive',
    icon: IconGymnastics,
  },
  {
    title: 'Neutral',
    icon: IconMoodNeutral,
  },
  {
    title: 'Humorous',
    icon: IconMoodHappy,
  },
]
