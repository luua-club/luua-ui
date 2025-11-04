import { useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

import { BENTO_ITEMS, BentoItemConfig } from '@/core/config/welcome.config'
import { BentoGrid, BentoGridItem } from '@/shared/components/bento-grid'

function FeaturesGrid() {
  const router = useRouter()

  const handleClick = (item: BentoItemConfig) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, '_blank')
    } else if (item.route) {
      router.navigate({ to: item.route })
    }
  }

  const items = BENTO_ITEMS.map(item => {
    const Icon = item.icon
    return {
      title: <BentoTitle>{item.title}</BentoTitle>,
      description: item.description,
      header: <BentoImage />,
      className: item.className,
      icon: <Icon className="h-4 w-4 text-neutral-500" />,
      onClick: () => handleClick(item),
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
    >
      <BentoGrid className="mx-auto max-w-4xl md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem key={i} {...item} />
        ))}
      </BentoGrid>
    </motion.div>
  )
}

export default FeaturesGrid

const BentoTitle = ({ children }: { children: string }) => (
  <p className="flex items-center gap-1">
    {children}
    <ChevronRight className="size-4.5 font-medium" />
  </p>
)

const BentoImage = ({ src }: { src?: string }) => {
  const baseClasses = 'flex h-full min-h-[6rem] w-full flex-1 rounded-xl'

  if (!src) {
    return (
      <div
        className={`${baseClasses} bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800`}
      />
    )
  }

  return (
    <div className={baseClasses}>
      <img src={src} alt="" className="h-full w-full rounded-xl object-cover" />
    </div>
  )
}
