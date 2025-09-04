import { Icon, IconProps } from '@tabler/icons-react'

export interface WritingStyleChip {
  id: string
  title: string
  description: string
  llm_info: string
  color: string
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
}
