import z from 'zod'

/**
 * Zod schema for inspiration form values
 */
export const InspirationSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  additional_context: z.string().optional(),
})

/**
 * Type for inspiration form values
 */
export type InspirationFormValues = z.infer<typeof InspirationSchema>
