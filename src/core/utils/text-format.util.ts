const STRIKE_MARK = '\u0336'

const ASCII_UPPER_A = 0x41
const ASCII_UPPER_Z = 0x5a
const ASCII_LOWER_A = 0x61
const ASCII_LOWER_Z = 0x7a
const ASCII_DIGIT_0 = 0x30
const ASCII_DIGIT_9 = 0x39

const BOLD_UPPER_START = 0x1d400
const BOLD_LOWER_START = 0x1d41a
const BOLD_DIGIT_START = 0x1d7ce

const ITALIC_UPPER_START = 0x1d434
const ITALIC_LOWER_START = 0x1d44e
const ITALIC_H = 0x210e

const BOLD_ITALIC_UPPER_START = 0x1d468
const BOLD_ITALIC_LOWER_START = 0x1d482

type CharStyleInfo = {
  base: string
  bold: boolean
  italic: boolean
}

const STYLE_MAP = new Map<string, CharStyleInfo>()
const ENCODE_MAP = new Map<string, string>()

function isAsciiUpper(code: number) {
  return code >= ASCII_UPPER_A && code <= ASCII_UPPER_Z
}

function isAsciiLower(code: number) {
  return code >= ASCII_LOWER_A && code <= ASCII_LOWER_Z
}

function isAsciiDigit(code: number) {
  return code >= ASCII_DIGIT_0 && code <= ASCII_DIGIT_9
}

function encodeKey(base: string, bold: boolean, italic: boolean) {
  return `${base}|${bold ? 1 : 0}|${italic ? 1 : 0}`
}

function italicLowerCodePointForIndex(index: number) {
  if (index === 7) return ITALIC_H // h

  // U+1D455 is missing only for h; other letters keep sequential offsets.
  return ITALIC_LOWER_START + index
}

function registerMapping(
  char: string,
  base: string,
  bold: boolean,
  italic: boolean
) {
  STYLE_MAP.set(char, { base, bold, italic })
  ENCODE_MAP.set(encodeKey(base, bold, italic), char)
}

function initStyleMaps() {
  // Plain ASCII letters and digits.
  for (let code = ASCII_UPPER_A; code <= ASCII_UPPER_Z; code += 1) {
    const base = String.fromCodePoint(code)
    registerMapping(base, base, false, false)
  }

  for (let code = ASCII_LOWER_A; code <= ASCII_LOWER_Z; code += 1) {
    const base = String.fromCodePoint(code)
    registerMapping(base, base, false, false)
  }

  for (let code = ASCII_DIGIT_0; code <= ASCII_DIGIT_9; code += 1) {
    const base = String.fromCodePoint(code)
    registerMapping(base, base, false, false)
  }

  // Bold letters and digits.
  for (let i = 0; i < 26; i += 1) {
    registerMapping(
      String.fromCodePoint(BOLD_UPPER_START + i),
      String.fromCodePoint(ASCII_UPPER_A + i),
      true,
      false
    )

    registerMapping(
      String.fromCodePoint(BOLD_LOWER_START + i),
      String.fromCodePoint(ASCII_LOWER_A + i),
      true,
      false
    )
  }

  for (let i = 0; i < 10; i += 1) {
    registerMapping(
      String.fromCodePoint(BOLD_DIGIT_START + i),
      String.fromCodePoint(ASCII_DIGIT_0 + i),
      true,
      false
    )
  }

  // Italic letters.
  for (let i = 0; i < 26; i += 1) {
    registerMapping(
      String.fromCodePoint(ITALIC_UPPER_START + i),
      String.fromCodePoint(ASCII_UPPER_A + i),
      false,
      true
    )

    registerMapping(
      String.fromCodePoint(italicLowerCodePointForIndex(i)),
      String.fromCodePoint(ASCII_LOWER_A + i),
      false,
      true
    )
  }

  // Bold-italic letters.
  for (let i = 0; i < 26; i += 1) {
    registerMapping(
      String.fromCodePoint(BOLD_ITALIC_UPPER_START + i),
      String.fromCodePoint(ASCII_UPPER_A + i),
      true,
      true
    )

    registerMapping(
      String.fromCodePoint(BOLD_ITALIC_LOWER_START + i),
      String.fromCodePoint(ASCII_LOWER_A + i),
      true,
      true
    )
  }
}

initStyleMaps()

function encodeStyledChar(
  base: string,
  bold: boolean,
  italic: boolean
): string {
  const code = base.codePointAt(0)

  if (code === undefined) return base

  // Digits don't have italic unicode variants, so preserve only bold.
  if (isAsciiDigit(code)) {
    const digitKey = encodeKey(base, bold, false)
    return ENCODE_MAP.get(digitKey) ?? base
  }

  // Letters support all combinations.
  if (isAsciiLower(code) || isAsciiUpper(code)) {
    return ENCODE_MAP.get(encodeKey(base, bold, italic)) ?? base
  }

  return base
}

function toggleStyle(text: string, mode: 'bold' | 'italic'): string {
  return [...text]
    .map(char => {
      // Keep strike overlay unchanged.
      if (char === STRIKE_MARK) return char

      const info = STYLE_MAP.get(char)
      if (!info) return char

      const nextBold = mode === 'bold' ? !info.bold : info.bold
      const nextItalic = mode === 'italic' ? !info.italic : info.italic

      return encodeStyledChar(info.base, nextBold, nextItalic)
    })
    .join('')
}

export function applyBold(text: string): string {
  return toggleStyle(text, 'bold')
}

export function applyItalic(text: string): string {
  return toggleStyle(text, 'italic')
}

export function applyStrikethrough(text: string): string {
  const chars = [...text]

  let hasBaseChars = false
  let allCharsStruck = true

  for (let i = 0; i < chars.length; i += 1) {
    if (chars[i] === STRIKE_MARK) continue
    hasBaseChars = true

    if (chars[i + 1] !== STRIKE_MARK) {
      allCharsStruck = false
    }
  }

  if (!hasBaseChars) return text

  let output = ''

  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i]

    if (char === STRIKE_MARK) continue

    const hasStrikeAfter = chars[i + 1] === STRIKE_MARK

    if (allCharsStruck) {
      output += char
      if (hasStrikeAfter) i += 1
      continue
    }

    output += char

    if (hasStrikeAfter) {
      output += STRIKE_MARK
      i += 1
    } else {
      output += STRIKE_MARK
    }
  }

  return output
}

export function applyBullet(text: string): string {
  const lines = text.split('\n')
  const nonEmptyLines = lines.filter(line => line.trim())

  if (nonEmptyLines.length === 0) return text

  const allBulleted = nonEmptyLines.every(line => /^\s*•\s+/.test(line))

  if (allBulleted) {
    return lines.map(line => line.replace(/^(\s*)•\s+/, '$1')).join('\n')
  }

  return lines.map(line => (line.trim() ? `• ${line}` : line)).join('\n')
}

export function applyNumbered(text: string): string {
  const lines = text.split('\n')
  const nonEmptyLines = lines.filter(line => line.trim())

  if (nonEmptyLines.length === 0) return text

  const allNumbered = nonEmptyLines.every(line => /^\s*\d+\.\s+/.test(line))

  if (allNumbered) {
    return lines.map(line => line.replace(/^(\s*)\d+\.\s+/, '$1')).join('\n')
  }

  let counter = 1
  return lines
    .map(line => {
      if (!line.trim()) return line
      return `${counter++}. ${line}`
    })
    .join('\n')
}

export function clearTextFormatting(text: string): string {
  const chars = [...text]
  let output = ''

  for (const char of chars) {
    if (char === STRIKE_MARK) {
      continue
    }

    const info = STYLE_MAP.get(char)

    if (info) {
      output += info.base
    } else {
      output += char
    }
  }

  return output
}

export function hasStylizedUnicodeFormatting(text: string): boolean {
  for (const char of [...text]) {
    if (char === STRIKE_MARK) return true

    const styleInfo = STYLE_MAP.get(char)
    if (styleInfo && (styleInfo.bold || styleInfo.italic)) {
      return true
    }
  }

  return false
}
