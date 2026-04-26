import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'

export const DEFAULT_LOGIN_PAGE_HEADER_TEXT = 'A Social media tool'
export const LOGIN_PAGE_HEADER_TEXT_KEY = 'luua-login-page-header-text'
export const LOGIN_PAGE_HEADER_TEXT_MAX_LENGTH = 80

export function normalizeLoginPageHeaderText(value: string) {
  return value.trim().slice(0, LOGIN_PAGE_HEADER_TEXT_MAX_LENGTH)
}

export function getLoginPageHeaderText() {
  const storedText = getLocalStorageItem<string>(LOGIN_PAGE_HEADER_TEXT_KEY)
  const normalizedText =
    typeof storedText === 'string'
      ? normalizeLoginPageHeaderText(storedText)
      : ''

  return normalizedText || DEFAULT_LOGIN_PAGE_HEADER_TEXT
}

export function setLoginPageHeaderText(value: string) {
  const normalizedText = normalizeLoginPageHeaderText(value)

  if (!normalizedText || normalizedText === DEFAULT_LOGIN_PAGE_HEADER_TEXT) {
    removeLoginPageHeaderText()
    return DEFAULT_LOGIN_PAGE_HEADER_TEXT
  }

  setLocalStorageItem(LOGIN_PAGE_HEADER_TEXT_KEY, normalizedText)
  return normalizedText
}

export function removeLoginPageHeaderText() {
  removeLocalStorageItem(LOGIN_PAGE_HEADER_TEXT_KEY)
}
