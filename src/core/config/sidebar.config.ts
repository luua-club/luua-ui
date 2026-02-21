import {
  Bookmark,
  FileCheck,
  FolderClosed,
  House,
  LucideCalendar,
  Network,
  Paintbrush,
  PencilRuler,
} from 'lucide-react'

import { ISidebarItem } from '../models/sidebar.model'

export const ungroupedItems: ISidebarItem[] = [
  {
    title: 'Welcome',
    url: '/welcome',
    icon: House,
  },
  {
    title: 'Bookmarks',
    url: '/bookmarks',
    icon: Bookmark,
  },
  {
    title: 'Autopilot',
    url: '/autopilot',
    icon: Network,
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
    url: '/drafts',
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
