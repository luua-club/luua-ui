import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { CalendarDays, ChevronRight, FolderClosed, List } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/core/hooks/global-state.hook'
import { SidebarLinkItem } from '@/core/models/sidebar.model'
import {
  clearStatusFilter,
  setStatusFilter,
} from '@/core/store/posts-view-slice'
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

interface AppSidebarAllPostsProps {
  item: SidebarLinkItem
}

function AppSidebarAllPosts({ item }: AppSidebarAllPostsProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isMobile, setOpenMobile, state: sidebarState } = useSidebar()
  const statusFilter = useAppSelector(
    state => state.postsViewState.statusFilter
  )
  const pathname = useRouterState({ select: s => s.location.pathname })

  const [open, setOpen] = useState(true)

  const isPostsRoute = pathname.startsWith('/posts-view')
  const isDraftsRoute = pathname.startsWith('/drafts')
  const isParentActive = isPostsRoute || isDraftsRoute

  useEffect(() => {
    if (sidebarState !== 'expanded') {
      setOpen(false)
      return
    }

    setOpen(true)
  }, [sidebarState])

  const handleMobileClose = () => {
    if (isMobile) setOpenMobile(false)
  }

  const handleAllClick = () => {
    dispatch(clearStatusFilter())
    navigate({ to: '/posts-view/calendar' })
    handleMobileClose()
  }

  const handleScheduledClick = () => {
    dispatch(setStatusFilter('Scheduled'))
    navigate({ to: '/posts-view/calendar' })
    handleMobileClose()
  }

  const ParentIcon = item.icon
  const isAllActive = isPostsRoute && statusFilter === 'all'
  const isScheduledActive = isPostsRoute && statusFilter === 'Scheduled'

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
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    'cursor-pointer',
                    isParentActive &&
                      'dark:bg-sidebar-accent font-semibold text-black dark:font-bold dark:text-white'
                  )}
                >
                  {ParentIcon && <ParentIcon />}
                  <span className="truncate">{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      onClick={handleAllClick}
                      className={cn(
                        'cursor-pointer',
                        isAllActive &&
                          'bg-sidebar-accent font-semibold text-black dark:font-bold dark:text-white'
                      )}
                    >
                      <List />
                      <span>All</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      onClick={handleScheduledClick}
                      className={cn(
                        'cursor-pointer',
                        isScheduledActive &&
                          'bg-sidebar-accent font-semibold text-black dark:font-bold dark:text-white'
                      )}
                    >
                      <CalendarDays />
                      <span>Schedule</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link
                        to="/drafts"
                        onClick={handleMobileClose}
                        className="dark:[&.active]:bg-sidebar-accent [&.active]:font-semibold [&.active]:text-black dark:[&.active]:font-bold dark:[&.active]:text-white"
                      >
                        <FolderClosed />
                        <span>Saved Drafts</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarAllPosts
