import { useRouter } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo } from 'react'

import {
  BENTO_ITEMS,
  BentoImageData,
  BentoItemConfig,
} from '@/core/config/welcome.config'
import { BentoGrid, BentoGridItem } from '@/shared/components/bento-grid'
import { useIsMobile } from '@/shared/hooks/use-mobile'

function FeaturesGrid({ gridClassName }: { gridClassName?: string }) {
  // --- Hooks ---
  const router = useRouter()
  const isMobile = useIsMobile()

  // --- Functions ---
  /**
   * Handles click events on bento grid items
   * @param item - The bento item configuration
   */
  const handleClick = (item: BentoItemConfig) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, '_blank')
    } else if (item.route) {
      router.navigate({ to: item.route })
    }
  }

  /**
   * Sorts bento items based on screen size (mobile vs desktop)
   * Memoized to avoid unnecessary re-sorting on every render
   */
  const sortedBentoItems = useMemo(() => {
    return [...BENTO_ITEMS].sort((a, b) => {
      const orderA = isMobile
        ? (a.sortOrderMobile ?? a.sortOrderDesktop ?? 0)
        : (a.sortOrderDesktop ?? a.sortOrderMobile ?? 0)
      const orderB = isMobile
        ? (b.sortOrderMobile ?? b.sortOrderDesktop ?? 0)
        : (b.sortOrderDesktop ?? b.sortOrderMobile ?? 0)
      return orderA - orderB
    })
  }, [isMobile])

  /**
   * Transforms BENTO_ITEMS config into BentoGridItem-compatible format
   */
  const items = sortedBentoItems.map(item => {
    const Icon = item.icon
    return {
      title: <BentoTitle>{item.title}</BentoTitle>,
      description: item.description,
      header: (
        <BentoImage
          src={item.imageData?.src}
          srcDark={item.imageData?.srcDark}
          ratio={item.imageData?.ratio}
          objectFit={item.imageData?.objectFit}
        />
      ),
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
      <BentoGrid
        className={`mx-auto max-w-4xl md:auto-rows-[20rem] ${gridClassName ?? ''}`}
      >
        {items.map((item, i) => (
          <BentoGridItem key={i} {...item} />
        ))}
      </BentoGrid>
    </motion.div>
  )
}

export default FeaturesGrid

/**
 * Renders a bento grid item title with a chevron icon
 *
 * @param children - The title text to display
 * @returns A paragraph element with the title and chevron icon
 */
const BentoTitle = ({ children }: { children: string }) => (
  <p className="flex items-center gap-1">
    {children}
    <ChevronRight className="size-4.5 font-medium" />
  </p>
)

/**
 * Renders a bento grid item image or gradient placeholder
 *
 * @param src - Optional image source URL; shows gradient if not provided
 * @returns An image element or gradient div placeholder
 */
const BentoImage = ({
  src,
  srcDark,
  ratio = 'aspect-[3/2]',
  objectFit = 'object-top',
}: BentoImageData) => {
  const baseClasses = `relative w-full overflow-hidden rounded-lg ${ratio}`

  if (!src) {
    return (
      <div
        className={`${baseClasses} bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800`}
      />
    )
  }

  return (
    <div className={baseClasses}>
      <img
        src={src}
        alt=""
        width={ratio === 'aspect-[3/2]' ? 1200 : 800}
        height={ratio === 'aspect-[3/2]' ? 800 : 800}
        className={`h-full w-full object-cover ${objectFit} dark:hidden`}
        loading="lazy"
        decoding="async"
      />

      <img
        src={srcDark}
        alt=""
        width={ratio === 'aspect-[3/2]' ? 1200 : 800}
        height={ratio === 'aspect-[3/2]' ? 800 : 800}
        className={`h-full w-full object-cover ${objectFit} hidden dark:block`}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-black dark:via-black/20" />
    </div>
  )
}
