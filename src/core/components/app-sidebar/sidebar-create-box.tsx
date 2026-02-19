import { Link } from '@tanstack/react-router'
import { FolderClosed, Plus } from 'lucide-react'

import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar'

import AppSideBarItem from './sidebar-item'

const savedWorkItem: ISidebarItem = {
  title: 'Saved Work',
  url: '/creation/drafts',
  icon: FolderClosed,
}

function AppSidebarCreateBox() {
  const { isMobile, setOpenMobile } = useSidebar()

  const handleMobileClose = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarGroup className="mt-2 mb-4 border-t-2 border-b-2 border-dotted pt-2">
      <SidebarGroupLabel className="sr-only">Create</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Create Post"
              asChild
              className="bg-accent-foreground/5 text-primary font-medium"
            >
              <Link to={'/creation/create'} onClick={handleMobileClose}>
                <Plus />
                <span className="transition-opacity duration-200">
                  Create Post
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <AppSideBarItem item={savedWorkItem} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarCreateBox
