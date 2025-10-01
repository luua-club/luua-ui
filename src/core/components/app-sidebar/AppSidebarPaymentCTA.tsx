import { useRouter } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Box } from 'lucide-react'
import { useEffect, useState } from 'react'

import { AnimatedGradientText } from '@/shared/ui/animated-gradient-text'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { useSidebar } from '@/shared/ui/sidebar'
import { cn } from '@/shared/utils'

function AppSidebarPaymentCTA() {
  const { state } = useSidebar()
  const isExpanded = state === 'expanded'
  const [shouldRender, setShouldRender] = useState(false)
  const router = useRouter()

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
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isExpanded])

  return (
    <AnimatePresence initial={false}>
      {shouldRender ? (
        <motion.div
          key="payment-cta"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className={cn('group-data-[collapsible=icon]:hidden')}
        >
          <Card className="bg-card flex flex-col items-center justify-center gap-4 rounded-xl border-dashed p-4 shadow-none dark:border-double dark:border-zinc-800 dark:bg-black">
            <p className="text-sm text-balance">
              Upgrade your plan to
              <span className="mx-1">
                <AnimatedGradientText className="text-sm font-bold">
                  Pro
                </AnimatedGradientText>
              </span>
              for more freedom and reach.
            </p>

            <Button
              variant="default"
              className="dark:bg-brand-accent-yellow !h-8 w-full text-xs dark:font-semibold"
              onClick={() => {
                router.navigate({ to: '/payments' })
              }}
            >
              <Box /> Upgrade Plan
            </Button>
          </Card>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default AppSidebarPaymentCTA
