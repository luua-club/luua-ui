import posthog from 'posthog-js'

/**
 * It runs when user has selected either of the following:
 * 1. Role
 * 2. Industry
 * 3. Goal
 * on the onboarding page.
 *
 * @param role - The role selected by the user.
 * @param industry - The industry selected by the user.
 * @param goal - The goal selected by the user.
 */
export const postHogOnboardingCompleted = (
  role?: string,
  industry?: string,
  goal?: string
) => {
  posthog.capture('onboarding:completed', {
    role,
    industry,
    goal,
  })
}

/**
 * It runs no of the following values are input by user:
 * 1. Role
 * 2. Industry
 * 3. Goal
 */
export const postHogOnboardingSkipped = () => {
  posthog.capture('onboarding:skipped')
}

/**
 * It will run when user has selected the styles.
 *
 * @param styles - user choses styles array
 */
export const postHogOnboardingStylesCompleted = (styles: string[]) => {
  posthog.capture('onboarding:styles_completed', {
    styles,
  })
}

/** It runs when user has not selected any styles. */
export const postHogOnboardingStylesSkipped = () => {
  posthog.capture('onboarding:styles_skipped')
}

/**
 * It runs when the intro i.e Welcome Drawer or Paid Drawer is skipped.
 *
 * @param introTitle - The title of that intro drawer.
 * @param stepNumber - That active step number where it was skipped.
 */
export const postHogIntroCapture = (introTitle: string, stepNumber: number) => {
  posthog.capture('intro:skipped', {
    introTitle,
    stepNumber,
  })
}

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
 * It runs when user save draft from create page.
 *
 * @param draft_id - The id of the draft.
 * @param posts_count - The number of posts generated.
 * @param linkedin_content - The content of the LinkedIn post.
 * @param twitter_content - The content of the Twitter post.
 * @param latest_generated_posts_linkedin - The latest generated post on LinkedIn.
 * @param latest_generated_posts_twitter - The latest generated post on Twitter.
 */
export const postHogDraftCapture = (
  draft_id: string,
  posts_count: number,
  linkedin_content?: string,
  twitter_content?: string,
  latest_generated_posts_linkedin?: string,
  latest_generated_posts_twitter?: string
) => {
  posthog.capture('drafts:saved', {
    draft_id,
    posts_count,
    linkedin_content,
    twitter_content,
    latest_generated_posts_linkedin,
    latest_generated_posts_twitter,
  })
}

/**
 * It runs when user schedule post from create page.
 *
 * @param draft_id - The id of the draft.
 * @param posts_count - The number of posts generated.
 * @param linkedin_content - The content of the LinkedIn post.
 * @param twitter_content - The content of the Twitter post.
 * @param latest_generated_posts_linkedin - The latest generated post on LinkedIn.
 * @param latest_generated_posts_twitter - The latest generated post on Twitter.
 * @param schedule_date - The date of the schedule.
 */
export const postHogScheduleCapture = (
  draft_id: string,
  posts_count: number,
  linkedin_content?: string,
  twitter_content?: string,
  latest_generated_posts_linkedin?: string,
  latest_generated_posts_twitter?: string,
  schedule_date?: string
) => {
  posthog.capture('posts:scheduled', {
    draft_id,
    posts_count,
    linkedin_content,
    twitter_content,
    latest_generated_posts_linkedin,
    latest_generated_posts_twitter,
    schedule_date,
  })
}

/**
 * It runs when user publish post from create page.
 *
 * @param draft_id - The id of the draft.
 * @param posts_count - The number of posts generated.
 * @param linkedin_content - The content of the LinkedIn post.
 * @param twitter_content - The content of the Twitter post.
 * @param latest_generated_posts_linkedin - The latest generated post on LinkedIn.
 * @param latest_generated_posts_twitter - The latest generated post on Twitter.
 */
export const postHogPublishCapture = (
  draft_id: string,
  posts_count: number,
  linkedin_content?: string,
  twitter_content?: string,
  latest_generated_posts_linkedin?: string,
  latest_generated_posts_twitter?: string
) => {
  posthog.capture('posts:published', {
    draft_id,
    posts_count,
    linkedin_content,
    twitter_content,
    latest_generated_posts_linkedin,
    latest_generated_posts_twitter,
  })
}

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
 * It runs when user clicks on upgrade button to upgrade their subscription plan.
 *
 * @param plan - The current plan the user is on (optional).
 */
export const postHogUpgradeCapture = (plan?: string) => {
  posthog.capture('payments:upgrade_clicked', { current_plan: plan })
}

/**
 * It runs when user cancels their subscription plan.
 */
export const postHogCancelledPlanCapture = () => {
  posthog.capture('payments:subscription_cancelled')
}

/**
 * It runs when user clicks to connect a social media platform.
 *
 * @param platform - The social media platform being connected (e.g., 'linkedin', 'twitter').
 */
export const postHogConnectSocialCapture = (platform: string) => {
  posthog.capture('socials:connect_clicked', { platform })
}

/**
 * It runs when user clicks to disconnect a social media platform.
 *
 * @param platform - The social media platform being disconnected (e.g., 'linkedin', 'twitter').
 */
export const postHogDisconnectSocialCapture = (platform: string) => {
  posthog.capture('socials:disconnect_clicked', { platform })
}
