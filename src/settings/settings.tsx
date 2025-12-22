import {
  createLazyRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { CableIcon, CircleUser, DollarSign, Loader } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'

import Socials from '@/core/containers/socials'
import { useUserState } from '@/core/hooks/user-state.hook'
import { Separator } from '@/shared/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

// Lazy load container components for better performance
const Account = lazy(() => import('./containers/accounts'))
const BillingAndCredits = lazy(() => import('./containers/billing-and-credits'))

// Define available tab values for navigation
const tabValue = ['account', 'socials', 'billing']

/**
 * Settings component - Main settings page with tabbed interface
 * Manages account, social platforms, and billing settings
 */
const Settings = () => {
  // --- Hooks ---
  const navigate = useNavigate()
  const location = useLocation()
  const user = useUserState()

  // --- State Management ---
  // Parse URL search parameters for tab navigation
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )
  const [activeTab, setActiveTab] = useState<string>(tabValue[0])

  // --- Effects ---
  /**
   * Sync active tab with URL query parameter
   */
  useEffect(() => {
    let query = searchParams.get('tabs')

    // Default to first tab if no query parameter
    if (!query) {
      query = tabValue[0]
    }

    // Validate query parameter and fallback to default if invalid
    if (!tabValue.includes(query)) {
      query = tabValue[0]
    }

    setActiveTab(query)
  }, [searchParams])

  // --- Early Returns ---
  if (!user) {
    return (
      <div className="flex h-50 items-center justify-center">
        <Loader className="size-4 animate-spin" />
      </div>
    )
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col p-5">
      {/* Tab navigation with URL sync */}
      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={(value: string) => {
          // Update URL when tab changes
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

        {/* Account Tab */}
        <TabsContent value={tabValue[0]}>
          <SettingLazySubPages>
            <Account user={user} />
          </SettingLazySubPages>
        </TabsContent>

        {/* Socials Tab */}
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

        {/* Billing & Credits Tab */}
        <TabsContent value={tabValue[2]}>
          <SettingLazySubPages>
            <BillingAndCredits />
          </SettingLazySubPages>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Wrapper component for lazy-loaded tab content
 * Shows loading spinner while content is being loaded
 */
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
