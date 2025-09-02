import z from 'zod'

/**
 * Industries for onboarding
 */
export const INDUSTRIES = [
  'Technology / SaaS',
  'Finance / FinTech',
  'Healthcare / Wellness',
  'Marketing & Advertising',
  'E-commerce / Retail',
  'Consulting',
  'Education',
  'Real Estate',
  'Other',
]

/**
 * Goals for onboarding
 */
export const GOALS = [
  'Build my personal brand & thought leadership.',
  'Generate leads for my business.',
  'Share company updates and news.',
  'Recruit talent & grow my network.',
]

/**
 * Zod schema for onboarding form
 */
export const ONBOARDING_FORM_SCHEMA = z.object({
  role: z
    .union([
      z.string().min(2, 'Please enter at least 2 characters.'),
      z.literal(''),
    ])
    .optional(),
  industry: z.enum(INDUSTRIES).optional(),
  goal: z.enum(GOALS).optional(),
})
export type OnboardingFormValues = z.infer<typeof ONBOARDING_FORM_SCHEMA>
