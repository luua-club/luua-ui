import posthog from 'posthog-js'

import { DraftItem, IDraftRequest } from '../models/draft.model'
import { userStyleResponseType } from '../models/user.model'

/**
 * -------------------------------
 * Styles Analytics
 * -------------------------------
 */
/**
 * It runs when user updates their basic style.
 *
 * @param style - The style object.
 */
export const postHogStyleUpdateCapture = (style: userStyleResponseType) => {
  posthog.capture('styles:updated', {
    style,
  })
}

/**
 * It runs when user updates their enhanced style.
 *
 * @param style_text - The style text.
 * @param gcp_storage_doc_ids - The gcp storage doc ids.
 */
export const postHogStyleEnhancedCapture = (
  style_text?: string,
  gcp_storage_doc_ids?: string[]
) => {
  posthog.capture('styles:enhanced_updated', {
    style_text,
    gcp_storage_doc_ids,
  })
}

/**
 * -------------------------------
 * Create Post Analytics
 * -------------------------------
 */
/**
 * It runs when user has generated AI content.
 *
 * @param posts_count - The number of posts generated.
 * @param original_prompt - The original prompt used to generate the posts.
 * @param linkedin_content - The content of the LinkedIn post.
 * @param twitter_content - The content of the Twitter post.
 */
export const postHogGenerationCapture = (
  posts_count: number,
  original_prompt: string,
  linkedin_content?: string,
  twitter_content?: string
) => {
  posthog.capture('posts:generated', {
    posts_count,
    linkedin_content,
    twitter_content,
    original_prompt,
  })
}

/**
 * -------------------------------
 * Final Review Analytics
 * -------------------------------
 */
/**
 * It runs when user schedule post from create page.
 *
 * @param draft_id - The id of the draft.
 * @param post_ids - The ids of the posts.
 * @param draft_data - The draft data.
 */
export const postHogScheduleCapture = (
  draftId: string,
  postIds: string[],
  draftData: DraftItem | IDraftRequest
) => {
  posthog.capture('posts:scheduled', {
    draft_id: draftId,
    post_ids: postIds,
    draft_data: draftData,
  })
}

/**
 * It runs when user publish post from create page.
 *
 * @param draft_id - The id of the draft.
 * @param post_ids - The ids of the posts.
 * @param draft_data - The draft data.
 */
export const postHogPublishCapture = (
  draftId: string,
  postIds: string[],
  draftData: DraftItem | IDraftRequest
) => {
  posthog.capture('posts:published', {
    draft_id: draftId,
    post_ids: postIds,
    draft_data: draftData,
  })
}

/**
 * -------------------------------
 * Payments Analytics
 * -------------------------------
 */
/**
 * It runs when user starts the checkout process for a subscription plan.
 *
 * @param plan - The current plan the user is on (optional).
 */
export const postHogCheckoutCapture = (plan?: string) => {
  posthog.capture('payments:checkout_started', {
    current_plan: plan,
  })
}

/**
 * It runs when user cancels their subscription plan.
 */
export const postHogCancelledPlanCapture = () => {
  posthog.capture('payments:subscription_cancelled')
}

/**
 * It runs when user clicks on upgrade button to upgrade their subscription plan.
 *
 * @param plan - The current plan the user is on (optional).
 */
export const postHogUpgradeCapture = (plan?: string) => {
  posthog.capture('payments:upgrade_clicked', { current_plan: plan })
}

/**
 * -------------------------------
 * Error Captures
 * -------------------------------
 */
export const postHogErrorCapture = (error: Error | null) => {
  posthog.captureException(error)
}
