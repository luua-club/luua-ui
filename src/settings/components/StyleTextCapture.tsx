import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, TestTubeDiagonal } from 'lucide-react'
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
}

const StyleTextCapture = ({ handleSubmit }: IStyleTextCapture) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sampleText: '',
    },
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    handleSubmit(data.sampleText)
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
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your sample text here"
                  className="min-h-28 resize-none shadow-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary" className="mt-4 w-fit">
          <TestTubeDiagonal />
          Analyze sample text
          <ChevronRight />
        </Button>
      </form>
    </Form>
  )
}

export default StyleTextCapture
