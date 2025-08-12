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
import { useSidebar } from '@/shared/ui/sidebar'
import { cn } from '@/shared/utils'

import AppSidebarCollapsedItem from './AppSidebarCollapsedItem'

interface IAppSidebarCreationProps {
  creationsData?: ISidebarItem[]
}

function AppSidebarCreation({ creationsData }: IAppSidebarCreationProps) {
  const { state } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span className="dark:text-white">Creations</span>
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <CreateNewSidebarMenuButton />
        {creationsData && creationsData.length > 0 ? (
          <SidebarMenu>
            {creationsData.map(data => (
              <AppSidebarCollapsedItem key={data.title} item={data} />
            ))}
          </SidebarMenu>
        ) : (
          state === 'expanded' && (
            <span
              className={cn(
                'truncate rounded-md border-1 border-dashed border-gray-300 p-4 text-xs text-gray-500',
                'dark:border-gray-400 dark:text-gray-400'
              )}
            >
              Create new to get started,
              <br />
              or interact with chat on dashboard
            </span>
          )
        )}
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground w-full min-w-8 cursor-pointer duration-200 ease-linear"
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
