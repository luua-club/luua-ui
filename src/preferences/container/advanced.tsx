import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Box } from 'lucide-react'
import { toast } from 'sonner'

import { stylesApi } from '@/core/api/styles.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { postHogStyleEnhancedCapture } from '@/core/config/posthog.config'
import { useUserState } from '@/core/hooks/user-state.hook'
import { IUserAdvancedStyleRequest } from '@/core/models/user.model'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import StyleTextCapture from '../../core/components/StyleTextCapture'
import StyleFileCapture from '../../core/containers/StyleFileCapture'
import { tabValue } from '../preferences'

function Advanced({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const queryClient = useQueryClient()
  const user = useUserState()
  const router = useRouter()
  const setAdvancedUserStyleMutation = useMutation({
    mutationFn: (payload: IUserAdvancedStyleRequest) =>
      stylesApi.setUserAdvancedStyle(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userStyle] })
      toast.success('Advanced user style updated successfully')

      // POSTHOG
      postHogStyleEnhancedCapture(
        variables.style_text,
        variables.gcp_storage_doc_ids
      )
      // END POSTHOG
    },
    onError: () => {
      toast.error('Failed to update advanced user style')
    },
  })

  const overlayClassNames =
    'bg-background/20 dark:bg-background/80 absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg border backdrop-blur-[5px]'
  const isProPlan = user?.plan === 'Pro'

  return (
    <>
      <div className="relative mt-2">
        <div className="lg:w-2/3">
          <Tabs className="mt-4 w-full flex-1" defaultValue="textSample">
            <TabsList className="w-full lg:w-fit">
              <TabsTrigger value="textSample" className="text-xs">
                Text Sample
              </TabsTrigger>
              <TabsTrigger value="fileSample" className="text-xs">
                File Sample
              </TabsTrigger>
            </TabsList>
            <TabsContent value="textSample">
              <StyleTextCapture
                handleSubmit={data => {
                  setAdvancedUserStyleMutation.mutate({
                    style_text: data,
                  })
                }}
                isLoading={setAdvancedUserStyleMutation.isPending}
              />
            </TabsContent>
            <TabsContent value="fileSample">
              <StyleFileCapture
                submitVariant="secondary"
                maxFiles={5}
                maxSize={10 * 1024 * 1024}
                description={
                  <span className="font-base text-muted-foreground">
                    Upload up to 5 files (10MB each).
                  </span>
                }
                accept="application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                isLoading={setAdvancedUserStyleMutation.isPending}
                onSubmit={fileIds => {
                  setAdvancedUserStyleMutation.mutate({
                    gcp_storage_doc_ids: fileIds,
                  })
                  setActiveTab(tabValue[0])
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {!isProPlan && (
          <div className={overlayClassNames}>
            <p className="font-semibold">
              Upgrade plan to create your own style
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                router.navigate({
                  to: '/payments',
                })
              }
              className="text-xs"
            >
              <Box /> Upgrade Plan
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default Advanced
