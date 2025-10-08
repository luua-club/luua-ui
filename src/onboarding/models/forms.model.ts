import { z } from 'zod/v3'

import { GOALS, INDUSTRIES } from '../config/constant'

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
  industry: z.enum(INDUSTRIES as [string, ...string[]]).optional(),
  goal: z.enum(GOALS as [string, ...string[]]).optional(),
})
export type OnboardingFormValues = z.infer<typeof ONBOARDING_FORM_SCHEMA>
