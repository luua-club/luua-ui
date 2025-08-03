import { createLazyRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

import { useUserState } from '@/core/hooks/user-state.hook'
import GlobalLoader from '@/shared/components/global-loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import Account from '../containers/Account'

const Preferences = lazy(() => import('../containers/Preferences'))
const Socials = lazy(() => import('../containers/Socials'))

const Settings = () => {
  const user = useUserState()

  //TODO: Implement loading state
  if (!user) {
    return (
      <div className="h-50">
        <GlobalLoader />
      </div>
    )
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col p-5">
      <Tabs className="w-full" defaultValue="account">
        <TabsList className="w-full px-2 py-6 lg:w-fit">
          <TabsTrigger
            value="account"
            className="px-2 py-4 text-sm lg:px-4 lg:text-base"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="socials"
            className="px-2 py-4 text-sm lg:px-4 lg:text-base"
          >
            Socials
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="px-2 py-4 text-sm lg:px-4 lg:text-base"
          >
            Styles
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <SettingLazySubPages>
            <Account user={user} />
          </SettingLazySubPages>
        </TabsContent>
        <TabsContent value="socials">
          <SettingLazySubPages>
            <Socials />
          </SettingLazySubPages>
        </TabsContent>
        <TabsContent value="preferences">
          <SettingLazySubPages>
            <Preferences />
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
        <div className="h-50">
          <GlobalLoader />
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
