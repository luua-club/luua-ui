export type PaymentsSearch = {
  /** Six-character redemption code from invite links (`/payments?code=…`). */
  code?: string
}

export function parsePaymentsSearch(
  search: Record<string, unknown>
): PaymentsSearch {
  const raw = search.code
  if (typeof raw !== 'string') return {}
  const trimmed = raw.trim()
  if (!trimmed) return {}
  return { code: trimmed }
}
