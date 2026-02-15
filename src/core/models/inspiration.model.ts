import { IPagination } from './pagination.model'

interface Inspiration {
  id: string
  link: string
  additional_context: string | null
  utilized: boolean
  title: string | null
  description: string | null
  icon: string | null
  created_at: string
  updated_at: string
}

export interface InspirationResponse extends IPagination {
  inspirations: Inspiration[]
}
