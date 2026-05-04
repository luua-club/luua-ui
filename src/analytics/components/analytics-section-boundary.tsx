import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { Component, type ReactNode, Suspense } from 'react'

import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'

type AnalyticsSectionBoundaryProps = {
  title: string
  fallback: ReactNode
  children: ReactNode
}

type ErrorBoundaryProps = {
  title: string
  onReset: () => void
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

class AnalyticsErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  private reset = () => {
    this.props.onReset()
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <Card className="border-destructive/20 bg-destructive/5 rounded-xl border p-5 shadow-none">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                {this.props.title} could not load
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Retry this section without affecting the rest of analytics.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={this.reset}
            >
              <RefreshCw className="size-3.5" />
              Retry
            </Button>
          </div>
        </Card>
      )
    }

    return this.props.children
  }
}

export default function AnalyticsSectionBoundary({
  title,
  fallback,
  children,
}: AnalyticsSectionBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <AnalyticsErrorBoundary title={title} onReset={reset}>
          <Suspense fallback={fallback}>{children}</Suspense>
        </AnalyticsErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
