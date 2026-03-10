import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { useSidebar } from '@/shared/ui/sidebar'
import { cn } from '@/shared/utils'

import { StylesContent } from './sidebar-styles-content'

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
          {/* Tab content */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key="styles"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <StylesContent />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default AppSidebarTabCTA
