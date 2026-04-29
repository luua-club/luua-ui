import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'

/** Time between automatic resend OTP (ms). */
export const OTP_RESEND_COOLDOWN_SECONDS = 60 // 1 minute

/**
 * Which characters the OTP field accepts. Passed to `input-otp` as `pattern`;
 * invalid keys and paste are rejected by the library.
 */
export type OtpCharacterSet = 'digits-only' | 'digits-and-letters'

export type OtpVerificationInputConfig = {
  /** Number of OTP cells (must match backend / email code length). */
  length: number
  /** Allowed characters: digits only, or letters + digits (no symbols). */
  characterSet: OtpCharacterSet
}

/**
 * Single place to tune OTP UX (length and allowed chars).
 * Change `length` or `characterSet` here only — UI and validation follow.
 */
export const OTP_VERIFICATION_INPUT_CONFIG: OtpVerificationInputConfig = {
  length: 6,
  characterSet: 'digits-only',
}

export function getOtpInputPattern(characterSet: OtpCharacterSet): string {
  return characterSet === 'digits-only'
    ? REGEXP_ONLY_DIGITS
    : REGEXP_ONLY_DIGITS_AND_CHARS
}

export function getOtpInputMode(
  characterSet: OtpCharacterSet
): 'numeric' | 'text' {
  return characterSet === 'digits-only' ? 'numeric' : 'text'
}

/** Copy fragment, e.g. `6-digit` or `8-character`. */
export function getOtpCodeDescriptor(
  length: number,
  characterSet: OtpCharacterSet
): string {
  if (characterSet === 'digits-only') {
    return `${length}-digit`
  }
  return `${length}-character`
}

/** Indices for left / right groups (hairline between), e.g. [0,1,2] | [3,4,5]. */
export function getOtpSlotGroupIndices(length: number): [number[], number[]] {
  const mid = Math.ceil(length / 2)
  const left = Array.from({ length: mid }, (_, i) => i)
  const right = Array.from({ length: length - mid }, (_, i) => i + mid)
  return [left, right]
}
