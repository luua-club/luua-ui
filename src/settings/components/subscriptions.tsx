import { format } from 'date-fns'

import { ISubscriptionDetails } from '@/core/models/payment.model'
import { UserState } from '@/core/models/user.model'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'

interface ISubscriptionProps {
  user: UserState
  subscriptionDetails: ISubscriptionDetails[] | undefined
}

function formatSubscriptionDate(date: string | null) {
  if (!date) return '-'
  return format(new Date(date), 'dd MMM yyyy')
}

function Subscription({ user, subscriptionDetails }: ISubscriptionProps) {
  // --- Early Return ---
  // Show skeleton while subscription data is loading
  if (!subscriptionDetails) {
    return (
      <>
        <div className="space-y-3 py-4">
          <h1 className="font-bold">Subscription Overview</h1>
          <Separator />
          <p className="text-muted-foreground text-sm">
            Summarizes all your payment and subscription for the purchased
            Applications
          </p>
        </div>

        <div className="mt-1 rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Started At</TableHead>
                <TableHead className="text-right">Ends At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton className="h-7 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-7 w-20 rounded-sm" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-7 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-7 w-24" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-7 w-24" />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="py-4">
          <Skeleton className="h-12 w-full" />
        </div>
      </>
    )
  }

  return (
    <>
      {/* Subscription Overview Header */}
      <div className="space-y-3 py-4">
        <h1 className="font-bold">Subscription Overview</h1>
        <Separator />
        <p className="text-muted-foreground text-sm">
          Summarizes all your payment and subscription for the purchased
          Applications
        </p>
      </div>

      {/* Show empty state when no subscription history is available */}
      {subscriptionDetails.length === 0 ? (
        <div className="mt-1 rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Started At</TableHead>
                <TableHead className="text-right">Ends At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-4 text-center font-semibold"
                >
                  No subscription history available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        /* Display subscription history table for users with active/past subscriptions */
        <>
          <div className="mt-1 rounded-md border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Started At</TableHead>
                  <TableHead className="text-right">Ends At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Render each subscription entry */}
                {subscriptionDetails.map(subscription => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <Badge variant="destructive" className="rounded-sm">
                        {subscription.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{subscription.plan ?? user.plan}</TableCell>
                    <TableCell className="text-right">
                      {formatSubscriptionDate(subscription.started_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatSubscriptionDate(subscription.expires_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Support contact information */}
          <p className="text-muted-foreground px-1 py-4 text-xs font-medium">
            Facing issues? please contact us at{' '}
            <a
              href="mailto:support@luua.club"
              className="text-primary hover:underline"
            >
              connect@luua.club
            </a>
          </p>
        </>
      )}
    </>
  )
}

export default Subscription
