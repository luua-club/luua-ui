import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { stylesApi } from '@/core/api/styles.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { postHogStyleEnhancedCapture } from '@/core/config/posthog.config'
import { IUserAdvancedStyleRequest } from '@/core/models/user.model'
import { PREFERENCES_TAB_VALUES } from '@/preferences/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import StyleTextCapture from '../../core/components/StyleTextCapture'
import StyleFileCapture from '../../core/containers/StyleFileCapture'

function Advanced({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const queryClient = useQueryClient()
  const setAdvancedUserStyleMutation = useMutation({
    mutationFn: (payload: IUserAdvancedStyleRequest) =>
      stylesApi.setUserAdvancedStyle(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userStyle] })
      toast.success('Advanced user style updated successfully')
      setActiveTab(PREFERENCES_TAB_VALUES[0])

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
                    Can Upload up to 5 files (10MB each).
                  </span>
                }
                accept="application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                isLoading={setAdvancedUserStyleMutation.isPending}
                onSubmit={fileIds => {
                  setAdvancedUserStyleMutation.mutate({
                    gcp_storage_doc_ids: fileIds,
                  })
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Advanced
