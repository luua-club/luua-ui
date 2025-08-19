import { useNavigate } from '@tanstack/react-router'
import { PlugZap } from 'lucide-react'

import { channelType } from '@/core/models/social.model'
import { Button } from '@/shared/ui/button'

const SocialNotConnected = ({ social }: { social: channelType }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-sidebar flex flex-col items-center justify-center gap-4 rounded-md border-1 px-16 py-10">
      <p className="text-lg font-semibold">
        Connect {social} in settings to start writing.
      </p>
      <Button
        variant="default"
        onClick={() =>
          navigate({ to: '/settings', search: { tabs: 'socials' } })
        }
      >
        <PlugZap />
        Connect
      </Button>
    </div>
  )
}

export default SocialNotConnected
