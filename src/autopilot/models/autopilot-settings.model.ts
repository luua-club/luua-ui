import { z } from 'zod'

import { channelType } from '@/core/models/social.model'

export const autopilotSettingsSchema = z.object({
  // Optional, but if provided must be 1 to 10,000 characters
  base_prompt: z
    .string()
    .max(10_000, 'Must be at most 10,000 characters')
    .refine(v => v.length === 0 || v.length >= 1, 'Minimum 1 character')
    .optional(),
  // Mandatory, integer between 1 and 30 inclusive
  frequency_days: z.coerce
    .number()
    .int('Must be a whole number')
    .min(1, 'Must be at least 1')
    .max(30, 'Cannot be more than 30'),
  channels: z
    .array(z.enum(['Twitter', 'LinkedIn'] as channelType[]))
    .min(1, 'Select at least one channel'),
  auto_publish: z.boolean().optional(),
})

export type AutopilotSettingsFromValues = z.infer<
  typeof autopilotSettingsSchema
>
