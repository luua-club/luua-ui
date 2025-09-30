import { IconBrandLinkedin, IconBrandX } from '@tabler/icons-react'

import { channelType, ISocialChannel } from '../models/social.model'

/**
 * The key to store the user in local storage
 *
 * @default 'luua-user'
 */
export const LUUA_USER_KEY: string =
  import.meta.env.LUUA_USER_KEY || 'luua-user'

/**
 * Base URL for the API
 */
export const BASE_API_URL = import.meta.env.VITE_LUUA_BACKEND_URL

/**
 * Suggested text that is shown inside prompt box
 */
export const SUGGESTED_PROMPT_TEXT = [
  'Start with a prompt: Announce our weekend sale...',
  'Or paste a link to a tweet, or linkedin post you love',
  'Let Luua handle the rest...',
]

/**
 * Socials for Luua
 */
export const SOCIAL_PLATFORM: ISocialChannel[] = [
  {
    name: 'Twitter',
    logo: IconBrandX,
    tooltip: 'Twitter / X.com',
  },
  {
    name: 'LinkedIn',
    logo: IconBrandLinkedin,
    tooltip: 'Linkedin',
  },
]

/**
 * Query keys for tanstack query
 */
export const QUERY_KEYS = {
  user: 'user',
  drafts: 'drafts',
  draft: 'draft',
  generateAIPost: 'generate-ai-post',
  scheduleList: 'schedule-list',
  publishList: 'publish-list',
  userStyle: 'user-style',
  autopilotSettings: 'autopilot-settings',
  inspirations: 'inspirations',
  subscriptionDetails: 'subscription-details',
  usageSummary: 'usage-summary',
}

/**
 * Constants for tanstack query options
 */
export const QUERY_CONSTANTS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
}

/**
 * Constants for API related stuff
 */
export const API_CONSTANTS = {
  statusCode: {
    success: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
  },
}

/**
 * User style status enum
 */
export enum UserStyleStatus {
  INITIAL = 'initial',
  IN_PROGRESS = 'in_progress',
  GENERATED = 'generated',
  FAILED = 'failed',
}

/**
 * Post word count for each channel
 */
export const POST_WORD_COUNT: { [key in channelType]: number } = {
  Twitter: 280,
  LinkedIn: 3000,
}

/**
 * External URLs
 */
export const EXTERNAL_URLS = {
  contactUs: 'https://luua.club/contact-us',
}
