import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  CalendarDays,
  ChevronRight,
  FileCheck,
  LayoutDashboard,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAppDispatch } from '@/core/hooks/global-state.hook'
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

function AppSidebarAllPosts() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isMobile, setOpenMobile, state: sidebarState } = useSidebar()
  const [open, setOpen] = useState(true)

  const pathname = useRouterState({ select: s => s.location.pathname })
  const isActive = pathname.startsWith('/posts-view')

  // Sync collapsible open state with sidebar icon collapse
  useEffect(() => {
    setOpen(sidebarState === 'expanded')
  }, [sidebarState])

  const handleMobileClose = () => {
    if (isMobile) setOpenMobile(false)
  }

  const handleAllPostsClick = () => {
    dispatch(clearStatusFilter())
    navigate({ to: '/posts-view/calendar' })
    handleMobileClose()
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
                <SidebarMenuButton
                  tooltip="All Posts"
                  onClick={handleAllPostsClick}
                  className={cn(
                    'cursor-pointer',
                    isActive &&
                      'dark:bg-sidebar-accent font-semibold text-black dark:font-bold dark:text-white'
                  )}
                >
                  <LayoutDashboard />
                  <span className="truncate">All Posts</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link
                        to="/posts-view/calendar"
                        onClick={() => {
                          dispatch(setStatusFilter('Scheduled'))
                          handleMobileClose()
                        }}
                      >
                        <CalendarDays />
                        <span>Schedule</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link
                        to="/posts-view/calendar"
                        onClick={() => {
                          dispatch(setStatusFilter('Published'))
                          handleMobileClose()
                        }}
                      >
                        <FileCheck />
                        <span>Published</span>
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
