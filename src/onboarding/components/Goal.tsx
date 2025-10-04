import { Flag } from 'lucide-react'

import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { cn } from '@/shared/utils'

interface GoalProps {
  goals: readonly string[]
}

function Goal({ goals }: GoalProps) {
  return (
    <>
      <FormField
        name="goal"
        render={({ field }) => (
          <FormItem className="space-y-1">
            {/** Label */}
            <FormLabel className="text-base font-semibold">
              <Flag className="size-5" /> What&apos;s your main goal?
            </FormLabel>

            {/** Options */}
            <div className="flex flex-col gap-4">
              {goals.map(g => {
                const selected = field.value === g
                return (
                  <div
                    key={g}
                    onClick={() => {
                      if (!selected) field.onChange(g)
                    }}
                    className={cn(
                      'border-input bg-background hover:bg-sidebar hover:text-accent-foreground max-w-full min-w-0 cursor-pointer rounded-md border !p-4 text-xs font-semibold text-wrap break-words whitespace-normal sm:text-sm',
                      selected &&
                        'bg-brand-accent-yellow border-transparent dark:bg-yellow-500 dark:text-black'
                    )}
                  >
                    {g}
                  </div>
                )
              })}
            </div>

            {/** Message */}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default Goal
