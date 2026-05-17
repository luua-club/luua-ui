const PENDING_REDEMPTION_CODE_KEY = 'luua-pending-redemption-code'

/** Returns stored code once and removes it from sessionStorage. */
export function consumePendingRedemptionCode(): string | null {
  const raw = sessionStorage.getItem(PENDING_REDEMPTION_CODE_KEY)
  if (raw == null) return null
  sessionStorage.removeItem(PENDING_REDEMPTION_CODE_KEY)
  return raw
}
