import BrandLinkedIn from '@/assets/icons/brand-linkedin.svg?react'
import BrandX from '@/assets/icons/brand-x.svg?react'

import { channelType, ISocialChannel } from '../models/social.model'

/**
 * The key to store the user in local storage
 *
 * @default 'luua-user'
 */
export const LUUA_USER_KEY: string =
  import.meta.env.VITE_LUUA_LS_USER || 'luua-user'

/**
 * The key to store selected org id in local storage
 */
export const LUUA_SELECTED_ORG_KEY = 'luua-selected-org'

/**
 * The key to store selected project id in local storage
 */
export const LUUA_SELECTED_PROJECT_KEY = 'luua-selected-project'

/**
 * The key to store the extension id in session storage
 *
 * @default 'extensionId'
 */
export const LUUA_EXTENSION_ID_KEY: string = 'extensionId'

/**
 * The key to store the extension login flag in session storage
 *
 * @default 'isExtensionLogin'
 */
export const LUUA_EXTENSION_LOGIN_KEY: string = 'isExtensionLogin'

/**
 * Base URL for the API
 */
export const BASE_API_URL = import.meta.env.VITE_LUUA_BACKEND_URL

/**
 * Suggested text that is shown inside prompt box
 */
export const SUGGESTED_PROMPT_TEXT = [
  'Drop a tweet, video, or article link',
  'Got an idea? Turn it into a post',
  'Type a thought — Luua makes it a post',
  'Drop an idea or paste a link',
  'Found something cool? Drop it here',
]

export const EDIT_PROMPT_TEXT = [
  'Make it shorter and snappier',
  'Add a hook at the start',
  'Make it sound more professional',
  'Add a call to action at the end',
  'Add another example from this → [link]',
]

/**
 * Socials for Luua
 */
export const SOCIAL_PLATFORM: ISocialChannel[] = [
  {
    name: 'LinkedIn',
    logo: BrandLinkedIn,
    tooltip: 'Linkedin',
  },
  {
    name: 'Twitter',
    logo: BrandX,
    tooltip: 'Twitter / X.com',
  },
]

/**
 * Query keys for tanstack query
 */
export const QUERY_KEYS = {
  user: 'user',
  orgDetails: 'org-details',
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
  calendarEvents: 'calendar-events',
  analytics: 'analytics',
}

/**
 * Constants for tanstack query options
 */
export const QUERY_CONSTANTS = {
  staleTime: 1 * 60 * 1000, // 1 minute
  gcTime: 1 * 60 * 1000, // 1 minute (formerly cacheTime)
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
  errorCode: {
    activeSubscriptionFound: 'active_subscription_found',
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
  contactUs: 'https://luua.club/contact',
  chromeExt:
    'https://chromewebstore.google.com/detail/luua-inspiration-extensio/aolfcbppcakoomagjeiphibfokcjiogj?authuser=0&hl=en',
  discord: 'https://discord.gg/Q9DDvAsVmb',
  x: 'https://x.com/luuaclub',
  instagram:
    'https://www.instagram.com/luua_club?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  linkedIn: 'https://linkedin.com/company/luuaclub/',
  youtube_main_video: 'https://www.youtube.com/embed/aruHLNNsmRc',
  //TODO:
  youtube_autopilot: 'https://www.youtube.com/embed/aruHLNNsmRc',
  tos: 'https://luua.club/legal/terms-of-service',
  privacy: 'https://luua.club/legal/privacy-policy',
}
