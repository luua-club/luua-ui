import { useMutation } from '@tanstack/react-query'
import { CloudUpload, Paperclip, SmilePlus, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { filesApi } from '@/core/api/files.api'
import EmojiPopover from '@/shared/components/emoji-popover'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
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

export interface UploadConfig {
  maxFiles: number // Maximum number of files allowed
  maxSizePerFile: number // Maximum size per file in bytes
}

interface IPostCardActionsProps {
  onEmojiSelect: (emoji: string) => void
  onFilesUploaded?: (fileUrls: string[]) => void
  uploadConfig?: UploadConfig
}

function PostCardActions({
  onEmojiSelect,
  onFilesUploaded,
  uploadConfig = { maxFiles: 5, maxSizePerFile: 5 * 1024 * 1024 }, // Default: 5 files, 5MB each
}: IPostCardActionsProps) {
  // --- State ---
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')

  const uploadFileMutation = useMutation({
    mutationFn: (file: File) =>
      filesApi.uploadPostUrl({
        filename: file.name,
        mime_type: file.type,
        file_size: file.size,
      }),
    onError: () => {
      throw new Error('Failed to get upload URL')
    },
  })

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file')
      return
    }

    try {
      setIsUploading(true)
      const fileUrls = await Promise.all(
        files.map(async file => {
          const res = await uploadFileMutation.mutateAsync(file)
          const { upload_url, upload_headers, file_url } = res.data

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

          return file_url || ''
        })
      )

      toast.success('Files uploaded successfully')
      onFilesUploaded?.(fileUrls)
      setFiles([])
      setUploadError('')
      setOpen(false)
    } catch (error) {
      const errorMessage = 'Failed to upload one or more files'
      setUploadError(errorMessage)
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex">
      {/* Emoji Popover */}
      <EmojiPopover onEmojiSelect={emoji => onEmojiSelect(emoji)}>
        <Button variant="ghost" className="size-7">
          <SmilePlus className="size-3" />
        </Button>
      </EmojiPopover>

      {/* Upload Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="inline-flex size-7">
          <Button
            asChild
            variant="ghost"
            disabled={uploadConfig.maxFiles === 0}
          >
            <span className="inline-flex h-full w-full items-center justify-center">
              <Paperclip className="size-3" />
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card text-card-foreground w-full p-6 md:w-fit">
          <DialogClose />
          <DialogHeader className="mb-4">
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {uploadConfig.maxFiles === 0 ? (
                <span className="text-destructive font-medium">
                  Maximum file limit reached. Remove existing files to upload
                  more.
                </span>
              ) : (
                `You can upload up to ${uploadConfig.maxFiles} files of size ${(uploadConfig.maxSizePerFile / 1024 / 1024).toFixed(0)}MB each.`
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <FileUpload
              value={files}
              disabled={isUploading || uploadConfig.maxFiles === 0}
              onValueChange={newFiles => {
                setFiles(newFiles)
                setUploadError('') // Clear error when files change
              }}
              accept="image/*"
              maxFiles={uploadConfig.maxFiles}
              maxSize={uploadConfig.maxSizePerFile}
              onFileReject={(_, message) => {
                setUploadError(message)
              }}
              multiple
            >
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

              {/* Error Message */}
              {uploadError && (
                <p className="text-destructive text-sm font-medium">
                  {uploadError}
                </p>
              )}

              <FileUploadList>
                {files.map((file, index) => (
                  <FileUploadItem key={index} value={file}>
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={isUploading}
                      >
                        <X />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>
            {files.length > 0 && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostCardActions
