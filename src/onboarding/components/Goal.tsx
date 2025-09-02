import { Button } from '@/shared/ui/button'
import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { cn } from '@/shared/utils'

interface GoalProps {
  goals: readonly string[]
}

function Goal({ goals }: GoalProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-base font-medium">
        Tell us a bit about you to personalize your content from day one.
      </h1>

      <FormField
        name="goal"
        render={({ field }) => (
          <FormItem className="space-y-1">
            {/** Label */}
            <FormLabel className="text-base font-semibold sm:text-lg">
              What&apos;s your main goal?
            </FormLabel>

            {/** Options */}
            <div className="flex flex-col gap-4">
              {goals.map(g => {
                const selected = field.value === g
                return (
                  <Button
                    type="button"
                    key={g}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!selected) field.onChange(g)
                    }}
                    className={cn(
                      'max-w-full min-w-0 rounded-md !p-6 text-xs text-wrap break-words whitespace-normal sm:text-base',
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
    </div>
  )
}

export default Goal
