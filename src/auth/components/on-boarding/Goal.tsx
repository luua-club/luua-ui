import { Button } from '@/shared/ui/button'
import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { cn } from '@/shared/utils'

interface GoalProps {
  goals: readonly string[]
}

function Goal({ goals }: GoalProps) {
  return (
    <FormField
      name="goal"
      render={({ field }) => (
        <FormItem className="space-y-1">
          {/** Label */}
          <FormLabel className="text-base font-semibold sm:text-lg">
            What&apos;s your main goal?
          </FormLabel>

          {/** Options */}
          <div className="flex flex-wrap gap-3">
            {goals.map(g => {
              const selected = field.value === g
              return (
                <Button
                  key={g}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!selected) field.onChange(g)
                  }}
                  className={cn(
                    'max-w-full min-w-0 rounded-md text-start text-xs text-wrap break-words whitespace-normal sm:text-base',
                    selected && 'bg-brand-accent-yellow border-transparent'
                  )}
                >
                  {g}
                </Button>
              )
            })}
          </div>

          {/** Message */}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default Goal
