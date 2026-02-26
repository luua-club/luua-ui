import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { imageGenerationApi } from '@/core/api/image-generation.api'
import { ImageTemplate } from '@/core/models/image-generation.model'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Textarea } from '@/shared/ui/textarea'

import TemplateCard from './template-card'

interface ImageGenerationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImageGenerated: (imageUrl: string) => void
  postContent?: string
}

type ModalStep = 'select' | 'custom-prompt' | 'generating' | 'result'

function ImageGenerationModal({
  open,
  onOpenChange,
  onImageGenerated,
  postContent,
}: ImageGenerationModalProps) {
  const [step, setStep] = useState<ModalStep>('select')
  const [selectedTemplate, setSelectedTemplate] =
    useState<ImageTemplate | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [generatedImageUrl, setGeneratedImageUrl] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const templatesQuery = useQuery({
    queryKey: ['image-templates'],
    queryFn: async () => {
      const res = await imageGenerationApi.getTemplates()
      return res.data
    },
    enabled: open,
  })

  const generateMutation = useMutation({
    mutationFn: ({
      templateId,
      customPrompt,
      signal,
    }: {
      templateId: string
      customPrompt?: string
      signal?: AbortSignal
    }) =>
      imageGenerationApi.generateImage(
        {
          template_id: templateId,
          custom_prompt: customPrompt,
        },
        signal
      ),
    onSuccess: res => {
      setGeneratedImageUrl(res.data.image_url)
      setStep('result')
    },
    onError: error => {
      if ((error as Error).name === 'CanceledError') return
      toast.error('Failed to generate image. Please try again.')
      setStep('select')
    },
  })

  const handleTemplateClick = (template: ImageTemplate) => {
    setSelectedTemplate(template)

    if (template.category === 'custom') {
      setStep('custom-prompt')
      return
    }

    // For preset templates, pass the post content as the core concept
    startGeneration(template.id, postContent?.trim() || undefined)
  }

  const startGeneration = (templateId: string, prompt?: string) => {
    setStep('generating')
    const controller = new AbortController()
    abortControllerRef.current = controller
    generateMutation.mutate({
      templateId,
      customPrompt: prompt,
      signal: controller.signal,
    })
  }

  const handleCustomGenerate = () => {
    if (!customPrompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }
    if (!selectedTemplate) return
    startGeneration(selectedTemplate.id, customPrompt.trim())
  }

  const handleCancel = () => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    generateMutation.reset()
    setStep('select')
  }

  const handleUseImage = () => {
    onImageGenerated(generatedImageUrl)
    handleClose()
  }

  const handleRegenerate = () => {
    if (!selectedTemplate) return
    const prompt =
      selectedTemplate.category === 'custom'
        ? customPrompt.trim()
        : postContent?.trim() || undefined
    startGeneration(selectedTemplate.id, prompt)
  }

  const handleClose = () => {
    setStep('select')
    setSelectedTemplate(null)
    setCustomPrompt('')
    setGeneratedImageUrl('')
    generateMutation.reset()
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card text-card-foreground w-full max-w-lg p-6">
        <DialogHeader className="mb-4">
          <DialogTitle>Generate Image</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 'select' && 'Choose a template to generate an image'}
            {step === 'custom-prompt' && 'Describe the image you want'}
            {step === 'generating' && 'Generating your image...'}
            {step === 'result' && 'Your generated image is ready'}
          </DialogDescription>
        </DialogHeader>

        {/* Template Selection */}
        {step === 'select' && (
          <div className="flex flex-col gap-3">
            {templatesQuery.isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground size-6 animate-spin" />
              </div>
            )}
            {templatesQuery.isError && (
              <p className="text-destructive py-4 text-center text-sm">
                Failed to load templates. Please try again.
              </p>
            )}
            {templatesQuery.data && (
              <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto pr-1">
                {templatesQuery.data.map((template: ImageTemplate) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    selected={selectedTemplate?.id === template.id}
                    onClick={() => handleTemplateClick(template)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom Prompt Input */}
        {step === 'custom-prompt' && (
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep('select')
                  setSelectedTemplate(null)
                  setCustomPrompt('')
                }}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleCustomGenerate}
                disabled={!customPrompt.trim()}
                className="flex-1"
              >
                Generate
              </Button>
            </div>
          </div>
        )}

        {/* Generating State */}
        {step === 'generating' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="text-primary size-10 animate-spin" />
            <p className="text-muted-foreground text-sm">
              This may take a moment...
            </p>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}

        {/* Result Preview */}
        {step === 'result' && generatedImageUrl && (
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-lg border">
              <img
                src={generatedImageUrl}
                alt="Generated"
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRegenerate}
                className="flex-1"
              >
                Regenerate
              </Button>
              <Button onClick={handleUseImage} className="flex-1">
                Use Image
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ImageGenerationModal
