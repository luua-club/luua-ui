import { LucideChevronRight } from 'lucide-react'

import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/collapsible'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from '@/shared/ui/sidebar'

import AppSideBarItem from './AppSidebarItem'

function AppSidebarCollapsedItem({ item }: { item: ISidebarItem }) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  if (isCollapsed) {
    return null
  }

  if (!item.children) {
    return <AppSideBarItem item={item} />
  }

  return (
    <Collapsible asChild defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} className="text-gray-500">
            {item.icon && item.icon}
            <span>{item.title}</span>
            <LucideChevronRight className="ml-auto text-gray-500 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map(subItem => (
              <AppSideBarItem key={subItem.title} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export default AppSidebarCollapsedItem
