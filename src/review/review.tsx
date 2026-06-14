import { useQuery } from '@tanstack/react-query'
import {
  createLazyRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router'
import { format } from 'date-fns'
import { Check, ChevronLeft, LoaderCircleIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import { paymentApi } from '@/core/api/payment.api'
import {
  isUsageLimitReached,
  shouldShowFreeLimitNudge,
} from '@/core/billing/plan-entitlements'
import { UpgradeCallout } from '@/core/components/billing'
import { LANDING_PRICING_URL, QUERY_KEYS } from '@/core/config/constant'
import { usePublishDraft } from '@/core/hooks/publish-draft.hook'
import { useScheduleDraft } from '@/core/hooks/schedule-draft.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { DraftItem, ILockedByUser, PostItem } from '@/core/models/draft.model'
import { isSocialConnected } from '@/core/utils/social.utils'
import { DraftLockedBanner } from '@/shared/components/draft-locked-banner'
import GlobalLoader from '@/shared/components/global-loader'
import { Button } from '@/shared/ui/button'
import { Stepper, StepperContent, StepperPanel } from '@/shared/ui/stepper'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn, showConfetti } from '@/shared/utils'

import ConnectPublish from './components/connect-publish'
import ReviewPostView from './components/review-post-view'
import { ReviewStepperNav } from './components/review-stepper-nav'
import SchedulePost from './components/schedule-post'
import { publishPostSteps, schedulePostSteps, Step } from './constant'

function Review() {
  // --- States ---
  const [selectedPosts, setSelectedPosts] = useState<PostItem[]>([])
  const [selectedUTCDate, setSelectedUTCDate] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLocked, setIsLocked] = useState<boolean | null>(null)
  const [lockedByUser, setLockedByUser] = useState<ILockedByUser | null>(null)

  // --- Refs ---
  const lockAcquiredRef = useRef(false)
  const versionRef = useRef<number | null>(null)
  const lockAttemptedForRef = useRef<string | null>(null)

  // --- Hooks ---
  const { draftId } = useParams({ from: '/review/$draftId' })
  const search: { schedule?: string } = useSearch({
    from: '/review/$draftId',
  })
  const userState = useUserState()
  const connectedChannels = userState?.connectedChannels
  const navigate = useNavigate()
  const { mutation: publishDraft } = usePublishDraft()
  const { mutation: scheduleDraft } = useScheduleDraft()

  // --- Queries ---
  /**
   * Get draft
   */
  const {
    data: draft,
    isLoading,
    isError,
  } = useQuery<DraftItem>({
    queryKey: [QUERY_KEYS.draft, draftId],
    queryFn: async () => {
      const res = await draftsApi.getDraft(draftId as string)
      return res.data
    },
    enabled: !!draftId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })

  // --- Effects ---
  /**
   * Set selected posts and track version
   */
  useEffect(() => {
    if (draft?.posts) {
      setSelectedPosts(draft.posts)
      versionRef.current = draft.version
    }
  }, [draft])

  /**
   * Acquire lock on mount, release on unmount
   */
  useEffect(() => {
    if (!draftId || !draft) return
    if (lockAttemptedForRef.current === draftId) return
    lockAttemptedForRef.current = draftId

    let cancelled = false

    const acquireLock = async () => {
      try {
        const res = await draftsApi.lockDraft(draftId)
        if (cancelled) return

        if (!res.data.lock_acquired) {
          lockAcquiredRef.current = false
          setIsLocked(false)
          setLockedByUser(
            res.data.locked_by ?? {
              user_id: '',
              user_name: 'Another user',
              email: '',
            }
          )
          return
        }

        lockAcquiredRef.current = true
        setIsLocked(true)
      } catch {
        if (cancelled) return
        lockAcquiredRef.current = false
        setIsLocked(false)
        setLockedByUser({ user_id: '', user_name: 'Another user', email: '' })
      }
    }

    acquireLock()

    return () => {
      cancelled = true
      lockAttemptedForRef.current = null
      if (lockAcquiredRef.current) {
        lockAcquiredRef.current = false
        draftsApi.unlockDraft(draftId).catch(() => {
          // Best effort
        })
      }
      setIsLocked(null)
    }
  }, [draftId, draft])

  /**
   * Handle error
   */
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load draft')
      navigate({ to: '/drafts' })
    }
  }, [isError, navigate])

  // --- Computed variables ---
  const postViewSteps =
    search.schedule === 'true' ? schedulePostSteps : publishPostSteps
  const isScheduleFlow = search.schedule === 'true'

  const { data: usageSummary } = useQuery({
    queryKey: [QUERY_KEYS.usageSummary, 'review-schedule'],
    queryFn: () => paymentApi.getUsage(),
    enabled: isScheduleFlow && userState?.plan === 'Free',
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })

  const scheduleUsageLimit =
    usageSummary?.data?.usage_summary.limits.scheduled_posts
  const showScheduleLimitNudge = shouldShowFreeLimitNudge(
    userState?.plan,
    scheduleUsageLimit
  )
  const scheduleLimitReached =
    userState?.plan === 'Free' && isUsageLimitReached(scheduleUsageLimit)

  const selectedChannels = Array.from(
    new Set(selectedPosts.map(p => p.channel))
  )

  const allChannelsConnected = selectedChannels.every(channel =>
    isSocialConnected(channel, connectedChannels)
  )

  const isPublishDisabled =
    currentStep > postViewSteps.length ||
    selectedPosts.length === 0 ||
    (currentStep >= postViewSteps.length && !allChannelsConnected) ||
    isLocked === false

  // Early return
  if (!userState) {
    return <GlobalLoader />
  }

  return (
    <>
      <Button
        size="sm"
        variant={'outline'}
        className="mt-14 ml-4 text-xs md:m-4"
        onClick={() =>
          navigate({ to: '/creation/create', search: { draftId } })
        }
      >
        <ChevronLeft className="size-3.5" />
        Back to editing
      </Button>

      {lockedByUser && (
        <div className="mx-auto mt-4 max-w-4xl px-4">
          <DraftLockedBanner
            name={lockedByUser.user_name}
            email={lockedByUser.email}
          />
        </div>
      )}

      <div className="mx-auto mt-8 max-w-4xl px-4 pb-10">
        <Stepper
          value={currentStep}
          onValueChange={setCurrentStep}
          indicators={{
            completed: <Check className="size-4" />,
            loading: <LoaderCircleIcon className="size-4 animate-spin" />,
          }}
          className="mt-4 space-y-8"
        >
          {/* Stepper Header */}
          <ReviewStepperNav
            steps={postViewSteps}
            loadingStep={
              isLoading
                ? 'review'
                : publishDraft.isPending || scheduleDraft.isPending
                  ? 'publish'
                  : undefined
            }
          />

          {/* Stepper Content */}
          <StepperPanel className="text-sm">
            {postViewSteps.map((step, index) => (
              <StepperContent key={index} value={index + 1}>
                {step.id === 'review' && (
                  <ReviewPostView
                    posts={draft?.posts || []}
                    isLoading={isLoading}
                    selectedPosts={selectedPosts}
                    onSelectionChange={setSelectedPosts}
                  />
                )}

                {step.id === 'schedule' && (
                  <div className="flex flex-col gap-3">
                    <SchedulePost setSelectedUTCDate={setSelectedUTCDate} />

                    {showScheduleLimitNudge ? (
                      <UpgradeCallout
                        compact
                        title={
                          scheduleLimitReached
                            ? 'Free schedule limit reached'
                            : 'Almost at your schedule limit'
                        }
                        description="Free includes 5 scheduled posts each month. Upgrade for unlimited scheduling."
                        usage={{
                          label: 'Scheduled posts',
                          limit: scheduleUsageLimit,
                        }}
                        actionLabel="Upgrade to Pro"
                        className="max-w-md"
                      />
                    ) : null}
                  </div>
                )}

                {step.id === 'publish' && (
                  <ConnectPublish
                    channels={selectedChannels}
                    hideQuickShare={!!search.schedule || allChannelsConnected}
                    selectedPosts={selectedPosts}
                  />
                )}
              </StepperContent>
            ))}
          </StepperPanel>

          {/* Stepper Navigation */}
          <StepperNavigation
            isLoading={isLoading}
            currentStep={currentStep}
            totalSteps={postViewSteps.length}
            isPublishDisabled={isPublishDisabled}
            onPrevious={() => setCurrentStep(prev => prev - 1)}
            onNext={() => setCurrentStep(prev => prev + 1)}
            publishDraft={publishDraft}
            selectedPosts={selectedPosts}
            draftId={draftId}
            isSchedule={!!search.schedule}
            selectedUTCDate={selectedUTCDate}
            currentStepId={postViewSteps[currentStep - 1]?.id}
            scheduleDraft={scheduleDraft}
            version={versionRef.current}
            isLocked={isLocked}
            isScheduleLimitReached={scheduleLimitReached}
          />
        </Stepper>
      </div>
    </>
  )
}

export const Route = createLazyRoute('/review/$draftId')({
  component: Review,
})

interface StepperNavigationProps {
  isLoading: boolean
  currentStep: number
  totalSteps: number
  isPublishDisabled: boolean
  onPrevious: () => void
  onNext: () => void
  publishDraft: ReturnType<typeof usePublishDraft>['mutation']
  selectedPosts: PostItem[]
  draftId: string
  selectedUTCDate: string | null
  isSchedule: boolean
  currentStepId?: Step['id']
  scheduleDraft: ReturnType<typeof useScheduleDraft>['mutation']
  version: number | null
  isLocked: boolean | null
  isScheduleLimitReached: boolean
}

function StepperNavigation({
  isLoading,
  currentStep,
  totalSteps,
  isPublishDisabled,
  onPrevious,
  onNext,
  publishDraft,
  selectedPosts,
  draftId,
  selectedUTCDate,
  isSchedule,
  currentStepId,
  scheduleDraft,
  version,
  isLocked,
  isScheduleLimitReached,
}: StepperNavigationProps) {
  const navigate = useNavigate()

  const getButtonText = () => {
    if (publishDraft.isPending) return 'Publishing...'
    if (scheduleDraft.isPending) return 'Scheduling...'
    if (currentStep >= totalSteps) {
      return isSchedule ? 'Schedule' : 'Publish Now'
    }
    return 'Next'
  }

  const handleNext = async () => {
    // If we're on the final step, publish or schedule the draft
    if (currentStep >= totalSteps) {
      try {
        // Extract unique channels from selected posts
        const channels = Array.from(
          new Set(selectedPosts.map(post => post.channel))
        )

        if (isSchedule && selectedUTCDate) {
          await scheduleDraft.mutateAsync({
            draftRequest: {
              posts: selectedPosts,
              id: draftId,
            },
            forChannel: channels,
            scheduleDate: selectedUTCDate,
            version: version ?? 0,
          })
          toast.success('Posts scheduled successfully!')
          navigate({ to: '/posts-view/list', search: { status: 'Scheduled' } })
          return
        } else {
          await publishDraft.mutateAsync({
            draftRequest: {
              posts: selectedPosts,
              id: draftId,
            },
            forChannel: channels,
            version: version ?? 0,
          })
          toast.success('Posts published successfully!')
        }

        showConfetti()
        navigate({ to: '/posts-view/list' })
      } catch {
        if (isSchedule && isScheduleLimitReached) {
          toast.error('Free scheduling limit reached', {
            description:
              'Free includes 5 scheduled posts each month. Upgrade to Pro for unlimited scheduling.',
            action: {
              label: 'Upgrade',
              onClick: () => {
                window.location.href = LANDING_PRICING_URL
              },
            },
          })
          return
        }

        toast.error(
          isSchedule ? 'Failed to schedule posts' : 'Failed to publish posts'
        )
      }
    } else {
      // Otherwise, just go to the next step
      onNext()
    }
  }
  return (
    <div className="flex flex-col gap-4">
      <div className={cn('flex justify-between gap-4', isLoading && 'hidden')}>
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        <div className="flex gap-4">
          {isSchedule && selectedUTCDate && currentStepId === 'schedule' && (
            <div className="hidden items-center text-sm md:flex">
              Post will be scheduled on&nbsp;
              <span className="font-semibold">
                {new Date(selectedUTCDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
              &nbsp;at&nbsp;
              <span className="font-semibold">
                {format(new Date(selectedUTCDate), 'HH:mm')}
              </span>
              .
            </div>
          )}

          {isLocked === false ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex cursor-not-allowed">
                  <Button
                    variant="default"
                    disabled
                    className="pointer-events-none"
                  >
                    {getButtonText()}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                This draft is locked by another user
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="default"
              onClick={handleNext}
              disabled={
                isPublishDisabled ||
                publishDraft.isPending ||
                scheduleDraft.isPending ||
                (isSchedule &&
                  !selectedUTCDate &&
                  (currentStepId === 'schedule' || currentStep >= totalSteps))
              }
            >
              {getButtonText()}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
