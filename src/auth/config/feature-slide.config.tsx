import advanceStyleFullLight from '@/assets/images/advance-style-full.webp'
import advanceStyleFullDark from '@/assets/images/advance-style-full-dark.webp'
import advanceStyleTinyLight from '@/assets/images/advance-style-tiny.webp'
import advanceStyleTinyDark from '@/assets/images/advance-style-tiny-dark.webp'
import autopilotFullDark from '@/assets/images/autopilot-dark-full.webp'
import autopilotTinyDark from '@/assets/images/autopilot-dark-tiny.webp'
import autopilotFullLight from '@/assets/images/autopilot-full.webp'
import autopilotTinyLight from '@/assets/images/autopilot-tiny.webp'
import createFullDark from '@/assets/images/create-dark-full.webp'
import createTinyDark from '@/assets/images/create-dark-tiny.webp'
import createFullLight from '@/assets/images/create-full.webp'
import createTinyLight from '@/assets/images/create-tiny.webp'

/** Time between automatic slide advances (ms). */
export const FEATURE_CAROUSEL_AUTOPLAY_MS = 6000

/**
 * Feature carousel items for the login right panel (image pairs + copy).
 * Body copy is JSX so we can use inline emphasis where needed.
 */
export const FEATURE_SLIDES = [
  {
    id: 'create',
    imageLight: createFullLight,
    imageDark: createFullDark,
    placeholderLight: createTinyLight,
    placeholderDark: createTinyDark,
    alt: 'Create and schedule social media posts with AI',
    highlightLight: '#8FF9B4',
    highlightDark: '#426732',
    highlight: 'Create and schedule',
    italic: 'social media posts with AI.',
    body: (
      <>
        Create multiple posts at once, and turn{' '}
        <strong>YouTube videos or any web articles</strong> into social posts
        that match your voice and tone.
      </>
    ),
  },
  {
    id: 'styling',
    imageLight: advanceStyleFullLight,
    imageDark: advanceStyleFullDark,
    placeholderLight: advanceStyleTinyLight,
    placeholderDark: advanceStyleTinyDark,
    alt: 'Advanced styling for your brand voice',
    highlightLight: '#FBBF24',
    highlightDark: '#B45309',
    highlight: 'Advanced styling',
    italic: 'for your unique brand voice.',
    body: (
      <>
        Capture your tone from <strong>past posts, websites, or files</strong>{' '}
        and apply it to every generation, automatically.
      </>
    ),
  },
  {
    id: 'autopilot',
    imageLight: autopilotFullLight,
    imageDark: autopilotFullDark,
    placeholderLight: autopilotTinyLight,
    placeholderDark: autopilotTinyDark,
    alt: 'Autopilot — set it and forget it',
    highlightLight: '#C4B5FD',
    highlightDark: '#6D28D9',
    highlight: 'Autopilot',
    italic: 'set it and forget it.',
    body: (
      <>
        Schedule recurring content, and let Luua draft, queue, and publish on
        the cadence <strong>you define</strong>.
      </>
    ),
  },
] as const

export type FeatureSlide = (typeof FEATURE_SLIDES)[number]
export type FeatureSlideId = FeatureSlide['id']
