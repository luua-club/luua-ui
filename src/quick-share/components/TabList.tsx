import { History, PenLine } from 'lucide-react'

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
        <History className="size-3" /> Past Responses
      </TabsTrigger>
    </TabsList>
  )
}

export default TabList
