import { useNavigate } from '@tanstack/react-router'
import { PlugZap } from 'lucide-react'

import { channelType } from '@/core/models/social.model'
import { Button } from '@/shared/ui/button'

interface SocialNotConnectedProps {
  social: channelType
}

function SocialNotConnected({ social }: SocialNotConnectedProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-10">
      {/* Helping text */}
      <p className="text-center text-lg font-semibold">
        Connect {social} in settings to start writing.
      </p>

      {/* Connect button */}
      <Button
        variant="default"
        onClick={() =>
          navigate({ to: '/settings', search: { tabs: 'socials' } })
        }
      >
        <PlugZap className="size-4" />
        Connect
      </Button>
    </div>
  )
}

export default SocialNotConnected
