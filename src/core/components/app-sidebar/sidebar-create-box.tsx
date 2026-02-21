import { useNavigate } from '@tanstack/react-router'
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
  url: '/drafts',
  icon: FolderClosed,
}

function AppSidebarCreateBox() {
  const { isMobile, setOpenMobile } = useSidebar()
  const navigate = useNavigate()

  const handleMobileClose = () => {
    if (isMobile) setOpenMobile(false)
  }

  const handleCreateClick = () => {
    navigate({ to: '/creation/create' })
    handleMobileClose()
  }

  return (
    <SidebarGroup className="bg-muted border-y-1 pt-4">
      <SidebarGroupLabel className="sr-only">Create</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Create Post"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/80 active:text-primary-foreground cursor-pointer rounded-sm py-2 font-medium shadow-xs"
              onClick={handleCreateClick}
            >
              <Plus />
              <span className="transition-opacity duration-200">
                Create Post
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <AppSideBarItem item={savedWorkItem} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarCreateBox
