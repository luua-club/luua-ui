import { useRouter } from '@tanstack/react-router'
import { LucideCirclePlus, LucideStepForward } from 'lucide-react'

import { ISidebarItem } from '@/core/models/sidebar.model'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/shared/ui/sidebar'
import { SidebarMenuItem } from '@/shared/ui/sidebar'
import { SidebarMenuButton } from '@/shared/ui/sidebar'

import AppSidebarCollapsedItem from './AppSidebarCollapsedItem'

interface IAppSidebarCreationProps {
  creationsData: ISidebarItem[]
}

function AppSidebarCreation({ creationsData }: IAppSidebarCreationProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span className="dark:text-white">Creations</span>
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <CreateNewSidebarMenuButton />
        <SidebarMenu>
          {creationsData.map(data => (
            <AppSidebarCollapsedItem key={data.title} item={data} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

const CreateNewSidebarMenuButton = () => {
  const router = useRouter()

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <SidebarMenuButton
          tooltip="Create New"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground w-full min-w-8 cursor-pointer"
          onClick={() => {
            router.navigate({ to: '/creation/create' })
          }}
        >
          <LucideCirclePlus />
          <div className="flex w-full items-center justify-between">
            <span className="truncate">Create New</span>
            <LucideStepForward className="size-4" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default AppSidebarCreation
