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
    <SidebarGroup className="border-b-1 pt-2">
      <SidebarGroupLabel className="sr-only">Create</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Create Post"
              className="cursor-pointer rounded-sm bg-blue-700/85 py-2 font-medium text-white shadow-xs backdrop-blur-sm hover:bg-blue-700/95 hover:text-white active:bg-blue-800 active:text-white"
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
