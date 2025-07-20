import { zodResolver } from '@hookform/resolvers/zod'
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
    .max(200, {
      message: 'Sample Text must not be longer than 200 characters.',
    }),
})

const StyleTextCapture = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sampleText: '',
    },
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data)
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
                  className="max-h-40 min-h-32 resize-none shadow-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="default" className="mt-4 w-fit">
          Analyze
        </Button>
      </form>
    </Form>
  )
}

export default StyleTextCapture
