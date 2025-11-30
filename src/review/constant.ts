import {
  FileCheck,
  Hourglass,
  LucideCalendar,
  LucideIcon,
  MousePointer2,
} from 'lucide-react'

export interface Step {
  id: 'review' | 'publish' | 'schedule'
  title: string
  icon: LucideIcon
  isQuickShareEnabled?: boolean
}

export const publishPostSteps: Step[] = [
  { id: 'review', title: 'Review Your Posts', icon: FileCheck },
  {
    id: 'publish',
    title: 'Connect And Publish',
    icon: MousePointer2,
    isQuickShareEnabled: true,
  },
]

export const schedulePostSteps: Step[] = [
  { id: 'review', title: 'Review Your Posts', icon: FileCheck },
  { id: 'schedule', title: 'Pick Date And Time', icon: Hourglass },
  { id: 'publish', title: 'Connect And Schedule', icon: LucideCalendar },
]
