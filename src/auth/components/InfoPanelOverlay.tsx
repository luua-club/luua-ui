import { CalendarHeart, PencilRuler, Workflow, Zap } from 'lucide-react'
import { cubicBezier } from 'motion'
import { motion } from 'motion/react'
import React from 'react'

import { Card, CardContent } from '@/shared/ui/card'

interface InfoTile {
  id: number
  icon: React.ReactNode
  title: string
  description: string
}

function InfoPanelOverlay() {
  // ---- Variables ----
  const items: InfoTile[] = [
    {
      id: 1,
      icon: <Zap />,
      title: 'Quick Share',
      description: 'Turn ideas into posts instantly with Luua AI.',
    },
    {
      id: 2,
      icon: <PencilRuler />,
      title: 'Customization',
      description: 'Easily tweak tone, style, and design your post',
    },
    {
      id: 3,
      icon: <CalendarHeart />,
      title: 'Schedule',
      description: 'Schedule posts to be published at a later time.',
    },
    {
      id: 4,
      icon: <Workflow />,
      title: 'Auto Mode',
      description: 'Wake up to posts already drafted for you.',
    },
  ]

  return (
    <motion.div
      className="dark flex flex-col"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {items.map((itemData, idx) => (
        <React.Fragment key={itemData.id}>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -12 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: cubicBezier(0.22, 1, 0.36, 1),
                },
              },
            }}
          >
            <InfoTile {...itemData} />
          </motion.div>
          {idx < items.length - 1 && (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { duration: 0.4, delay: 0.08 },
                },
              }}
              className="relative h-8"
            >
              {/** Connector UI */}
              <div className="border-muted-foreground/40 absolute left-1/2 h-full -translate-x-1/2 border-l border-dashed" />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  )
}

/**
 * Info Tile Component
 *
 * @param InfoTile
 * @returns JSX.Element
 */
const InfoTile = ({ icon, title, description }: InfoTile) => {
  return (
    <Card className="bg-card !gap-4 p-4">
      <CardContent className="flex items-center gap-3 p-0">
        {/** Icon Container */}
        <div className="flex items-center justify-center rounded-md bg-white/10 px-2 py-2 text-2xl">
          {icon}
        </div>

        {/** Text Container */}
        <div className="min-w-0 flex-1">
          <p className="text-card-foreground truncate text-sm font-medium">
            {title}
          </p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default InfoPanelOverlay
