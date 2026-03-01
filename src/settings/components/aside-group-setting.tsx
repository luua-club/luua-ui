import type { UserState } from '@/core/models/user.model'
import { extractUserInitial } from '@/core/utils/common.util'
import type {
  settingsGroupType,
  settingsTabType,
} from '@/settings/config/settings.config'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/utils'

type AsideGroupSettingProps = {
  group: settingsGroupType
  user: UserState | null
  activeTab: settingsTabType
  onItemSelect: (tab: settingsTabType) => void
}

function AsideGroupSetting({
  group,
  user,
  activeTab,
  onItemSelect,
}: AsideGroupSettingProps) {
  return (
    <div className="shrink-0">
      <p className="text-muted-foreground hidden px-2 pb-2 text-xs font-semibold tracking-wide lg:block">
        {group.label}
      </p>

      <nav className="flex gap-1 lg:grid">
        {group.items.map(item => {
          const isActive = item.id === activeTab
          const itemLabel =
            typeof item.label === 'function' ? item.label(user) : item.label
          const ItemIcon = item.icon

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'text-foreground flex w-full items-center rounded-md px-2 py-2 text-left whitespace-nowrap transition-colors hover:cursor-pointer',
                isActive && 'bg-sidebar-accent'
              )}
            >
              {item.kind === 'profile' ? (
                <>
                  <Avatar className="size-5 rounded-full">
                    <AvatarImage
                      src={user?.profile_image ?? undefined}
                      alt={itemLabel}
                    />
                    <AvatarFallback className="bg-muted rounded-full text-xs font-medium">
                      {extractUserInitial(itemLabel)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate pl-2 text-sm leading-none font-medium">
                    {itemLabel}
                  </span>
                </>
              ) : (
                <>
                  <ItemIcon className="text-muted-foreground size-4 shrink-0" />
                  <span className="truncate pl-2 text-sm leading-none font-medium">
                    {itemLabel}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default AsideGroupSetting
