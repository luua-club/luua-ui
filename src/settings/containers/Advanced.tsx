import { Separator } from '@/shared/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import StyleFileCapture from '../components/StyleFileCapture'
import StyleTextCapture from '../components/StyleTextCapture'

const Advanced = () => {
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
      <div className="mt-4 flex max-w-4xl flex-col">
        <p className="text-base font-medium">
          Please provide your writing samples.
        </p>
        <Tabs className="mt-4 w-full lg:w-2/3" defaultValue="textSample">
          <TabsList className="w-full lg:w-fit">
            <TabsTrigger value="textSample">Text Sample</TabsTrigger>
            <TabsTrigger value="fileSample">File Sample</TabsTrigger>
          </TabsList>
          <TabsContent value="textSample">
            <StyleTextCapture />
          </TabsContent>
          <TabsContent value="fileSample">
            <StyleFileCapture />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default Advanced
