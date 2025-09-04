import { BookOpenText, History, PenLine } from 'lucide-react'

import { TabsList, TabsTrigger } from '@/shared/ui/tabs'

interface TabListProps {
  loading: boolean
}

function TabList({ loading }: TabListProps) {
  return (
    <TabsList className="w-full px-2 py-6 lg:w-fit">
      <TabsTrigger value="created-post" className="px-2 py-4 text-xs">
        <PenLine className="size-3" /> Created Posts
      </TabsTrigger>
      <TabsTrigger
        value="history"
        className="px-2 py-4 text-xs"
        disabled={loading}
      >
        <History className="size-3" /> History
      </TabsTrigger>
      <TabsTrigger
        value="sources"
        className="px-2 py-4 text-xs"
        disabled={loading}
      >
        <BookOpenText className="size-3" /> Sources
      </TabsTrigger>
    </TabsList>
  )
}

export default TabList
