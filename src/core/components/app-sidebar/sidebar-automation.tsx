import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { automationGroup } from '@/core/config/sidebar.config'
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
import { cn } from '@/shared/utils'

function AppSidebarAutomation() {
  const { isMobile, setOpenMobile, state: sidebarState } = useSidebar()
  const pathname = useRouterState({ select: s => s.location.pathname })
  const [open, setOpen] = useState(true)

  const activePrefixes = automationGroup.activePrefixes ?? []
  const isAnyChildActive = activePrefixes.some(prefix =>
    pathname.startsWith(prefix)
  )

  useEffect(() => {
    if (sidebarState !== 'expanded') {
      setOpen(false)
      return
    }

    setOpen(Boolean(automationGroup.defaultOpen))
  }, [sidebarState])

  const handleMobileClose = () => {
    if (isMobile) setOpenMobile(false)
  }

  const ParentIcon = automationGroup.icon

  return (
    <SidebarGroup className="py-0 pt-2">
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
                <SidebarMenuButton
                  tooltip={automationGroup.title}
                  className={cn(
                    'cursor-pointer',
                    isAnyChildActive &&
                      'dark:bg-sidebar-accent font-semibold text-black dark:font-bold dark:text-white'
                  )}
                >
                  {ParentIcon && <ParentIcon />}
                  <span className="truncate">{automationGroup.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                <SidebarMenuSub>
                  {automationGroup.children.map(item => (
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
