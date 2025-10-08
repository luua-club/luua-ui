import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ChevronRight, CloudUpload, Loader, Shredder, X } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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

import { filesApi } from '../api/files.api'

type FormValues = { files: File[] }

type StyleFileCaptureProps = {
  accept?: string
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  description?: React.ReactNode
  submitLabel?: string
  onSubmit?: (fileIds: string[]) => Promise<void> | void
  hideSubmit?: boolean
  submitFullWidth?: boolean
  submitVariant?: React.ComponentProps<typeof Button>['variant']
  value?: File[]
  onValueChange?: (files: File[]) => void
  onFilesChange?: (files: File[]) => void
  isLoading?: boolean
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
  isLoading: isExternalLoading,
}) => {
  const [isUploading, setIsUploading] = React.useState(false)
  const uploadFileMutation = useMutation({
    mutationFn: (file: File) =>
      filesApi.uploadUrl({
        filename: file.name,
        mime_type: file.type,
        file_size: file.size,
      }),
    onError: () => {
      throw new Error('Something went wrong')
    },
  })

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
    async (data: FormValues) => {
      try {
        setIsUploading(true)
        const fileIds = await Promise.all(
          data.files.map(async file => {
            const res = await uploadFileMutation.mutateAsync(file)
            const { upload_url, upload_headers, file_id } = res.data

            const headers = new Headers()
            Object.entries(upload_headers).forEach(([key, value]) => {
              headers.set(key, String(value))
            })

            if (!headers.has('Content-Type') && file.type) {
              headers.set('Content-Type', file.type)
            }

            if (!headers.has('Content-Length') && file.size) {
              headers.set('Content-Length', file.size.toString())
            }

            const putResponse = await fetch(upload_url, {
              method: 'PUT',
              headers,
              body: file,
            })

            if (!putResponse.ok) {
              throw new Error('Direct upload failed')
            }

            return file_id
          })
        )
        const maybePromise = onSubmitProp?.(fileIds)
        if (
          maybePromise &&
          typeof (maybePromise as unknown as Promise<unknown>).then ===
            'function'
        ) {
          await (maybePromise as unknown as Promise<unknown>)
        }
        form.reset()
      } catch {
        toast.error('Failed to upload one or more files')
      } finally {
        setIsUploading(false)
      }
    },
    [form, onSubmitProp, uploadFileMutation]
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
                  disabled={isUploading || !!isExternalLoading}
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
                            disabled={isUploading || !!isExternalLoading}
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
            disabled={isUploading || !!isExternalLoading}
          >
            {isUploading || isExternalLoading ? (
              <>
                <Loader className="animate-spin" />
                {submitLabel}
              </>
            ) : (
              <>
                <Shredder />
                {submitLabel}
              </>
            )}
            <ChevronRight />
          </Button>
        )}
      </form>
    </Form>
  )
}

export default StyleFileCapture
