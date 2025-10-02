import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings2 } from 'lucide-react'
import { useEffect } from 'react'
import { Control, type Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { autopilotApi } from '@/core/api/autopilot.api'
import { QUERY_KEYS, SOCIAL_PLATFORM } from '@/core/config/constant'
import type { AutopilotSettings } from '@/core/models/autopilot.model'
import type { channelType } from '@/core/models/social.model'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

import {
  AutoGenSettingsFormValues,
  autoGenSettingsSchema,
} from '../models/auto-gen-settings.model'

type AutoGenSettingsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultBasePrompt?: string
  defaultFrequencyDays?: number
  defaultChannels?: channelType[]
}

function AutoGenSettingsModal({
  open,
  onOpenChange,
  defaultBasePrompt,
  defaultFrequencyDays,
  defaultChannels,
}: AutoGenSettingsModalProps) {
  // --- Form ---
  const resolver = zodResolver(
    autoGenSettingsSchema
  ) as Resolver<AutoGenSettingsFormValues>
  const form = useForm<AutoGenSettingsFormValues>({
    resolver,
    mode: 'onChange',
    defaultValues: {
      base_prompt: defaultBasePrompt ?? '',
      frequency_days: defaultFrequencyDays ?? 5,
      channels: defaultChannels ?? ['Twitter', 'LinkedIn'],
    },
  })

  // --- Hooks ---
  const queryClient = useQueryClient()
  const updateSettingsMutation = useMutation({
    mutationFn: (payload: AutopilotSettings) =>
      autopilotApi.updateAutoPilotSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.autopilotSettings],
      })
      toast.success('Auto generation settings saved')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Failed to save auto generation settings')
    },
  })

  // --- Effect ---
  /**
   * Keep form in sync with incoming defaults when modal opens or props change
   */
  useEffect(() => {
    if (!open) return
    form.reset({
      base_prompt: defaultBasePrompt ?? '',
      frequency_days: defaultFrequencyDays ?? 5,
      channels: (defaultChannels ?? ['Twitter', 'LinkedIn']) as channelType[],
    })
  }, [open, defaultBasePrompt, defaultFrequencyDays, defaultChannels, form])

  // --- Functions ---
  /**
   * Handle form submission
   *
   * @param _values Form values
   */
  const onSubmit: SubmitHandler<AutoGenSettingsFormValues> = _values => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const payload: AutopilotSettings = {
      enabled: true,
      base_prompt: _values.base_prompt ?? '',
      frequency_days: _values.frequency_days,
      channels: _values.channels as channelType[],
      user_timezone: timezone,
    }
    updateSettingsMutation.mutate(payload)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card w-max p-5 md:max-w-xl">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-2">
            <Settings2 className="size-5" />
            Auto Generation Settings
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 grid gap-6"
          >
            {/* Base Prompt */}
            <BasePromptField formControl={form.control} />

            <div className="flex flex-col gap-6">
              {/* Frequency */}
              <FrequencyField formControl={form.control} />

              {/* Channels */}
              <ChannelsField formControl={form.control} />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              {/* Cancel button */}
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              {/* Save button */}
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || updateSettingsMutation.isPending
                }
              >
                {updateSettingsMutation.isPending
                  ? 'Saving...'
                  : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

interface FormFieldProps {
  formControl: Control<AutoGenSettingsFormValues>
}

const BasePromptField = ({ formControl }: FormFieldProps) => {
  return (
    <FormField
      control={formControl}
      name="base_prompt"
      render={({ field }) => (
        <FormItem className="text-card-foreground">
          <FormLabel>
            Base Prompt
            <span className="text-muted-foreground text-xs">(optional)</span>
          </FormLabel>
          <FormDescription className="text-balance">
            Additional context for generating posts, Every time Luua generate a
            AI post this prompt will be utilized along with the inspiration.
          </FormDescription>
          <FormControl>
            <Textarea
              placeholder="Your answer..."
              className="min-h-18"
              maxLength={10000}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

const FrequencyField = ({ formControl }: FormFieldProps) => {
  return (
    <FormField
      control={formControl}
      name="frequency_days"
      render={({ field }) => (
        <FormItem className="text-card-foreground">
          <FormLabel>
            Posting Frequency
            <span className="text-muted-foreground text-xs">(days)</span>
          </FormLabel>
          <FormDescription className="text-balance">
            How often do you want to generate AI posts ?
          </FormDescription>
          <FormControl>
            <Input type="number" min={1} max={30} {...field} />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}

const ChannelsField = ({ formControl }: FormFieldProps) => {
  return (
    <FormField
      control={formControl}
      name="channels"
      render={({ field }) => {
        const selected = field.value as channelType[]
        const toggle = (name: channelType) => {
          const isSelected = selected?.includes(name)
          // Prevent removing the last remaining channel
          if (isSelected && (selected?.length ?? 0) <= 1) return
          const next = isSelected
            ? selected.filter(n => n !== name)
            : [...(selected ?? []), name]
          field.onChange(next)
        }
        const label = selected?.length ? selected.join(', ') : 'Select channels'

        return (
          <FormItem className="text-card-foreground">
            <FormLabel>Social Channels</FormLabel>
            <FormDescription className="text-balance">
              Which Socials to generate posts for ?
            </FormDescription>
            <FormControl>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="justify-between"
                  >
                    <span>{label}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  usePortal={false}
                  className="z-[100]"
                >
                  {SOCIAL_PLATFORM.map(sp => (
                    <DropdownMenuCheckboxItem
                      key={sp.name}
                      checked={selected?.includes(sp.name as channelType)}
                      onCheckedChange={() => toggle(sp.name as channelType)}
                      className="capitalize"
                    >
                      {sp.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )
      }}
    />
  )
}

export default AutoGenSettingsModal
