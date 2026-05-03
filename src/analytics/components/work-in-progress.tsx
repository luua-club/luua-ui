import workInProgressImage from '@/assets/images/work-in-progress.svg'
import { Card } from '@/shared/ui/card'

export default function WorkInProgress() {
  return (
    <Card className="mx-auto flex min-h-[360px] w-fit flex-col items-center justify-center gap-6 border-none bg-transparent text-center shadow-none">
      <img
        src={workInProgressImage}
        alt=""
        aria-hidden="true"
        className="h-56 w-auto max-w-[220px] object-contain dark:opacity-90"
      />
      <div className="max-w-md space-y-2">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          Channel analytics in progress
        </h2>
        <p className="text-muted-foreground text-sm leading-6 text-balance">
          This tab is still being built. Open{' '}
          <span className="text-foreground font-medium">Summary</span> for
          metrics across your channels.
        </p>
      </div>
    </Card>
  )
}
