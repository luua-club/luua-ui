import {
  DEFAULT_SETTINGS_TAB,
  SETTINGS_GROUPS,
} from '../config/settings.config'
import { settingsTabType } from '../models/settings-tabs.model'

export function resolveSettingTab(tab: unknown): settingsTabType {
  const tabValue = String(tab ?? '').trim()

  if (
    SETTINGS_GROUPS.some(group =>
      group.items.some(item => item.id === tabValue)
    )
  ) {
    return tabValue as settingsTabType
  }

  return DEFAULT_SETTINGS_TAB
}

export function getSettingsItemByTab(tab: settingsTabType) {
  return (
    SETTINGS_GROUPS.flatMap(group => group.items).find(
      item => item.id === tab
    ) ?? SETTINGS_GROUPS[0].items[0]
  )
}
