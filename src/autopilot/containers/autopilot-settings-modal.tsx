import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Control, type Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { autopilotApi } from '@/core/api/autopilot.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
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
import { Switch } from '@/shared/ui/switch'
import { Textarea } from '@/shared/ui/textarea'

import {
  AutopilotSettingsFromValues,
  autopilotSettingsSchema,
} from '../models/autopilot-settings.model'

type AutopilotSettingsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultBasePrompt?: string
  defaultFrequencyDays?: number
  defaultChannels?: channelType[]
  defaultAutoPublish?: boolean
}

function AutopilotSettingsModal({
  open,
  onOpenChange,
  defaultBasePrompt,
  defaultFrequencyDays,
  defaultChannels,
  defaultAutoPublish,
}: AutopilotSettingsModalProps) {
  const user = useUserState()
  const baseChannels = useMemo<channelType[]>(
    () => (user?.plan === 'Pro' ? ['Twitter', 'LinkedIn'] : ['LinkedIn']),
    [user?.plan]
  )

  // --- Form ---
  const resolver = zodResolver(
    autopilotSettingsSchema
  ) as Resolver<AutopilotSettingsFromValues>
  const form = useForm<AutopilotSettingsFromValues>({
    resolver,
    mode: 'onChange',
    defaultValues: {
      base_prompt: defaultBasePrompt ?? '',
      frequency_days: defaultFrequencyDays ?? 5,
      channels: defaultChannels ?? baseChannels,
      auto_publish: defaultAutoPublish ?? false,
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
      toast.success('Auto pilot settings saved')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Failed to save auto pilot settings')
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
      channels: (defaultChannels ?? baseChannels) as channelType[],
      auto_publish: defaultAutoPublish ?? false,
    })
  }, [
    open,
    defaultBasePrompt,
    defaultFrequencyDays,
    defaultChannels,
    defaultAutoPublish,
    form,
    baseChannels,
  ])

  // --- Functions ---
  /**
   * Handle form submission
   *
   * @param _values Form values
   */
  const onSubmit: SubmitHandler<AutopilotSettingsFromValues> = _values => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const payload: AutopilotSettings = {
      enabled: true,
      auto_publish: _values.auto_publish ?? false,
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
            Autopilot Settings
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
              <ChannelsField
                formControl={form.control}
                baseChannels={baseChannels}
              />
            </div>

            {/* Auto Publish */}
            <AutoPublishField formControl={form.control} />

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
  formControl: Control<AutopilotSettingsFromValues>
}

const BasePromptField = ({ formControl }: FormFieldProps) => {
  return (
    <FormField
      control={formControl}
      name="base_prompt"
      render={({ field }) => (
        <FormItem className="text-card-foreground">
          <FormLabel>
            Global Instructions
            <span className="text-muted-foreground text-xs">(optional)</span>
          </FormLabel>
          <FormDescription className="text-balance">
            These instructions apply to every draft Luua generates.
          </FormDescription>
          <FormControl>
            <Textarea
              placeholder="Keep paragraphs short, bullet points style etc..."
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

const AutoPublishField = ({ formControl }: FormFieldProps) => {
  return (
    <FormField
      control={formControl}
      name="auto_publish"
      render={({ field }) => (
        <FormItem className="text-card-foreground flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel>Auto Publish</FormLabel>
            <FormDescription className="text-balance">
              Automatically publish generated posts without manual review
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              className="cursor-pointer"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

const ChannelsField = ({
  formControl,
  baseChannels,
}: FormFieldProps & { baseChannels: channelType[] }) => {
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
                  {baseChannels.map(sp => (
                    <DropdownMenuCheckboxItem
                      key={sp}
                      checked={selected?.includes(sp)}
                      onCheckedChange={() => toggle(sp)}
                      className="capitalize"
                    >
                      {sp}
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

export default AutopilotSettingsModal
