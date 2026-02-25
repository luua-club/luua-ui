// Mathematical Bold: A–Z → U+1D400–U+1D419, a–z → U+1D41A–U+1D433, 0–9 → U+1D7CE–U+1D7D7
const BOLD_UPPER_OFFSET = 0x1d400 - 0x41
const BOLD_LOWER_OFFSET = 0x1d41a - 0x61
const BOLD_DIGIT_OFFSET = 0x1d7ce - 0x30

// Mathematical Italic: A–Z → U+1D434–U+1D44D, a–z → U+1D44E–U+1D467
// Exception: h (0x68) has no slot → ℎ (U+210E)
const ITALIC_UPPER_OFFSET = 0x1d434 - 0x41
const ITALIC_LOWER_OFFSET = 0x1d44e - 0x61
const ITALIC_H_REPLACEMENT = '\u210E'

function boldChar(c: string): string {
  const code = c.charCodeAt(0)
  if (code >= 0x41 && code <= 0x5a)
    return String.fromCodePoint(code + BOLD_UPPER_OFFSET)
  if (code >= 0x61 && code <= 0x7a)
    return String.fromCodePoint(code + BOLD_LOWER_OFFSET)
  if (code >= 0x30 && code <= 0x39)
    return String.fromCodePoint(code + BOLD_DIGIT_OFFSET)
  return c
}

function italicChar(c: string): string {
  const code = c.charCodeAt(0)
  if (code >= 0x41 && code <= 0x5a)
    return String.fromCodePoint(code + ITALIC_UPPER_OFFSET)
  if (code >= 0x61 && code <= 0x7a) {
    if (code === 0x68) return ITALIC_H_REPLACEMENT // h → ℎ
    return String.fromCodePoint(code + ITALIC_LOWER_OFFSET)
  }
  return c
}

export function applyBold(text: string): string {
  return [...text].map(boldChar).join('')
}

export function applyItalic(text: string): string {
  return [...text].map(italicChar).join('')
}

// U+0336 = COMBINING LONG STROKE OVERLAY (strikethrough)
export function applyStrikethrough(text: string): string {
  return [...text].map(c => c + '\u0336').join('')
}

export function applyBullet(text: string): string {
  return text
    .split('\n')
    .map(line => (line.trim() ? `• ${line}` : line))
    .join('\n')
}

export function applyNumbered(text: string): string {
  let counter = 1
  return text
    .split('\n')
    .map(line => {
      if (line.trim()) return `${counter++}. ${line}`
      return line
    })
    .join('\n')
}
