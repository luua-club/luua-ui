import { useRouter } from '@tanstack/react-router'
import { Box } from 'lucide-react'

import { AnimatedGradientText } from '@/shared/ui/animated-gradient-text'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { useSidebar } from '@/shared/ui/sidebar'

function AppSidebarPaymentCTA() {
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Card className="flex h-24 flex-col items-center justify-center gap-4 border-none p-2 shadow-none">
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

          if (isMobile) {
            setOpenMobile(false)
          }
        }}
      >
        <Box /> Upgrade Plan
      </Button>
    </Card>
  )
}

export default AppSidebarPaymentCTA
