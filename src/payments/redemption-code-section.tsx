import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { REDEMPTION_CODE_LENGTH } from '@/auth/config/otp-verification.config'
import { redemptionCodeApi } from '@/core/api/redemption-code.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { type ApiError } from '@/core/models/api.model'
import { consumePendingRedemptionCode } from '@/payments/pending-redemption-code.storage'
import { RedemptionCodeOtp } from '@/shared/components/redemption-code-otp'
import { BorderBeam } from '@/shared/ui/border-beam'
import { Button } from '@/shared/ui/button'

const GENERIC_REDEMPTION_ERROR =
  'Could not redeem this code. Please check it and try again.'

type RedemptionFeedback = {
  type: 'success' | 'error'
  message: string
}

function getRedemptionErrorMessage(error: unknown) {
  const apiError = error as ApiError
  const detail = apiError.detail

  if (typeof detail === 'string') return detail

  if (
    detail &&
    typeof detail === 'object' &&
    !Array.isArray(detail) &&
    typeof detail.error === 'string'
  ) {
    return detail.error
  }

  return GENERIC_REDEMPTION_ERROR
}

function getFeedbackId(feedback: RedemptionFeedback | null) {
  return feedback ? 'redemption-code-feedback' : undefined
}

function normalizeRedemptionCodeInput(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, REDEMPTION_CODE_LENGTH)
}

export function RedemptionCodeSection({ orgRole }: { orgRole?: string }) {
  const navigate = useNavigate({ from: '/payments' })
  const { code: urlCode } = useSearch({ from: '/payments' })

  const queryClient = useQueryClient()
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState<RedemptionFeedback | null>(null)
  const [isRefreshingAfterRedeem, setIsRefreshingAfterRedeem] = useState(false)
  const linkRedeemIntentRef = useRef<'none' | 'link' | 'stash'>('none')
  const linkAutoSubmitDoneRef = useRef(false)

  const isOwner = orgRole === 'owner'
  const trimmedCode = code.trim()
  const feedbackId = getFeedbackId(feedback)
  const ownerNoteId = isOwner ? undefined : 'redemption-code-owner-note'
  const describedBy = useMemo(
    () => [feedbackId, ownerNoteId].filter(Boolean).join(' ') || undefined,
    [feedbackId, ownerNoteId]
  )

  const redeemCodeMutation = useMutation({
    mutationFn: (redeemCode: string) =>
      redemptionCodeApi.redeemCode({ code: redeemCode }),
    onSuccess: async response => {
      const { plan, duration_days: durationDays } = response.data
      const successMessage = `${plan} unlocked for ${durationDays} days. Refreshing your workspace.`

      setCode('')
      setFeedback({ type: 'success', message: successMessage })
      toast.success(`${plan} unlocked for ${durationDays} days`)

      setIsRefreshingAfterRedeem(true)
      try {
        await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.user] })
      } finally {
        setIsRefreshingAfterRedeem(false)
      }
    },
    onError: error => {
      const errorMessage = getRedemptionErrorMessage(error)
      setFeedback({ type: 'error', message: errorMessage })
      toast.error(errorMessage)
    },
  })

  const isPending = redeemCodeMutation.isPending
  const isBusy = isPending || isRefreshingAfterRedeem
  const isDisabled = !isOwner || isBusy

  useEffect(() => {
    const urlNormalized =
      typeof urlCode === 'string' && urlCode.trim() !== ''
        ? normalizeRedemptionCodeInput(urlCode.trim())
        : ''

    if (urlNormalized.length > 0) {
      navigate({ replace: true, search: {} })
      consumePendingRedemptionCode()
      setCode(urlNormalized)
      linkRedeemIntentRef.current =
        urlNormalized.length === REDEMPTION_CODE_LENGTH ? 'link' : 'none'
      return
    }

    const pending = consumePendingRedemptionCode()
    if (pending) {
      setCode(normalizeRedemptionCodeInput(pending))
      linkRedeemIntentRef.current = 'stash'
    }
  }, [urlCode, navigate])

  useEffect(() => {
    if (linkRedeemIntentRef.current !== 'link') return
    if (linkAutoSubmitDoneRef.current) return
    if (!isOwner || isBusy) return

    const normalized = normalizeRedemptionCodeInput(trimmedCode)
    if (normalized.length !== REDEMPTION_CODE_LENGTH) return

    linkAutoSubmitDoneRef.current = true
    linkRedeemIntentRef.current = 'none'
    setFeedback(null)
    redeemCodeMutation.mutate(normalized)
  }, [trimmedCode, isOwner, isBusy, redeemCodeMutation])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isOwner || isBusy) return

    if (trimmedCode.length !== REDEMPTION_CODE_LENGTH) {
      setFeedback({
        type: 'error',
        message: 'Enter the six-character code exactly as provided.',
      })
      return
    }

    setFeedback(null)
    redeemCodeMutation.mutate(trimmedCode)
  }

  const handleCodeChange = (value: string) => {
    setCode(value)
    setFeedback(null)
  }

  return (
    <div className="bg-muted/50 dark:bg-muted/75 relative w-full overflow-hidden rounded-xl border p-1">
      <BorderBeam
        borderWidth={1}
        colorFrom="#f4ce14"
        colorTo="#22c55e"
        duration={10}
        size={180}
      />

      <div className="bg-background relative rounded-lg border px-5 py-5 shadow-sm sm:px-6 sm:py-6 dark:shadow-black/20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="min-w-0 lg:max-w-md lg:shrink">
            <h3 className="text-2xl font-medium tracking-tight">
              Redeem an invite for Pro
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-balance">
              If our team or a partner gave you a code, enter it below to enable
              Pro on this organisation for 30 days. No Credit Card Required.
            </p>
          </div>

          <form className="w-full min-w-0 lg:flex-1" onSubmit={handleSubmit}>
            <div className="w-full lg:ml-auto lg:max-w-xl">
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <label
                    className="text-foreground font-medium"
                    htmlFor="redemption-code"
                  >
                    Redemption code
                  </label>
                  <RedemptionCodeOtp
                    aria-describedby={describedBy}
                    autoComplete="off"
                    containerClassName="min-w-0 justify-start sm:flex-nowrap"
                    disabled={isDisabled}
                    hasError={feedback?.type === 'error'}
                    id="redemption-code"
                    value={code}
                    onChange={handleCodeChange}
                  />
                </div>
                <Button
                  aria-busy={isBusy || undefined}
                  className="h-11 w-full shrink-0 sm:w-auto sm:min-w-[9rem]"
                  disabled={isDisabled}
                  type="submit"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Redeeming
                    </>
                  ) : isRefreshingAfterRedeem ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Updating
                    </>
                  ) : (
                    'Redeem'
                  )}
                </Button>
              </div>

              {!isOwner ? (
                <p
                  className="text-muted-foreground mt-3 text-xs leading-5"
                  id={ownerNoteId}
                >
                  Only the organisation owner can redeem a code.
                </p>
              ) : null}

              {isOwner && feedback ? (
                <p
                  className={
                    feedback.type === 'success'
                      ? 'mt-3 flex items-start gap-2 text-xs leading-5 text-green-700 dark:text-green-400'
                      : 'text-destructive mt-3 flex items-start gap-2 text-xs leading-5'
                  }
                  aria-busy={
                    feedback.type === 'success' && isRefreshingAfterRedeem
                  }
                  id={feedbackId}
                  role={feedback.type === 'error' ? 'alert' : 'status'}
                >
                  {feedback.type === 'success' && isRefreshingAfterRedeem ? (
                    <Loader2
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 animate-spin text-green-600 dark:text-green-400"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className={
                        feedback.type === 'success'
                          ? 'mt-2 size-1.5 shrink-0 rounded-full bg-green-600 dark:bg-green-400'
                          : 'bg-destructive mt-2 size-1.5 shrink-0 rounded-full'
                      }
                    />
                  )}
                  <span>{feedback.message}</span>
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
