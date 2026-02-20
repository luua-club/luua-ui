import {
  Bookmark,
  FileCheck,
  FolderClosed,
  House,
  LucideCalendar,
  LucideLayoutDashboard,
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
    title: 'All Posts',
    url: '/posts-view',
    icon: LucideLayoutDashboard,
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
