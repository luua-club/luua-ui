import { Loader2, MoreHorizontal, TriangleAlert } from 'lucide-react'

import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { isSocialConnected } from '@/core/config/utils/social.utils'
import { useUserState } from '@/core/hooks/user-state.hook'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

interface ICreateDraftTabListProps {
  selectedSocials: string[]
  toggleSocial: (name: string, checked: boolean) => void
}

const CreateDraftTabList = ({
  selectedSocials,
  toggleSocial,
}: ICreateDraftTabListProps) => {
  const user = useUserState()

  if (!user) {
    return (
      <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-lg">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  return (
    <TabsList className="w-full px-2 py-6 lg:w-fit">
      {selectedSocials.map(name => (
        <TabsTrigger key={name} value={name} className="px-2 py-4 text-xs">
          {(() => {
            const sp = SOCIAL_PLATFORM.find(s => s.name === name)
            if (!sp) return name
            const Icon = sp.logo
            return (
              <>
                <Icon className="size-4" />
                {name}
                {!isSocialConnected(name, user) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TriangleAlert className="size-4 shrink-0 animate-pulse text-yellow-600" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{name} account not connected</span>
                    </TooltipContent>
                  </Tooltip>
                )}
              </>
            )
          })()}
        </TabsTrigger>
      ))}

      <div className="ml-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={selectedSocials.length === 0}>
            <Button variant="outline" className="!px-2">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {SOCIAL_PLATFORM.map(sp => (
              <DropdownMenuCheckboxItem
                key={sp.name}
                checked={selectedSocials.includes(sp.name)}
                onCheckedChange={val => toggleSocial(sp.name, Boolean(val))}
              >
                {sp.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TabsList>
  )
}

export default CreateDraftTabList
