import createImage from '@/assets/images/create-schedule.webp'
import createImageDark from '@/assets/images/create-schedule-dark.webp'
import { AspectRatio } from '@/shared/ui/aspect-ratio'
import { Highlighter } from '@/shared/ui/highlighter'

interface RightPanelProps {
  theme: string
}

function RightPanel({ theme }: RightPanelProps) {
  return (
    <div className="bg-brand-background/80 dark:bg-muted/50 relative z-10 m-4 hidden w-1/2 rounded-2xl lg:flex lg:justify-center">
      {/* Feature Card */}
      <div className="flex h-full w-full max-w-2xl flex-col justify-between px-8 pt-20 pb-14">
        {/* Header Text */}
        <div className="mb-4">
          <h2 className="text-foreground mb-6 text-center text-4xl font-semibold text-balance">
            <Highlighter
              action="highlight"
              color={theme === 'dark' ? '#426732' : '#8FF9B4'}
              strokeWidth={1}
            >
              Create and schedule
            </Highlighter>{' '}
            social media posts with AI.
          </h2>

          <p className="text-foreground/80 text-center font-medium text-balance">
            Create multiple posts at once, and turn{' '}
            <strong>YouTube videos or any web articles</strong> into social
            posts that match your voice and tone.
          </p>
        </div>

        {/* Feature Image */}
        <div className="border-border overflow-hidden rounded-xl border-4">
          <AspectRatio ratio={16 / 9}>
            <img
              src={createImage}
              alt="Create and schedule posts"
              className="h-full w-full object-cover object-top-left dark:hidden"
            />
            <img
              src={createImageDark}
              alt="Create and schedule posts"
              className="hidden h-full w-full object-cover object-top-left dark:block"
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}

export default RightPanel
