import { useQuery } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { Frown, List, UserRoundPen } from 'lucide-react'
import { useState } from 'react'

import { userApi } from '@/core/api/user.api'
import { QUERY_KEYS, UserStyleStatus } from '@/core/config/constant'
import UserStyles from '@/preferences/components/user-styles'
import Advanced from '@/preferences/container/advanced'
import Summary from '@/preferences/container/summary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

export const tabValue = ['styles', 'advanced']

function Preferences() {
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
    <div className="m-auto mt-4 flex max-w-4xl flex-col p-5 md:mt-0">
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
            <List /> Presets
          </TabsTrigger>
          <TabsTrigger
            value={tabValue[1]}
            className="px-2 py-4 text-sm"
            disabled={
              data?.data.style_gen_state === UserStyleStatus.IN_PROGRESS
            }
          >
            <UserRoundPen /> My Voice
          </TabsTrigger>
        </TabsList>

        {/* --- Tabs Content: Styles --- */}
        <TabsContent value={tabValue[0]}>
          <p className="text-card-foreground mt-2 mb-8 text-base">
            Choose the style that fits your goal. Luua shapes the tone and flow
            to deliver the impact you’re aiming for.
          </p>

          <UserStyles
            data={data?.data}
            isLoading={isLoading || isPending}
            hideHeader
            showSuccessToast
          />
        </TabsContent>

        {/* --- Tabs Content: Advanced --- */}
        <TabsContent value={tabValue[1]}>
          <p className="text-card-foreground mt-2 mb-8 text-base">
            Share your writing samples, and Luua will learn your tone and style
            to create content that sounds like you.
          </p>
          <Advanced setActiveTab={setActiveTab} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createLazyRoute('/preferences')({
  component: Preferences,
})

export default Preferences
