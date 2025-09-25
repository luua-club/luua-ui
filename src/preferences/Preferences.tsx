import { useQuery } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { Frown, UserRoundPen, Zap } from 'lucide-react'
import { useState } from 'react'

import { userApi } from '@/core/api/user.api'
import { QUERY_KEYS, UserStyleStatus } from '@/core/config/constant'
import UserStyles from '@/core/containers/UserStyles'
import Summary from '@/preferences/container/Summary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import Advanced from './container/Advanced'

const tabValue = ['styles', 'advanced']

const Preferences = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<string>(tabValue[0])

  // --- Query ---
  const { data, isLoading, isPending, isError } = useQuery({
    queryKey: [QUERY_KEYS.userStyle],
    queryFn: () => userApi.getUserStyle(),
    refetchOnMount: true,
  })

  // --- Error ---
  if (isError) {
    return (
      <div className="m-auto flex min-h-16 max-w-4xl items-center justify-center p-4 pt-8 text-red-600 dark:text-red-400">
        <Frown className="mr-2 size-4" />
        Something went wrong, Please try again later
      </div>
    )
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col p-5">
      {/* --- Summary --- */}
      <Summary
        data={data?.data}
        isLoading={isLoading}
        onHelperTextClick={() => {
          setActiveTab(tabValue[1])
        }}
      />

      {/* --- Heading --- */}
      <div className="mt-8 py-4">
        <h1 className="text-lg font-medium">User Styles</h1>
      </div>

      {/* --- Tabs --- */}
      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={(value: string) => {
          setActiveTab(value)
        }}
      >
        <TabsList className="w-full px-2 py-6 lg:w-fit">
          <TabsTrigger value={tabValue[0]} className="px-2 py-4 text-sm">
            <UserRoundPen /> Basic Styles
          </TabsTrigger>
          <TabsTrigger
            value={tabValue[1]}
            className="px-2 py-4 text-sm"
            disabled={
              data?.data.style_gen_state === UserStyleStatus.IN_PROGRESS
            }
          >
            <Zap /> Enhanced Styles
          </TabsTrigger>
        </TabsList>

        {/* --- Tabs Content: Styles --- */}
        <TabsContent value={tabValue[0]}>
          <p className="text-card-foreground mt-2 mb-8 text-base">
            Choose the style that best matches your objective. Luua AI will
            adjust its tone, depth, and structure to craft posts that truly
            reflect your voice and connect with your audience.
          </p>

          <UserStyles
            data={data?.data}
            isLoading={isLoading || isPending}
            hideHeader
          />
        </TabsContent>

        {/* --- Tabs Content: Advanced --- */}
        <TabsContent value={tabValue[1]}>
          <p className="text-card-foreground mt-2 mb-8 text-base">
            Help Luua learn your unique writing style! Share your writing
            samples by pasting text or uploading files. Luua will analyze how
            you naturally communicate - your word choices, humor, and tone - to
            create content that genuinely sounds like you.
          </p>
          <Advanced />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createLazyRoute('/preferences')({
  component: Preferences,
})

export default Preferences
