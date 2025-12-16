import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, Loader, WandSparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/shared/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form'
import { Textarea } from '@/shared/ui/textarea'

const FormSchema = z.object({
  sampleText: z
    .string()
    .min(10, {
      message: 'Sample Text must be at least 10 characters.',
    })
    .max(10000, {
      message: 'Sample Text must not be longer than 10000 characters.',
    }),
})

interface IStyleTextCapture {
  handleSubmit: (data: string) => void
  isLoading: boolean
}

const StyleTextCapture = ({
  handleSubmit,
  isLoading = false,
}: IStyleTextCapture) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sampleText: '',
    },
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    handleSubmit(data.sampleText)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col"
      >
        <FormField
          control={form.control}
          name="sampleText"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add atleast 3–5 of your strongest posts for better tuning..."
                  className="max-h-96 min-h-28 resize-none shadow-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="secondary"
          className="mt-4 w-fit"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <WandSparkles />
          )}
          Create style
          <ChevronRight />
        </Button>
      </form>
    </Form>
  )
}

export default StyleTextCapture
