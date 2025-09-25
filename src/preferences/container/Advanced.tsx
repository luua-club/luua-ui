import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { stylesApi } from '@/core/api/styles.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { IUserAdvancedStyleRequest } from '@/core/models/user.model'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import StyleFileCapture from '../../core/components/StyleFileCapture'
import StyleTextCapture from '../../core/components/StyleTextCapture'

const Advanced = () => {
  const queryClient = useQueryClient()

  const setAdvancedUserStyleMutation = useMutation({
    mutationFn: (payload: IUserAdvancedStyleRequest) =>
      stylesApi.setUserAdvancedStyle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userStyle] })
      toast.success('Advanced user style updated successfully')
    },
    onError: () => {
      toast.error('Failed to update advanced user style')
    },
  })

  return (
    <>
      <div className="mt-2">
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
              <StyleFileCapture submitVariant="secondary" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Advanced
