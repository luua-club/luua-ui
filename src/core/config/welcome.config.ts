import {
  Download,
  LucideIcon,
  Paintbrush,
  PencilRuler,
  Rocket,
} from 'lucide-react'

import autopilotPreviewLight from '@/assets/images/autopilot.webp'
import autopilotPreviewDark from '@/assets/images/autopilot-dark.webp'
import bookmarkPreviewLight from '@/assets/images/bookmark.webp'
import bookmarkPreviewDark from '@/assets/images/bookmark-dark.webp'
import createPostPreviewLight from '@/assets/images/create.webp'
import createPostPreviewDark from '@/assets/images/create-dark.webp'
import stylesPreviewLight from '@/assets/images/styles.webp'
import stylesPreviewDark from '@/assets/images/styles-dark.webp'

import { EXTERNAL_URLS } from './constant'

export type BentoImageData = {
  src?: string
  srcDark?: string
  ratio?: 'aspect-[3/2]' | 'aspect-square'
  objectFit?: 'object-top-left' | 'object-top'
}

export type BentoItemConfig = {
  title: string
  description: string
  className?: string
  icon: LucideIcon
  route?: string
  imageData?: BentoImageData
  externalUrl?: string
  sortOrderDesktop?: number
  sortOrderMobile?: number
}

export const BENTO_ITEMS: BentoItemConfig[] = [
  {
    title: 'Add extension to Chrome',
    description:
      'One-click bookmarking and reimagining for X and LinkedIn, with support for content from any website or YouTube video.',
    className: 'md:col-span-2',
    icon: Download,
    imageData: {
      src: bookmarkPreviewLight,
      srcDark: bookmarkPreviewDark,
      ratio: 'aspect-[3/2]',
      objectFit: 'object-top',
    },
    externalUrl: EXTERNAL_URLS.chromeExt,
    sortOrderDesktop: 4,
    sortOrderMobile: 4,
  },
  {
    title: 'Autopilot content creation',
    description: 'Turn your saved bookmarks into fresh drafts automatically!',
    className: 'md:col-span-1',
    icon: Rocket,
    imageData: {
      src: autopilotPreviewLight,
      srcDark: autopilotPreviewDark,
      ratio: 'aspect-square',
      objectFit: 'object-top-left',
    },
    route: '/autopilot',
    sortOrderDesktop: 3,
    sortOrderMobile: 3,
  },
  {
    title: 'Set up styles for AI',
    description:
      "Customize tone and format so Luua's AI writes in your unique voice.",
    className: 'md:col-span-1',
    icon: Paintbrush,
    imageData: {
      src: stylesPreviewLight,
      srcDark: stylesPreviewDark,
      ratio: 'aspect-square',
      objectFit: 'object-top-left',
    },
    route: '/preferences',
    sortOrderDesktop: 2,
    sortOrderMobile: 2,
  },
  {
    title: 'Create and schedule',
    description:
      'Draft posts yourself or let AI generate them for LinkedIn and X. Publish now or schedule ahead.',
    className: 'md:col-span-2',
    icon: PencilRuler,
    route: '/creation/create',
    imageData: {
      src: createPostPreviewLight,
      srcDark: createPostPreviewDark,
      ratio: 'aspect-[3/2]',
      objectFit: 'object-top-left',
    },
    sortOrderDesktop: 1,
    sortOrderMobile: 1,
  },
]
