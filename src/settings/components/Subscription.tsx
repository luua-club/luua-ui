import { useRouter } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Box } from 'lucide-react'

import { ISubscriptionDetails } from '@/core/models/payment.model'
import { UserState } from '@/core/models/user.model'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
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

function Subscription({ user, subscriptionDetails }: ISubscriptionProps) {
  const router = useRouter()
  const isFreePlan = user.plan === 'Free'

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
                <TableHead className="w-[100px]">Sno.</TableHead>
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
      <div className="space-y-3 py-4">
        <h1 className="font-bold">Subscription Overview</h1>
        <Separator />
        <p className="text-muted-foreground text-sm">
          Summarizes all your payment and subscription for the purchased
          Applications
        </p>
      </div>

      {isFreePlan && subscriptionDetails.length === 0 ? (
        <div className="mt-1 rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-[100px]">Sno.</TableHead>
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
                  <p className="flex flex-col items-center justify-center gap-3">
                    No Active Subscription Found
                    <Button
                      variant="default"
                      size="sm"
                      className="text-xs"
                      onClick={() =>
                        router.navigate({
                          to: '/payments',
                        })
                      }
                    >
                      <Box />
                      Upgrade Plan
                    </Button>
                  </p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="mt-1 rounded-md border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[20px] sm:w-[100px]">Sno.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Started At</TableHead>
                  <TableHead className="text-right">Ends At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionDetails.map((subscription, index) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="rounded-sm">
                        {subscription.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.plan}</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(subscription.started_at), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      {format(new Date(subscription.expires_at), 'dd MMM yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-muted-foreground px-1 py-4 text-xs font-medium">
            Facing issues? please contact us at{' '}
            <a
              href="mailto:support@luua.club"
              className="text-primary hover:underline"
            >
              support@luua.club
            </a>
          </p>
        </>
      )}
    </>
  )
}

export default Subscription
