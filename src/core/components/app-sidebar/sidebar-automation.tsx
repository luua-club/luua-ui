import { Link } from '@tanstack/react-router'
import { ChevronRight, Network } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ungroupedItems } from '@/core/config/sidebar.config'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/shared/ui/sidebar'

const automationItems = ungroupedItems.filter(
  item => item.url === '/bookmarks' || item.url === '/autopilot'
)

function AppSidebarAutomation() {
  const { isMobile, setOpenMobile, state: sidebarState } = useSidebar()
  const [open, setOpen] = useState(true)

  useEffect(() => {
    setOpen(sidebarState === 'expanded')
  }, [sidebarState])

  const handleMobileClose = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupContent>
        <SidebarMenu>
          <Collapsible
            open={open}
            onOpenChange={setOpen}
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Automation">
                  <Network />
                  <span className="truncate">Automation</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                <SidebarMenuSub>
                  {automationItems.map(item => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          to={item.url}
                          onClick={handleMobileClose}
                          className="dark:[&.active]:bg-sidebar-accent [&.active]:font-semibold [&.active]:text-black dark:[&.active]:font-bold dark:[&.active]:text-white"
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarAutomation
