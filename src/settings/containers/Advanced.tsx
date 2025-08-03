import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { stylesApi } from '@/core/api/styles.api'
import { IUserAdvancedStyleRequest } from '@/core/models/user.model'
import { Separator } from '@/shared/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import StyleFileCapture from '../components/StyleFileCapture'
import StyleTextCapture from '../components/StyleTextCapture'
import { queryKeys } from '../utils'

const Advanced = () => {
  const queryClient = useQueryClient()

  const setAdvancedUserStyleMutation = useMutation({
    mutationFn: (payload: IUserAdvancedStyleRequest) =>
      stylesApi.setUserAdvancedStyle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.userStyle] })
      toast.success('Advanced user style updated successfully')
    },
    onError: () => {
      toast.error('Failed to update advanced user style')
    },
  })

  return (
    <>
      {/* Heading */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Enhanced User Style Capture</h1>
      </div>
      <Separator />
      <p className="text-muted-foreground mt-4 text-base">
        Help Luua learn your unique writing style! Share your writing samples by
        pasting text or uploading files. Luua will analyze how you naturally
        communicate - your word choices, humor, and tone - to create content
        that genuinely sounds like you.
      </p>
      <div className="mt-4">
        <p className="text-base font-medium">
          Please provide your writing samples.
        </p>
        <div className="lg:w-2/3">
          <Tabs className="mt-4 w-full flex-1" defaultValue="textSample">
            <TabsList className="w-full lg:w-fit">
              <TabsTrigger value="textSample">Text Sample</TabsTrigger>
              <TabsTrigger value="fileSample">File Sample</TabsTrigger>
            </TabsList>
            <TabsContent value="textSample">
              <StyleTextCapture
                handleSubmit={data => {
                  setAdvancedUserStyleMutation.mutate({
                    style_text: data,
                  })
                }}
              />
            </TabsContent>
            <TabsContent value="fileSample">
              <StyleFileCapture />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Advanced
