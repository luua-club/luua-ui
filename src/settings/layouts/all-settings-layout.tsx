import type { ReactNode } from 'react'

import type { UserState } from '@/core/models/user.model'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

import AsideGroupSetting from '../components/aside-group-setting'
import {
  SETTINGS_GROUPS,
  type settingsTabType,
} from '../config/settings.config'

type AllSettingsLayoutProps = {
  user: UserState
  activeTab: settingsTabType
  onTabChange: (tab: settingsTabType) => void
  children: ReactNode
}

function AllSettingsLayout({
  user,
  activeTab,
  onTabChange,
  children,
}: AllSettingsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="bg-sidebar border-b p-4 lg:w-72 lg:border-r lg:border-b-0">
        {/* Mobile: grouped select dropdown */}
        <div className="space-y-1.5 lg:hidden">
          <p className="text-muted-foreground text-center text-xs font-medium">
            Settings
          </p>
          <Select
            value={activeTab}
            onValueChange={v => onTabChange(v as settingsTabType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SETTINGS_GROUPS.map(group => (
                <SelectGroup key={group.id}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.items.map(item => {
                    const label =
                      typeof item.label === 'function'
                        ? item.label(user)
                        : item.label
                    return (
                      <SelectItem key={item.id} value={item.id}>
                        {label}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: full sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:space-y-6">
          {SETTINGS_GROUPS.map(group => (
            <AsideGroupSetting
              key={group.id}
              group={group}
              user={user}
              activeTab={activeTab}
              onItemSelect={onTabChange}
            />
          ))}
        </div>
      </aside>
      <section className="flex-1 p-4 sm:p-6 lg:p-8">{children}</section>
    </div>
  )
}

export default AllSettingsLayout
