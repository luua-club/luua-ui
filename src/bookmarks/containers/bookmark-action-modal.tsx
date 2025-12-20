import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings2 } from 'lucide-react'
import { useEffect } from 'react'
import { type Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { inspirationApi } from '@/core/api/inspiration.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

import { BookmarkFromValues, BookmarkSchema } from '../models/bookmark.model'

type BookmarkActionModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  initialData?: {
    id: string
    url: string
    additional_context: string | null
  }
  disabled?: boolean
}

function BookmarkActionModal({
  open,
  onOpenChange,
  mode = 'create',
  initialData,
  disabled = false,
}: BookmarkActionModalProps) {
  // --- Forms ---
  const resolver = zodResolver(BookmarkSchema) as Resolver<BookmarkFromValues>

  const form = useForm<BookmarkFromValues>({
    resolver,
    mode: 'onChange',
    defaultValues: {
      url: initialData?.url ?? '',
      additional_context: initialData?.additional_context ?? '',
    },
  })

  // --- Hooks ---
  const queryClient = useQueryClient()

  // --- Effects & Mutation ---
  /**
   * Keep form in sync when opening in different modes or with new data
   */
  useEffect(() => {
    if (!open) return
    form.reset({
      url: initialData?.url ?? '',
      additional_context: initialData?.additional_context ?? '',
    })
  }, [open, initialData, mode, form])

  /**
   * Create mutation
   */
  const createMutation = useMutation({
    mutationFn: (values: BookmarkFromValues) =>
      inspirationApi.createInspiration({
        link: values.url,
        additional_context: values.additional_context || null,
      }),
    onSuccess: () => {
      toast.success('Bookmark added successfully')
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.inspirations],
      })
      form.reset()
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Failed to add bookmark')
    },
  })

  /**
   * Update mutation
   */
  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; values: BookmarkFromValues }) =>
      inspirationApi.updateInspiration(payload.id, {
        link: payload.values.url,
        additional_context: payload.values.additional_context || '',
      }),
    onSuccess: () => {
      toast.success('Bookmark updated successfully')
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.inspirations],
      })
      form.reset()
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Failed to update bookmark')
    },
  })

  // --- Functions ---
  /**
   * Handle form submission
   *
   * @param _values - Form values
   */
  const onSubmit = (values: BookmarkFromValues) => {
    if (mode === 'edit' && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, values })
      return
    }

    createMutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card w-full min-w-[300px] p-5 md:max-w-lg">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-2">
            <Settings2 className="size-5" />
            {mode === 'edit' ? 'Update Link Content' : 'Add Link Content'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 grid gap-4"
          >
            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="text-card-foreground">
                  <FormLabel>Drop a link</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/your-article"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Additional Context */}
            <FormField
              control={form.control}
              name="additional_context"
              render={({ field }) => (
                <FormItem className="text-card-foreground">
                  <FormLabel>Add a note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type note here..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/** Actions */}
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-card-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  disabled
                }
                variant={'default'}
              >
                {mode === 'edit'
                  ? updateMutation.isPending
                    ? 'Updating...'
                    : 'Update'
                  : createMutation.isPending
                    ? 'Adding...'
                    : 'Add'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default BookmarkActionModal
