import { z } from 'zod'

export const createSearchSchema = z.object({
  draftId: z.string().optional(),
  source: z.string().optional(),
})

export type CreateSearch = z.infer<typeof createSearchSchema>
