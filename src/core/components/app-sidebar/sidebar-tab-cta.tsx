import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { useUserState } from '@/core/hooks/user-state.hook'
import { useSidebar } from '@/shared/ui/sidebar'
import { cn } from '@/shared/utils'

import AppSidebarPaymentCTA from './sidebar-payment-cta'
import { StylesContent } from './sidebar-styles-content'

type Tab = 'styles' | 'upgrade'

const TABS: { id: Tab; label: string }[] = [
  { id: 'styles', label: 'Styles' },
  { id: 'upgrade', label: 'Upgrade Plan' },
]

function AppSidebarTabCTA() {
  const [shouldRender, setShouldRender] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('styles')

  const user = useUserState()
  const { state } = useSidebar()
  const isExpanded = state === 'expanded'
  const isFreePlan = user?.plan === 'Free'

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
          {/* Tab toggle — only shown for free plan */}
          {isFreePlan && (
            <div className="bg-muted flex gap-1 rounded-md p-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 rounded-md px-3 py-1 text-xs font-medium transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Tab content */}
          <AnimatePresence mode="wait" initial={false}>
            {!isFreePlan || activeTab === 'styles' ? (
              <motion.div
                key="styles"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <StylesContent />
              </motion.div>
            ) : (
              <motion.div
                key="upgrade"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <AppSidebarPaymentCTA />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default AppSidebarTabCTA
