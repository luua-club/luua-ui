import Socials from '@/core/containers/socials'
import type { UserState } from '@/core/models/user.model'
import { Separator } from '@/shared/ui/separator'

function SocialsSettings({ user: _user }: { user: UserState }) {
  return (
    <>
      <div className="py-4">
        <h1 className="text-lg font-medium">Social Platforms</h1>
      </div>
      <Separator />
      <p className="text-muted-foreground mt-4 mb-8 text-sm text-balance lg:max-w-2xl">
        Connect your LinkedIn or X / Twitter safely - we use official
        integrations and never access your personal data. Every post goes live
        only after you approve it.
      </p>
      <Socials />
    </>
  )
}

export default SocialsSettings
