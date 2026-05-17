import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { useSidebar } from '@/shared/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { cn } from '@/shared/utils'

import { StylesContent } from './sidebar-styles-content'
import SidebarUpgradeContent from './sidebar-upgrade-content'

function AppSidebarTabCTA() {
  const [shouldRender, setShouldRender] = useState(false)

  const { state } = useSidebar()
  const isExpanded = state === 'expanded'

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (isExpanded) {
      timeoutId = setTimeout(() => {
        setShouldRender(true)
      }, 220)
    } else {
      setShouldRender(false)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isExpanded])

  return (
    <AnimatePresence initial={false}>
      {shouldRender ? (
        <motion.div
          key="tab-cta"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className={cn(
            'flex flex-col gap-2 group-data-[collapsible=icon]:hidden',
            'bg-background rounded-lg border border-dashed p-2'
          )}
        >
          <Tabs defaultValue="styles" className="gap-2">
            <TabsList className="h-8 w-full rounded-md p-1">
              <TabsTrigger value="styles" className="text-[11px]">
                Styles
              </TabsTrigger>
              <TabsTrigger value="upgrade" className="text-[11px]">
                Upgrade
              </TabsTrigger>
            </TabsList>

            <TabsContent value="styles" className="mt-0 h-[184px]">
              <StylesContent />
            </TabsContent>

            <TabsContent value="upgrade" className="mt-0 h-[184px]">
              <SidebarUpgradeContent />
            </TabsContent>
          </Tabs>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default AppSidebarTabCTA
