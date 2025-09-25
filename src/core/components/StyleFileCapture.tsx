import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, CloudUpload, Shredder, X } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { Button } from '@/shared/ui/button'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/shared/ui/file-upload'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form'
import { cn } from '@/shared/utils'

type FormValues = { files: File[] }

type StyleFileCaptureProps = {
  accept?: string
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  description?: React.ReactNode
  submitLabel?: string
  onSubmit?: (files: File[]) => void
  hideSubmit?: boolean
  submitFullWidth?: boolean
  submitVariant?: React.ComponentProps<typeof Button>['variant']
  value?: File[]
  onValueChange?: (files: File[]) => void
  onFilesChange?: (files: File[]) => void
}

const StyleFileCapture: React.FC<StyleFileCaptureProps> = ({
  accept = 'image/*,application/pdf',
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  multiple = true,
  description = (
    <span className="font-base text-muted-foreground">
      Could upload up to 5 image upto 5MB each.
    </span>
  ),
  submitLabel = 'Analyze file',
  onSubmit: onSubmitProp,
  hideSubmit = false,
  submitFullWidth = false,
  submitVariant = 'secondary',
  value,
  onValueChange,
  onFilesChange,
}) => {
  const schema = React.useMemo(
    () =>
      z.object({
        files: z
          .array(z.custom<File>())
          .min(1, 'Please select at least one file')
          .max(
            maxFiles,
            `Please select up to ${maxFiles} file${maxFiles > 1 ? 's' : ''}`
          )
          .refine(files => files.every(file => file.size <= maxSize), {
            message: `File size must be less than ${Math.floor(
              maxSize / (1024 * 1024)
            )}MB`,
            path: ['files'],
          }),
      }),
    [maxFiles, maxSize]
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      files: [],
    },
  })

  const onSubmit = React.useCallback(
    (data: FormValues) => {
      onSubmitProp?.(data.files)
      form.reset()
    },
    [form, onSubmitProp]
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col"
      >
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUpload
                  value={value ?? field.value}
                  onValueChange={files => {
                    field.onChange(files)
                    onValueChange?.(files)
                    onFilesChange?.(files)
                  }}
                  accept={accept}
                  maxFiles={maxFiles}
                  maxSize={maxSize}
                  onFileReject={(_, message) => {
                    form.setError('files', {
                      message,
                    })
                  }}
                  multiple={multiple}
                >
                  <FormDescription className="font-base text-muted-foreground">
                    {description}
                  </FormDescription>
                  <FileUploadDropzone className="min-h-20 flex-row flex-wrap border-3 border-dotted text-center">
                    <CloudUpload className="size-4" />
                    Drag and drop or
                    <FileUploadTrigger asChild>
                      <Button variant="link" size="sm" className="p-0">
                        choose files
                      </Button>
                    </FileUploadTrigger>
                    to upload
                  </FileUploadDropzone>
                  <FileUploadList>
                    {field.value.map((file, index) => (
                      <FileUploadItem key={index} value={file}>
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemDelete asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                          >
                            <X />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!hideSubmit && (
          <Button
            type="submit"
            variant={submitVariant}
            className={cn('mt-4', submitFullWidth ? 'w-full' : 'w-fit')}
          >
            <Shredder />
            {submitLabel}
            <ChevronRight />
          </Button>
        )}
      </form>
    </Form>
  )
}

export default StyleFileCapture
