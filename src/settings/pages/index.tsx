import {
  createLazyRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { CableIcon, CircleUser, DollarSign, Loader } from 'lucide-react'
import { Suspense, useEffect, useMemo, useState } from 'react'

import Socials from '@/core/containers/socials'
import { useUserState } from '@/core/hooks/user-state.hook'
import { Separator } from '@/shared/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import Account from '../containers/Account'
import BillingAndCredits from '../containers/BillingAndCredits'

const tabValue = ['account', 'socials', 'billing']

const Settings = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )
  const [activeTab, setActiveTab] = useState<string>(tabValue[0])

  useEffect(() => {
    let query = searchParams.get('tabs')

    if (!query) {
      query = tabValue[0]
    }

    if (!tabValue.includes(query)) {
      query = tabValue[0]
    }

    setActiveTab(query)
  }, [searchParams])

  const user = useUserState()

  if (!user) {
    return (
      <div className="flex h-50 items-center justify-center">
        <Loader className="size-4 animate-spin" />
      </div>
    )
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col p-5">
      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={(value: string) => {
          navigate({ to: '/settings', search: { tabs: value }, replace: true })
        }}
      >
        <TabsList className="w-full px-2 py-6 lg:w-fit">
          <TabsTrigger value={tabValue[0]} className="px-2 py-4 text-xs">
            <CircleUser /> Account
          </TabsTrigger>
          <TabsTrigger value={tabValue[1]} className="px-2 py-4 text-xs">
            <CableIcon /> Socials
          </TabsTrigger>
          <TabsTrigger value={tabValue[2]} className="px-2 py-4 text-xs">
            <DollarSign /> Billing & Credits
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tabValue[0]}>
          <SettingLazySubPages>
            <Account user={user} />
          </SettingLazySubPages>
        </TabsContent>
        <TabsContent value={tabValue[1]}>
          <SettingLazySubPages>
            <div className="py-4">
              <h1 className="text-lg font-medium">Social Platforms</h1>
            </div>
            <Separator />
            <p className="text-muted-foreground mt-4 mb-8 text-sm text-balance lg:max-w-2xl">
              Connect your LinkedIn or X/Twitter safely — we use official
              integrations and never access your personal data. Every post goes
              live only after you approve it.
            </p>
            <Socials user={user} />
          </SettingLazySubPages>
        </TabsContent>
        <TabsContent value={tabValue[2]}>
          <SettingLazySubPages>
            <BillingAndCredits />
          </SettingLazySubPages>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const SettingLazySubPages = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-50 items-center justify-center">
          <Loader className="size-4 animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const Route = createLazyRoute('/settings')({
  component: Settings,
})

export default Settings
