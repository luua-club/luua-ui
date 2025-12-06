import BrandDiscord from '@/assets/images/brand-discord.svg?react'
import BrandInstagram from '@/assets/images/brand-instagram.svg?react'
import BrandX from '@/assets/images/brand-x.svg?react'
import { EXTERNAL_URLS } from '@/core/config/constant'
import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

function WelcomeNavRight() {
  return (
    <div className="mr-2 flex items-center gap-3">
      {/* Discord Btn */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.open(EXTERNAL_URLS.discord, '_blank')
            }}
            className="size-4 p-0"
          >
            <BrandDiscord className="size-4.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Join our Discord</TooltipContent>
      </Tooltip>

      {/* Instagram Btn */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.open(EXTERNAL_URLS.instagram, '_blank')
            }}
            className="size-4 p-0"
          >
            <BrandInstagram className="size-4.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Follow us on Instagram</TooltipContent>
      </Tooltip>

      {/* X Btn */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.open(EXTERNAL_URLS.x, '_blank')
            }}
            className="size-4 p-0"
          >
            <BrandX className="size-4.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Follow us on X</TooltipContent>
      </Tooltip>
    </div>
  )
}

export default WelcomeNavRight
