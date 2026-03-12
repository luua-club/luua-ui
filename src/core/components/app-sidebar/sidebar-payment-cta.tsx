import { ShieldCheck } from 'lucide-react'

import { Card } from '@/shared/ui/card'

function AppSidebarPaymentCTA() {
  return (
    <Card className="flex h-24 flex-col items-center justify-center gap-2 border-none p-2 text-center shadow-none">
      <ShieldCheck className="size-4 text-emerald-600" />
      <p className="text-sm text-balance">
        Pro features are enabled for all accounts.
      </p>
    </Card>
  )
}

export default AppSidebarPaymentCTA
