import {
  createLazyRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { CableIcon, CircleUser, DollarSign, Loader } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'

import { useUserState } from '@/core/hooks/user-state.hook'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import Account from '../containers/Account'
import BillingAndCredits from '../containers/BillingAndCredits'

const Socials = lazy(() => import('../containers/Socials'))

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
