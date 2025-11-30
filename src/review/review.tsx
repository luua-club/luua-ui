import { useQuery } from '@tanstack/react-query'
import {
  createLazyRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router'
import { format } from 'date-fns'
import { Check, ChevronLeft, LoaderCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { usePublishDraft } from '@/core/hooks/publish-draft.hook'
import { useScheduleDraft } from '@/core/hooks/schedule-draft.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { DraftItem, PostItem } from '@/core/models/draft.model'
import { showConfetti } from '@/core/utils/common.util'
import { isSocialConnected } from '@/core/utils/social.utils'
import GlobalLoader from '@/shared/components/global-loader'
import { Button } from '@/shared/ui/button'
import { Stepper, StepperContent, StepperPanel } from '@/shared/ui/stepper'
import { cn } from '@/shared/utils'

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

  // --- Hooks ---
  const { draftId } = useParams({ from: '/review/$draftId' })
  const search: { schedule?: string } = useSearch({
    from: '/review/$draftId',
  })
  const userState = useUserState()
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
   * Set selected posts
   */
  useEffect(() => {
    if (draft?.posts) {
      setSelectedPosts(draft.posts)
    }
  }, [draft])

  /**
   * Handle error
   */
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load draft')
      navigate({ to: '/creation/drafts' })
    }
  }, [isError, navigate])

  // --- Computed variables ---
  const postViewSteps =
    search.schedule === 'true' ? schedulePostSteps : publishPostSteps

  const selectedChannels = Array.from(
    new Set(selectedPosts.map(p => p.channel))
  )

  const allChannelsConnected = userState
    ? selectedChannels.every(channel => isSocialConnected(channel, userState))
    : false

  const isPublishDisabled =
    currentStep > postViewSteps.length ||
    selectedPosts.length === 0 ||
    (currentStep >= postViewSteps.length && !allChannelsConnected)

  // Early return
  if (!userState) {
    return <GlobalLoader />
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10">
      <Button
        size="sm"
        variant={'outline'}
        className="h-6 !px-1 text-xs"
        onClick={() =>
          navigate({ to: '/creation/create', search: { draftId } })
        }
      >
        <ChevronLeft className="size-3.5" />
        Back to editing
      </Button>
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
                <SchedulePost setSelectedUTCDate={setSelectedUTCDate} />
              )}

              {step.id === 'publish' && (
                <ConnectPublish
                  user={userState}
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
        />
      </Stepper>
    </div>
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
          })
          toast.success('Posts scheduled successfully!')
          navigate({ to: '/schedule' })
          return
        } else {
          await publishDraft.mutateAsync({
            draftRequest: {
              posts: selectedPosts,
              id: draftId,
            },
            forChannel: channels,
          })
          toast.success('Posts published successfully!')
        }

        showConfetti()
        navigate({ to: '/published' })
      } catch {
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
        </div>
      </div>
    </div>
  )
}
