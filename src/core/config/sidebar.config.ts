import {
  FileCheck,
  FolderClosed,
  FolderHeart,
  House,
  Lightbulb,
  LucideCalendar,
  Paintbrush,
  PencilRuler,
} from 'lucide-react'

import { ISidebarItem } from '../models/sidebar.model'

export const platformItems: ISidebarItem[] = [
  {
    title: 'Welcome',
    url: '/welcome',
    icon: House,
  },
  {
    title: 'Your Styles',
    url: '/preferences',
    icon: Paintbrush,
  },
]

export const creationItems: ISidebarItem[] = [
  {
    title: 'Create New',
    url: '/creation/create',
    icon: PencilRuler,
  },
  {
    title: 'Saved Drafts',
    url: '/creation/drafts',
    icon: FolderClosed,
  },
]

export const postsItems: ISidebarItem[] = [
  {
    title: 'Scheduled',
    url: '/schedule',
    icon: LucideCalendar,
  },
  {
    title: 'Published',
    url: '/published',
    icon: FileCheck,
  },
]

export const autoGenItems: ISidebarItem[] = [
  {
    title: 'Inspiration',
    url: '/auto-gen/inspiration',
    icon: Lightbulb,
  },
  {
    title: 'AI Drafts',
    url: '/auto-gen/drafts',
    icon: FolderHeart,
  },
]
