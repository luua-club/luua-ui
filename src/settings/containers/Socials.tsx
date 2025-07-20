import { PlugZap } from 'lucide-react'

import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { ISocialChannel } from '@/core/models/social.model'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { BorderBeam } from '@/shared/ui/border-beam'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter } from '@/shared/ui/card'
import { Separator } from '@/shared/ui/separator'
import { cn } from '@/shared/utils'

const isLinkedinConnected = false
const isTwitterConnected = true

const Socials = () => {
  const twitter = SOCIAL_PLATFORM.find(s => s.name === 'X')!
  const linkedin = SOCIAL_PLATFORM.find(s => s.name === 'Linkedin')!

  return (
    <>
      {/* Heading */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Social Platforms</h1>
      </div>
      <Separator />
      <p className="text-muted-foreground mt-4 text-base text-balance lg:max-w-2xl">
        Social account connection is required to post content to your social
        accounts, AI content can only be generated only when at least one social
        account is connected.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 lg:max-w-2xl lg:grid-cols-2">
        <SocialCard
          platform={twitter}
          isAccountConnected={isTwitterConnected}
        />
        <SocialCard
          platform={linkedin}
          isAccountConnected={isLinkedinConnected}
        />
      </div>
    </>
  )
}

const SocialCard = ({
  platform,
  isAccountConnected,
}: {
  platform: ISocialChannel
  isAccountConnected?: boolean
}) => {
  const user = {
    name: 'shadcn',
    username: '@shadcn',
    image: 'https://github.com/shadcn.png',
  }

  return (
    <Card className="relative flex flex-col overflow-hidden rounded-md p-4 shadow-none">
      <BorderBeam
        duration={20}
        size={150}
        colorTo={isAccountConnected ? '#34D399' : '#DC2626'}
        colorFrom={isAccountConnected ? '#34D399' : '#DC2626'}
        borderWidth={2}
      />

      <CardContent className="flex h-24 flex-col p-0">
        <div className="flex items-center justify-between">
          {isAccountConnected ? (
            <div className="flex items-center">
              <Avatar className="bg-accent h-12 w-12 rounded-full">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>{'DL'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col pl-2">
                <h6 className="text-base font-medium">{user.name}</h6>
                {user.username && (
                  <p className="text-xs font-medium text-gray-400">
                    {user.username}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-xl font-medium">
                {platform.name === 'X' ? 'Twitter' : platform.name}
              </p>
              <span
                className={cn('size-1.5 animate-pulse rounded-full bg-red-500')}
              ></span>
            </div>
          )}
          {platform && platform.logo && (
            <platform.logo className="size-10 rounded-full border-1 border-dashed p-2" />
          )}
        </div>
        <p
          className={cn(
            'mt-2 text-sm text-gray-400',
            isAccountConnected ? '' : 'text-black'
          )}
        >
          {isAccountConnected
            ? 'Your account is connected, now you can post content to this platform.'
            : 'Please connect your social account to get started, click on connect button'}
        </p>
      </CardContent>
      <CardFooter className="p-0">
        <Button
          className="w-full"
          variant={isAccountConnected ? 'destructive' : 'outline'}
        >
          <PlugZap />
          {isAccountConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Socials
