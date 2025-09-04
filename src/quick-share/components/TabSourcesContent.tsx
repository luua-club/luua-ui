import { BookMarked } from 'lucide-react'

import ExternalResourceChip from '@/shared/components/external-resource-chip'
import { TabsContent } from '@/shared/ui/tabs'

interface TabSourcesContentProps {
  extractedLinks: { url: string; content: string }[]
  isGeneratedDataFetching: boolean
}

function TabSourcesContent({
  extractedLinks,
  isGeneratedDataFetching,
}: TabSourcesContentProps) {
  return (
    <TabsContent value="sources" className="mx-auto w-full max-w-2xl">
      {/* Heading */}
      <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold">
        <BookMarked />
        Sources used
      </h2>

      {/* Sources */}
      {extractedLinks.length > 0 && !isGeneratedDataFetching ? (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {extractedLinks.map(link_data => (
            <div key={link_data.url}>
              <ExternalResourceChip
                url={link_data.url}
                title={link_data.content}
                showIcon
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mt-3 text-base">
          No sources used yet. You can try writing any link in the prompt to
          extract content from it.
        </p>
      )}
    </TabsContent>
  )
}

export default TabSourcesContent
