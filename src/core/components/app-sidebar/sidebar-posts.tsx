import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/shared/ui/sidebar'

import AppSideBarItem from './sidebar-item'

interface IAppSidebarPostsProps {
  postsItems?: ISidebarItem[]
}

function AppSidebarPosts({ postsItems }: IAppSidebarPostsProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span className="dark:text-white">Posts</span>
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {postsItems?.map(item => (
            <AppSideBarItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarPosts
