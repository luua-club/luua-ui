import { IPagination } from './pagination.model'

interface Inspiration {
  id: string
  link: string
  additional_context: string | null
  utilized: boolean
  created_at: string
  updated_at: string
}

export interface InspirationResponse extends IPagination {
  inspirations: Inspiration[]
}
